const socket = io({
    query: { user_id: localStorage.getItem("user_id") }
});

socket.on("new_alert", data => {
    showAlert(data);
});
socket.on("help_accepted_ack", data => {
    showHelpAcceptedMessage(data.message);
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

        <a 
            class="maps-link"
            href="https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}"
            target="_blank"
            rel="noopener noreferrer"
        >
            🧭 Open in Google Maps
        </a>

        <div class="actions">
            <button class="yes">✔ I am near</button>
            <button class="no">✖ Ignore</button>
        </div>
    `;



    alertBox.querySelector(".no").onclick = () => alertBox.remove();
    alertBox.querySelector(".yes").onclick = () => {
        socket.emit("help_accepted", {
            sender_id: data.sender_id
        });
    };

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


function showHelpAcceptedMessage(message) {
    const container = document.getElementById("alert-container");
    if (!container) return;

    const msgBox = document.createElement("div");
    msgBox.className = "alert-card help-accepted";

    msgBox.innerHTML = `
        <h3>Don't Worry</h3>
        <p>${message}</p>
    `;

    container.prepend(msgBox);

    // optional auto-dismiss after 8 seconds
    setTimeout(() => {
        msgBox.remove();
    }, 8000);
}
