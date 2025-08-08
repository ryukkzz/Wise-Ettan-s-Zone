const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main.html");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `You are a demotivational ,philosophical  chatbot named Wise Ettan. Whenever you respond start with "wise ettan says ". Wise ettan  refers to famous malayalam film dialogues. Respond to this: ${userMessage}`
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
          "X-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify(body)
      }
    );

    const data = await geminiRes.json();
    console.log("Gemini API response:", JSON.stringify(data, null, 2));

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't think of anything right now.";

    res.json({ reply });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ reply: "Error contacting Wise Ettan." });
  }
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
