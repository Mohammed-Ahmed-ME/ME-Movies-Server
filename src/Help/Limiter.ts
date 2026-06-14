import express, {Request} from "express";
import rateLimit from "express-rate-limit";

const app = express()

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // allow max 5 login attempts per window
    message: "❌ Too many login attempts. Please try again after 15 minutes.",
    keyGenerator: (req:Request) => {
        // Use IP if user not found, or username/email if available
        return req.body.email || req.ip;
    }
});

app.post("/api/Auth/Login", loginLimiter, async (req, res) => {
    // login logic here
});

const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // max 50 requests per user per window
    keyGenerator: (req) => {
        // req.user.id should exist after authentication middleware
        //@ts-ignore
        return req.user ? req.user.id : req.ip; // fallback to IP for non-logged-in users
    },
    message: "Too many requests from this user, please try later"
});


const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 signups per IP per hour
    message: "Too many accounts created from this IP, try again later"
});

app.post("/api/Auth/Register", signupLimiter, (req, res) => {
    // registration logic
});


const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // max 5 OTPModel requests per user
    message: "Too many OTP requests, try later"
});

app.post("/api/auth/send-otp", otpLimiter, (req, res) => {
    // send OTPModel logic
});



// Best Config
const LoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // max 5 login attempts
    message: "❌ Too many login attempts. Please try again later.",
    keyGenerator: (req) => req.body.email || req.ip,
    standardHeaders: true,
    legacyHeaders: false,
});


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP per window
    message: "Too many requests, slow down!",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use("/api/", apiLimiter);


/*
        Why this is good:

        Prevents brute-force attacks (login)

        Protects API from abuse / flooding

        Separate limits for critical routes vs public routes

        Supports modern headers for monitoring (RateLimit-*)
 */







/*

        # **1️⃣ Prevent Brute-Force Login Attempts**

        Limit failed login attempts per user or per IP.

            ```ts
        import rateLimit from "express-rate-limit";

        // Limit login attempts
        const loginLimiter = rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 5, // max 5 attempts
          message: "❌ Too many login attempts. Try again later.",
          keyGenerator: (req) => req.body.email || req.ip
        });

        app.post("/api/Auth/Login", loginLimiter, async (req, res) => {
          // login logic here
        });
        ```

        ---

        # **2️⃣ Protect Registration / Signup Forms**

        Prevent bots from mass-registering accounts.

            ```ts
        const signupLimiter = rateLimit({
          windowMs: 60 * 60 * 1000, // 1 hour
          max: 10, // 10 signups per IP per hour
          message: "Too many accounts created from this IP, try again later"
        });

        app.post("/api/Auth/Register", signupLimiter, (req, res) => {
          // registration logic
        });
        ```

        ---

        # **3️⃣ Prevent Spam on Contact Forms**

        Limit the number of messages someone can send.

            ```ts
        const contactLimiter = rateLimit({
          windowMs: 60 * 60 * 1000, // 1 hour
          max: 3, // max 3 messages per IP per hour
          message: "Too many messages sent, please try later"
        });

        app.post("/api/contact", contactLimiter, (req, res) => {
          // contact form logic
        });
        ```

        ---

        # **4️⃣ Limit OTPModel / Email / Password Reset Requests**

        Prevent abuse of sending emails or SMS.

            ```ts
        const otpLimiter = rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 5, // max 5 OTPModel requests per user
          message: "Too many OTPModel requests, try later"
        });

        app.post("/api/auth/send-otp", otpLimiter, (req, res) => {
          // send OTPModel logic
        });
        ```

        ---

        # **5️⃣ Protect API Endpoints from Abuse**

        Limit requests per user or per IP to prevent resource overload.

            ```ts
        const apiLimiter = rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // max 100 requests per window
          message: "Too many requests, slow down"
        });

        app.use("/api/", apiLimiter);
        ```

        ---

        # **6️⃣ Prevent DDoS / Flooding**

        Can apply **globally** to protect all endpoints:

            ```ts
        const globalLimiter = rateLimit({
          windowMs: 60 * 1000, // 1 minute
          max: 1000, // 1000 requests per IP per minute
          message: "Too many requests from this IP, try again later"
        });

        app.use(globalLimiter);
        ```

        ---

        # **7️⃣ Per-UserModel Rate Limiting for Logged-In Users**

        Use `keyGenerator` to limit **per account** instead of IP.

            ```ts
        const userLimiter = rateLimit({
          windowMs: 24 * 60 * 60 * 1000, // 1 day
          max: 1000, // 1000 requests per user per day
          keyGenerator: (req) => req.user?.id || req.ip,
          message: "Daily request limit reached"
        });

        app.use("/api/user/", authenticateMiddleware, userLimiter);
        ```

        ---

        # ✅ Summary Table

        | Use Case                     | Key Type | Limit Example   |
        | ---------------------------- | -------- | --------------- |
        | Login attempts               | Email/IP | 5 per 15min     |
        | Signup / Registration        | IP       | 10 per hour     |
        | Contact Form                 | IP       | 3 per hour      |
        | OTPModel / Email / Password Reset | UserModel/IP  | 5 per 15min     |
        | Public API                   | IP/UserModel  | 100 per 15min   |
        | Global DDoS protection       | IP       | 1000 per minute |
        | Logged-in user endpoints     | UserModel ID  | 1000 per day    |

        ---

        # ⚡ Key Points

        1. **Each key (IP or user) has its own window & counter.**
        2. For **multi-server apps**, store counters in **Redis** instead of memory.
        3. Can combine **IP + user-based limits** for more protection.
        4. Works best with **Helmet + CORS + mongoSanitize** to form a security stack.

        ---

            If you want, I can make a **diagram showing all these limiter use cases in a server**, so you can visualize it like a security map.

            Do you want me to do that?


*/
