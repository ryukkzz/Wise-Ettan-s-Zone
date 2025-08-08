const API_KEY = "AIzaSyAFhD_2lGfHv7NR76CtG85cKlwHF2-iCac"; // Replace with your actual key

async function askGemini() {
  const input = document.getElementById("userInput").value;
  const responseBox = document.getElementById("response");

  if (!input) {
    responseBox.innerText = "Please type something!";
    return;
  }

  responseBox.innerText = "Thinking...";

  const body = {
    contents: [
      {
        parts: [
          {
            text: `You are a motivational and friendly chatbot named Wise Ettan. Respond to this: ${input}`
          }
        ]
      }
    ]
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  responseBox.innerText = reply || "Oops! Something went wrong.";
}
