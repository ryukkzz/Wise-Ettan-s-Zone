// server.js (CommonJS version for Node.js v22+)
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // still works with require

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve static files

app.post("/api", async (req, res) => {
    try {
        const userMessage = req.body.message;
        const apiResponse = await fetch("https://api.example.com/endpoint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: userMessage })
        });

        const data = await apiResponse.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error calling API");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
