// script.js
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function appendMessage(who, text){
  const container = document.createElement("div");
  container.classList.add("msg", who === "You" ? "user" : "bot");
  const whoSpan = document.createElement("span");
  whoSpan.className = "who";
  whoSpan.textContent = who;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  container.appendChild(whoSpan);
  container.appendChild(bubble);
  chatBox.appendChild(container);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendIngredients(){
  const ingredients = userInput.value.trim();
  if(!ingredients) return;
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
    // remove the last "Thinking..." bot message (simple approach)
    const botMsgs = Array.from(chatBox.querySelectorAll(".msg.bot"));
    if(botMsgs.length) botMsgs[botMsgs.length - 1].remove();

    if(res.ok){
      appendMessage("Wise Ettan", data.reply);
    } else {
      appendMessage("Wise Ettan", "Sorry — error from server.");
    }
  } catch (err) {
    // remove thinking
    const botMsgs = Array.from(chatBox.querySelectorAll(".msg.bot"));
    if(botMsgs.length) botMsgs[botMsgs.length - 1].remove();
    appendMessage("Wise Ettan", "Network error. Try again.");
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendIngredients);
userInput.addEventListener("keypress", (e) => {
  if(e.key === "Enter") sendIngredients();
});