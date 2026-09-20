// Chatbase identity endpoint example
// Install: npm install express jsonwebtoken
// Keep CHATBOT_IDENTITY_SECRET in your server environment/secrets.

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api/chatbase-token", async (req, res) => {
    try {
        // Replace this with your real authentication/session lookup.
        const user = await getSignedInUser(req);

        if (!user) {
            return res.status(401).json({ error: "Not signed in" });
        }

        const secret = process.env.CHATBOT_IDENTITY_SECRET;

        if (!secret) {
            return res.status(500).json({ error: "CHATBOT_IDENTITY_SECRET is not configured" });
        }

        const token = jwt.sign(
            {
                user_id: user.id,
                email: user.email,
                stripe_accounts: user.stripe_accounts,
                // Add other non-sensitive custom attributes here if needed.
            },
            secret,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Chatbase token error:", error);
        res.status(500).json({ error: "Unable to create Chatbase token" });
    }
});

// Your existing server should already call app.listen(...).
// app.listen(3000, () => console.log("Server running on port 3000"));
