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

    const mapId = "map-" + Date.now();

    alertBox.innerHTML = `
        <h3>🚨 Emergency Alert</h3>
        <p>${data.message}</p>

        <div class="map" id="${mapId}"></div>

        <div class="actions">
            <button class="yes">✔ I am near</button>
            <button class="no">✖ Ignore</button>
        </div>
    `;

    alertBox.querySelector(".no").onclick = () => alertBox.remove();

    container.prepend(alertBox);

    // 🗺️ Initialize Leaflet map AFTER DOM insertion
    setTimeout(() => {
        const map = L.map(mapId).setView([data.lat, data.lng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        L.marker([data.lat, data.lng])
            .addTo(map)
            .bindPopup("Help needed here")
            .openPopup();
    }, 0);
}


function sendHarassment() {
    getLocation((lat, lng) => {
        fetch("/alert/harassment", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ lat, lng })
        });

    });
}
