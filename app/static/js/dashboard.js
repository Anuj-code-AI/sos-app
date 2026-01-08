const socket = io({
    query: { user_id: String(localStorage.getItem("user_id")) }
});

// Sender map & helper marker
let senderMap = null;
let helperMarker = null;

socket.on("new_alert", data => {
    showAlert(data);
});

socket.on("help_accepted_ack", data => {
    showHelpAcceptedMessage(data.message);
});

// 🔴 Sender receives helper live location
socket.on("helper_location", data => {
    console.log("✅ RECEIVED HELPER LOCATION:", data);
    showHelperOnSenderMap(data.lat, data.lng);
});

function showAlert(data) {
    const container = document.getElementById("alert-container");
    if (!container) return;

    const alertBox = document.createElement("div");
    const mapId = "map-" + Date.now();

    alertBox.className = "bg-yellow-100 border-l-4 border-red-500 p-5 rounded-xl shadow-xl space-y-3";

    alertBox.innerHTML = `
        <h3 class="text-xl font-bold">🚨 Emergency Alert</h3>
        <p class="text-gray-800">${data.message}</p>

        <div id="${mapId}" class="w-full h-[220px] rounded-xl overflow-hidden"></div>

        <a class="inline-block font-semibold text-blue-600 underline"
           href="https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}"
           target="_blank">🧭 Open in Google Maps</a>

        <div class="flex gap-3 pt-2">
            <button class="accept-btn flex-1 bg-green-500 text-white font-bold py-2 rounded-lg">
                ✔ I am near
            </button>
            <button class="ignore-btn flex-1 bg-red-500 text-white font-bold py-2 rounded-lg">
                ✖ Ignore
            </button>
        </div>
    `;

    alertBox.querySelector(".ignore-btn").onclick = () => alertBox.remove();

    alertBox.querySelector(".accept-btn").onclick = () => {
        console.log("👉 HELP ACCEPTED FOR SENDER:", data.sender_id);

        socket.emit("help_accepted", {
            sender_id: String(data.sender_id)
        });

        // Start sending helper live location
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(pos => {
                socket.emit("helper_location_update", {
                    sender_id: String(data.sender_id),
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            });
        }
    };

    container.prepend(alertBox);

    // Show sender location on helper side
    setTimeout(() => {
        const map = L.map(mapId).setView([data.lat, data.lng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        L.marker([data.lat, data.lng]).addTo(map).bindPopup("Help needed here").openPopup();
    }, 0);
}

// 🔴 Sender sends SOS
function sendHarassment() {
    getLocation((lat, lng) => {

        // Show sender map
        const mapDiv = document.getElementById("sender-map");
        mapDiv.classList.remove("hidden");

        senderMap = L.map("sender-map").setView([lat, lng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(senderMap);

        L.marker([lat, lng]).addTo(senderMap).bindPopup("You are here").openPopup();

        fetch("/alert/harassment", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lng })
        });
    });
}

function showHelpAcceptedMessage(message) {
    const container = document.getElementById("alert-container");
    if (!container) return;

    const msgBox = document.createElement("div");
    msgBox.className = "bg-green-100 border-l-4 border-green-500 p-5 rounded-xl shadow-xl";

    msgBox.innerHTML = `
        <h3 class="text-lg font-bold text-green-700">✅ Help is on the way</h3>
        <p>${message}</p>
    `;

    container.prepend(msgBox);

    setTimeout(() => msgBox.remove(), 8000);
}

// 🟢 Show helper moving on sender map
function showHelperOnSenderMap(lat, lng) {
    if (!senderMap) {
        console.log("❌ senderMap not initialized");
        return;
    }

    if (!helperMarker) {
        helperMarker = L.marker([lat, lng]).addTo(senderMap)
            .bindPopup("Helper is coming 🚶");
    } else {
        helperMarker.setLatLng([lat, lng]);
    }
}
