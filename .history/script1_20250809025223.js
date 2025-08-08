async function askGemini() {
  const input = document.getElementById("userInput").value;
  const responseBox = document.getElementById("response");

  if (!input) {
    responseBox.innerText = "Please type something!";
    return;
  }

  responseBox.innerText = "Thinking...";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    responseBox.innerText = data.reply;
  } catch (err) {
    console.error(err);
    responseBox.innerText = "Error talking to Wise Ettan.";
  }
}
