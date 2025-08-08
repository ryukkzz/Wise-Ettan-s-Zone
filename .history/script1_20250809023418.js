const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("msg", sender === "You" ? "user" : "bot");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}


async function sendIngredients() {
  const ingredients = userInput.value.trim();
  if (!ingredients) return;

  appendMessage("You", ingredients);
  userInput.value = "";
  appendMessage("Wise Ettan", "Thinking...");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients })
    });
    const data = await res.json();
    document.querySelector(".msg.bot:last-of-type").remove(); // remove "Thinking..."
    appendMessage("Wise Ettan", data.reply);
  } catch (err) {
    document.querySelector(".msg.bot:last-of-type").remove();
    appendMessage("Wise Ettan", "Error. Try again.");
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendIngredients);
userInput.addEventListener("keypress", e => { if (e.key === "Enter") sendIngredients(); });