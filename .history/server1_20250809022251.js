// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // serves index.html, style.css, script.js

// Read keys from .env (comma-separated) or single key
const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
if (!rawKeys) {
  console.warn("No Gemini API keys found in environment. Set GEMINI_API_KEYS in .env");
}
const keys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);
let keyIndex = 0;

// Select key (round-robin)
function getNextKey(){
  if(keys.length === 0) return null;
  const k = keys[keyIndex % keys.length];
  keyIndex++;
  return k;
}

const MODEL = process.env.GEMINI_MODEL || "gemini-pro"; // change if needed

app.post("/chat", async (req, res) => {
  try {
    const ingredients = req.body.ingredients || "";
    if (!ingredients) return res.status(400).json({ reply: "No ingredients provided." });

    const prompt = You are Wise Ettan, a warm and creative cooking coach. Suggest one clear, short recipe that can be made with these ingredients: ${ingredients}. Include a short title, 1-4 ingredient steps and one quick tip. Keep the response under 200 words.;

    const apiKey = getNextKey();
    if(!apiKey) return res.status(500).json({ reply: "Server misconfigured: no API key." });

    // Call Gemini (generativelanguage endpoint)
    const endpoint = https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey};

    const body = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      // You can add other options here (safety, temperature, etc.) if supported.
    };

    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("Gemini error:", r.status, text);
      return res.status(502).json({ reply: "Error from Gemini API." });
    }

    const data = await r.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                  "Wise Ettan couldn't think of a recipe right now.";

    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Server error. Check console." });
  }
});

// Default route serves index.html (since express.static covers it if file exists)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running at http://localhost:${PORT}));