import express from "express";
import cors from "cors";


const app = express();



// Global middleware to allow CORS Without Cors() Library
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // allowed origin
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"); // allowed methods
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization"); // allowed headers
    res.setHeader("Access-Control-Allow-Credentials", "true"); // allow cookies if needed

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});



const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    // origin: true, // To Allow All sites
    credentials: true, // Used for cookies or authentication headers
    methods: ["GET", "POST"], //used to allow Methods We Want
    optionsSuccessStatus: 200,
};

// Best Config

const allowedOrigins = ["http://localhost:5173", "https://myfrontend.com"];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // allow cookies / JWTs
        optionsSuccessStatus: 204, // for preflight requests
    })
);


/*
        ✅ Why this is good:

        Only allows trusted frontends

        Supports cookies / auth headers

        Handles preflight requests safely
 */


/*

        # **1️⃣ Allow Frontend on a Different Domain / Port to Access Backend**

        Most common use case: frontend and backend are on different origins.

        ```ts
        import express from "express";
        import cors from "cors";

        const app = express();

        app.use(cors({
          origin: "http://localhost:5173" // allow your frontend
        }));

        app.get("/api/data", (req, res) => {
          res.json({ message: "Hello from backend!" });
        });

        app.listen(3000);
        ```

        ✅ The frontend at `http://localhost:5173` can fetch `/api/data`.

        ---

        # **2️⃣ Allow Multiple Origins**

        You can allow **specific domains only**, not everyone.

        ```ts
        const allowedOrigins = ["http://localhost:5173", "https://myapp.com"];

        app.use(cors({
          origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error("Not allowed by CORS"));
            }
          }
        }));
        ```

        * Useful for production apps where only your frontend domains should access the backend.

        ---

        # **3️⃣ Allow Cookies / Credentials Across Origins**

        If your frontend uses cookies or authentication headers, you must enable `credentials`.

        ```ts
        app.use(cors({
          origin: "http://localhost:5173",
          credentials: true
        }));
        ```

        * Frontend fetch example:

        ```js
        fetch("http://localhost:3000/api/data", {
          credentials: "include"
        });
        ```

        * Without `credentials: true`, the browser **won’t send or receive cookies**.

        ---

        # **4️⃣ Restrict Allowed Methods**

        CORS can also control **which HTTP methods** are allowed:

        ```ts
        app.use(cors({
          origin: "http://localhost:5173",
          methods: ["GET", "POST"]
        }));
        ```

        * Prevents browser from sending PUT, DELETE, or PATCH requests unless allowed.

        ---

        # **5️⃣ Restrict Allowed Headers**

        You can limit which **custom headers** frontend can send:

        ```ts
        app.use(cors({
          origin: "http://localhost:5173",
          allowedHeaders: ["Content-Type", "Authorization"]
        }));
        ```

        * Prevents browsers from sending unsafe headers.

        ---

        # **6️⃣ Preflight Requests (OPTIONS)**

        Browsers send a **preflight request** for non-simple requests (like POST with JSON).

        ```ts
        app.options("/api/data", cors()); // handle preflight
        ```

        * Most CORS middleware handles this automatically.

        ---

        # **7️⃣ Apply CORS Per Route**

        Not every route needs cross-origin access. You can enable CORS **only for certain routes**:

        ```ts
        app.get("/public-data", cors(), (req, res) => {
          res.json({ message: "Accessible to all origins" });
        });

        app.get("/private-data", (req, res) => {
          res.json({ message: "No CORS here" });
        });
        ```

        ---

        # **8️⃣ Dynamic Origins**

        You can allow origins **dynamically** based on request:

        ```ts
        app.use(cors({
          origin: (origin, callback) => {
            if (!origin || origin.endsWith(".trusted.com")) {
              callback(null, true);
            } else {
              callback(new Error("Not allowed by CORS"));
            }
          }
        }));
        ```

        * Useful if you have many subdomains.

        ---

        # **Summary Table**

        | Use Case                         | Example                                            |
        | -------------------------------- | -------------------------------------------------- |
        | Allow frontend on different port | `origin: "http://localhost:5173"`                  |
        | Allow multiple origins           | `origin: ["http://site1.com","http://site2.com"]`  |
        | Allow cookies/credentials        | `credentials: true`                                |
        | Restrict methods                 | `methods: ["GET","POST"]`                          |
        | Restrict headers                 | `allowedHeaders: ["Content-Type","Authorization"]` |
        | Handle preflight                 | `app.options("/route", cors())`                    |
        | Enable CORS per route            | `app.get("/public", cors(), ...)`                  |
        | Dynamic origin                   | function in `origin` property                      |

        ---

        💡 **Key Concept:**

        * CORS is a **browser security mechanism**, not a server restriction.
        * The server just **sets headers** to tell the browser: “This origin is allowed to access me.”
        * Postman or curl **ignore CORS**, only browsers enforce it.

        ---

        If you want, I can make a **visual diagram showing how CORS works from browser → server** with preflight, credentials, and headers.

        Do you want me to do that?

 */