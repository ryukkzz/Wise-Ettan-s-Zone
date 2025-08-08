import express from "express";
import bodyParser from "body-parser";
import { OpenAI } from "openai";  // or use node-fetch method

const app = express();
app.use(bodyParser.json());
app.use(express.static('.')); // Serves static files from project root

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  const userMsg = req.body.message;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are Wise Ettan, a wise mentor..." },
      { role: "user", content: userMsg }
    ]
  });
  res.json({ reply: response.choices[0].message.content });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
