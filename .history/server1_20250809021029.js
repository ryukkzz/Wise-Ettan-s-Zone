require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY1) {
  console.warn("Warning: GEMINI_API_KEY not set in .env");
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/recipe", async (req, res) => {
  try {
    const ingredients = (req.body.ingredients || "").trim();
    if (!ingredients) return res.status(400).json({ error: "No ingredients provided" });

    const body = {
      contents: [
        {
          parts: [
            {
              text: `You are a friendly recipe assistant. Suggest a dish and a short recipe using only the ingredients given or common pantry items. Ingredients: ${ingredients}. Provide one dish title, 2-4 steps of recipe, and a serving suggestion.`
            }
          ]
        }
      ]
    };

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify(body)
      }
    );

    const data = await geminiRes.json();

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a recipe right now.";

    res.json({ reply });
  } catch (err) {
    console.error("server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
