const form = document.getElementById("input-form");
const messages = document.getElementById("messages");
const ingredientsInput = document.getElementById("ingredients");

function appendMessage(text, who = "bot") {
  const div = document.createElement("div");
  div.className = who === "user" ? "msg user" : "msg bot";
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const ingredients = ingredientsInput.value.trim();
  if (!ingredients) return;
  appendMessage("You: " + ingredients, "user");
  ingredientsInput.value = "";
  appendMessage("Thinking…", "bot");

  try {
    const res = await fetch("/api/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients })
    });

    const json = await res.json();
    // Remove the "Thinking..." placeholder (last bot message) and show real reply
    // simple remove last bot message if it equals "Thinking…"
    const lastMsgs = Array.from(messages.querySelectorAll(".msg.bot"));
    if (lastMsgs.length) {
      const last = lastMsgs[lastMsgs.length - 1];
      if (last.textContent === "Thinking…") last.remove();
    }

    if (res.ok) {
      appendMessage(json.reply || "Sorry, no suggestion.", "bot");
    } else {
      appendMessage("Error: " + (json.error || "Server error"), "bot");
    }
  } catch (err) {
    console.error(err);
    appendMessage("Network error. Try again.", "bot");
  }
});