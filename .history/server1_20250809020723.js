require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch"); // For Node 18+, you can omit this and use global fetch
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY1= process.env.GEMINI_API_KEY1; // put your key in .env

if (!GROK_API_KEY) {
  console.warn("Warning: GROK_API_KEY not set in .env");
}

app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve index.html, css, js

// POST /api/recipe - forward to Grok
app.post("/api/recipe", async (req, res) => {
  try {
    const ingredients = (req.body.ingredients || "").trim();
    if (!ingredients) return res.status(400).json({ error: "No ingredients provided" });

    // Build a chat-style request for Grok
    const payload = {
      model: "grok-4", // check your account for available model name
      messages: [
        { role: "system", content: "You are a friendly recipe assistant. Suggest a dish and a short recipe using only the ingredients given or common pantry items." },
        { role: "user", content: `Ingredients: ${ingredients}. Suggest one dish title, short recipe steps (2-4 lines), and a short serving suggestion.` }
      ],
      max_tokens: 500
    };

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROK_API_KEY}` // keep secret
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Try to get message text (OpenAI-compatible response format)
    const reply = data?.choices?.[0]?.message?.content || data?.output || JSON.stringify(data);

    res.json({ reply });
  } catch (err) {
    console.error("server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
