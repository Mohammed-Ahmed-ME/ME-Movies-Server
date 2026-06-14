/*
        Great question — this one is **quiet but deadly important** 🧠
        `mongoSanitize` protects you from a **very specific class of attacks** that hit MongoDB apps hard.

        ---

        ## 🧨 What does `mongoSanitize` do?

        **`mongoSanitize` removes MongoDB operator keys from user input**
        so attackers **cannot inject MongoDB queries**.

        It mainly targets keys that start with:

        * `$` → MongoDB operators
        * `.` → path traversal inside documents

        ---

        ## 🧠 Why this matters (real danger)

        MongoDB queries are **objects**, not strings.

        That means this is possible if you’re not careful:

        ```ts
        UserModel.findOne({ email: req.body.email });
        ```

        Attacker sends:

        ```json
        {
          "email": { "$gt": "" }
        }
        ```

        MongoDB interprets it as:

        ```js
        { email: { $gt: "" } }
        ```

        💥 That matches **every document**
        ➡️ login bypass
        ➡️ auth destroyed

        ---

        ## 🔒 What `mongoSanitize` does to that input

        ### Before

        ```json
        {
          "email": { "$gt": "" }
        }
        ```

        ### After

        ```json
        {
          "email": ""
        }
        ```

        or sometimes:

        ```json
        {}
        ```

        ➡️ Operators removed
        ➡️ Query becomes safe

        ---

        ## 🛠️ What exactly does it sanitize?

        It **recursively walks through**:

        * `req.body`
        * `req.query`
        * `req.params`

        And removes:

        * Keys starting with `$`
        * Keys containing `.`

        Example:

        ```json
        {
          "$where": "this.password.length > 0",
          "profile.name": "evil"
        }
        ```

        Becomes:

        ```json
        {
          "profile": { "name": "evil" }
        }
        ```

        or removed entirely (depending on config).

        ---

        ## 🧪 Real-world attack it stops

        ### ❌ Without `mongoSanitize`

        ```ts
        UserModel.findOne(req.body);
        ```

        Payload:

        ```json
        {
          "$or": [
            { "email": "victim@mail.com" },
            {}
          ]
        }
        ```

        Result:
        ✔ AuthRoutes bypass

        ---

        ### ✅ With `mongoSanitize`

        Payload becomes:

        ```json
        {}
        ```

        Result:
        ❌ Query fails safely

        ---

        ## ⚠️ What `mongoSanitize` does NOT do

        Important so you don’t misunderstand it:

        ❌ It does NOT:

        * Validate input
        * Escape strings
        * Protect against XSS
        * Secure SQL databases
        * Fix bad query logic

        It only protects **MongoDB / Mongoose queries**.

        Works best with **MongoDB** and **Mongoose**

        ---

        ## ✅ Correct way to use it

        ### 📦 Install

        ```bash
        npm i express-mongo-sanitize
        ```

        ### 🔌 Global middleware

        ```ts
        import mongoSanitize from "express-mongo-sanitize";

        app.use(mongoSanitize());
        ```

        That’s it. One line. Huge protection.

        ---

        ## 🧠 Best practice (important)

        **`mongoSanitize` is NOT optional** if:

        * You accept JSON input
        * You use MongoDB
        * You pass request data into queries

        It should sit next to:

        * Helmet
        * Rate limiter
        * XSS protection

        ---

        ## 🏁 One-liner summary

        > **`mongoSanitize` removes MongoDB operators from user input so attackers can’t turn your data into queries.**

        Silent. Invisible. Critical.

        ---

        If you want next:

        * 🧪 Real NoSQL injection lab
        * 🔥 AuthRoutes bypass demo with & without sanitize
        * 🧠 How Mongoose casting helps (and where it fails)
        * 🧱 Zod/Joi schemas that kill injection

        Say the word 😄

*/