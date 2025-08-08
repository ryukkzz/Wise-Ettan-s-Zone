<script>
document.querySelector("#motivation-btn").addEventListener("click", function() {
    document.getElementById("chat-container").style.display = "block";
});

async function sendMessage() {
    const input = document.getElementById("user-input");
    const userMessage = input.value;
    if (!userMessage) return;

    // Display user message
    document.getElementById("messages").innerHTML += `<div><b>You:</b> ${userMessage}</div>`;
    input.value = "";

    // Send message to backend
    const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
    });
    const data = await res.json();

    // Display Wise Ettan's reply
    document.getElementById("messages").innerHTML += `<div><b>Wise Ettan:</b> ${data.reply}</div>`;
}
</script>
