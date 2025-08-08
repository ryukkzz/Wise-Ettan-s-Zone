const API_KEY = "AIzaSyBtSGC7PnJXKAFCC6zejqD5gR77OcK21Y8"; // Replace with your Gemini API key
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("You: " + message, "user-msg");
    userInput.value = "";

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Give me a recipe for: " + message }] }]
                })
            }
        );

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find a recipe.";
        appendMessage("Bot: " + botReply, "bot-msg");

    } catch (error) {
        appendMessage("Bot: Error fetching recipe.", "bot-msg");
        console.error(error);
    }
}

function appendMessage(text, className) {
    const msg = document.createElement("div");
    msg.className = className;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}