require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const keys = (process.env.GEMINI_API_KEYS || "").split(",").map(s => s.trim()).filter(Boolean);
let idx = 0;
const MODEL = process.env.GEMINI_MODEL || "gemini-pro";

function nextKey() { return keys.length ? keys[idx++ % keys.length] : null; }

app.post("/chat", async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) return res.status(400).json({ reply: "I need ingredients to cook!" });

  const prompt = You are Wise Ettan, a warm cooking sage. Suggest a recipe using: ${ingredients}. Keep it creative and concise.;

  const apiKey = nextKey();
  if (!apiKey) return res.status(500).json({ reply: "No API key configured." });

  const endpoint = https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey};
  const body = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Wise Ettan is speechless.";
    res.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Something went wrong server-side." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chatbot.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server listening: http://localhost:${PORT}));