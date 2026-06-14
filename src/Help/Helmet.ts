
import helmet from "helmet";
import express from "express";
const app = express()

// Best Config

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"], // allow scripts from own domain
                scriptSrc: ["'self'", "https://trusted-scripts.com"], // trusted external scripts
                styleSrc: ["'self'", "https://trusted-styles.com"], // trusted styles
                imgSrc: ["'self'", "data:"], // allow inline images
                connectSrc: ["'self'"], // API calls
            },
        },
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: { policy: "same-origin" },
        crossOriginResourcePolicy: { policy: "same-origin" },
        referrerPolicy: { policy: "no-referrer" },
        frameguard: { action: "deny" },
        noSniff: true,
        hidePoweredBy: true,
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    })
);


/*
        ✅ Why this is good:

        Blocks clickjacking, XSS, and resource abuse

        Hides tech info from attackers

        Forces HTTPS and secure resource policies
 */



/*

        # **1️⃣ Set Security Headers Automatically**

        Helmet sets multiple HTTP headers that protect your app from common attacks.

        ```ts
        import express from "express";
        import helmet from "helmet";

        const app = express();

        // Enable all default Helmet protections
        app.use(helmet());
        ```

        ---

        # **2️⃣ Prevent Clickjacking (`X-Frame-Options`)**

        Blocks your site from being embedded in an iframe (prevents clickjacking).

        ```ts
        app.use(helmet.frameguard({ action: "deny" }));
        ```

        * Browser will refuse to render your page inside a frame.

        ---

        # **3️⃣ Prevent MIME-Type Sniffing (`X-Content-Type-Options`)**

        Stops browsers from guessing the response type.

        ```ts
        app.use(helmet.noSniff());
        ```

        * Example: prevents executing scripts in images or CSS files.

        ---

        # **4️⃣ Hide Technology Info (`X-Powered-By`)**

        By default, Express sends `X-Powered-By: Express` — Helmet removes it.

        ```ts
        app.use(helmet.hidePoweredBy());
        ```

        * Makes it harder for attackers to know which server you’re using.

        ---

        # **5️⃣ Enforce HTTPS (`Strict-Transport-Security`)**

        Force browsers to use HTTPS.

        ```ts
        app.use(helmet.hsts({
          maxAge: 31536000, // 1 year
          includeSubDomains: true
        }));
        ```

        * Any HTTP request will be automatically redirected to HTTPS.

        ---

        # **6️⃣ Referrer Policy (`Referrer-Policy`)**

        Control what information the browser sends in the `Referer` header.

        ```ts
        app.use(helmet.referrerPolicy({ policy: "no-referrer" }));
        ```

        * Helps prevent leaking sensitive URLs or tokens.

        ---

        # **7️⃣ Prevent Cross-Site Scripting (XSS) (`X-XSS-Protection`)**

        Older browsers used `X-XSS-Protection`. Modern apps should use **Content-Security-Policy**, but Helmet can set both.

        ```ts
        app.use(helmet.xssFilter()); // legacy
        ```

        * Example: prevents reflected XSS attacks in older browsers.

        ---

        # **8️⃣ Content Security Policy (CSP)**

        Restrict what scripts, styles, or resources can load.

        ```ts
        app.use(
          helmet.contentSecurityPolicy({
            directives: {
              defaultSrc: ["'self'"], // allow only same origin
              scriptSrc: ["'self'", "https://trusted-scripts.com"],
              styleSrc: ["'self'", "https://trusted-styles.com"]
            }
          })
        );
        ```

        * Blocks untrusted scripts, reducing XSS risks.

        ---

        # **9️⃣ Cross-Domain Policies (`Cross-Origin-Opener-Policy` & `Cross-Origin-Resource-Policy`)**

        Control resource sharing and isolation:

        ```ts
        app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin" }));
        app.use(helmet.crossOriginResourcePolicy({ policy: "same-origin" }));
        ```

        * Prevents some cross-origin attacks, like Spectre/Meltdown leaks.

        ---

        # **10️⃣ Other Protections**

        * `Expect-CT` → enforce Certificate Transparency
        * `Permitted-Cross-Domain-Policies` → for Flash or PDF clients
        * `DNS Prefetch Control` → control browser prefetching

        ---

        # **Summary Table**

        | Helmet Feature              | Protection                         |
        | --------------------------- | ---------------------------------- |
        | hidePoweredBy()             | Hides server tech info             |
        | frameguard()                | Prevent clickjacking               |
        | noSniff()                   | Prevent MIME sniffing              |
        | hsts()                      | Force HTTPS                        |
        | referrerPolicy()            | Control Referer header             |
        | xssFilter()                 | Basic XSS protection               |
        | contentSecurityPolicy()     | Advanced XSS & resource protection |
        | crossOriginOpenerPolicy()   | Prevent cross-origin attacks       |
        | crossOriginResourcePolicy() | Protect shared resources           |
        | dnsPrefetchControl()        | Control DNS prefetching            |

        ---

        💡 **Key Point:**

        Helmet **doesn’t stop all attacks**, but it **reduces your server’s attack surface** by setting **safe HTTP headers**, hiding sensitive info, and enforcing browser security policies.

        ---

        If you want, I can make a **diagram showing Helmet protecting the server**, like which headers block which attacks, so it’s super visual.

        Do you want me to do that?

 */