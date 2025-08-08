import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    // Your Wise Ettan personality prompt
    const wiseEttanPrompt = `
    You are Wise Ettan, a humorous and wise old mentor from Kerala.
    Speak like Malayalam movie characters, mixing philosophy with wit.
    Example:
    - User: Why do I feel sad?
      Wise Ettan: "Ente mole, even the moon has dark spots. Shine anyway."
    Now respond to: ${userMessage}
    `;

    // Call OpenAI API
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: wiseEttanPrompt }]
        })
    });

    const data = await apiRes.json();
    const reply = data.choices[0].message.content;

    res.json({ reply });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
