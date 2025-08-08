// server.js
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // Serve HTML, CSS, JS from /public

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const ingredients = req.body.ingredients;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = You are Wise Ettan. I will give you some ingredients, and you will suggest a dish name and recipe. Ingredients: ${ingredients};
    const result = await model.generateContent(prompt);
    
    // Correct way to get text
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(Server running at http://localhost:${port});
});