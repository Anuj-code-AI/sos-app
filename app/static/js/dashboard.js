const socket = io({
    query: { user_id: localStorage.getItem("user_id") }
});

socket.on("new_alert", data => {
    showAlert(data);
});

function showAlert(data) {
    const container = document.getElementById("alert-container");
    if (!container) return;

    const alertBox = document.createElement("div");
    alertBox.className = "alert-card";

    alertBox.innerHTML = `
        <h3>🚨 Emergency Alert</h3>
        <p>${data.message}</p>
        <p><strong>Location:</strong> ${data.lat}, ${data.lng}</p>

        <div class="actions">
            <button class="yes">✔ I am near</button>
            <button class="no">✖ Ignore</button>
        </div>
    `;

    alertBox.querySelector(".no").onclick = () => alertBox.remove();

    container.prepend(alertBox);
}

function sendHarassment() {
    getLocation((lat, lng) => {
        fetch("/alert/harassment", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ lat, lng })
        });
    });
}
