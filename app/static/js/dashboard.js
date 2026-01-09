// ================= SOCKET SETUP =================

const socket = io("https://sos-app-3.onrender.com", {
    withCredentials: true
});

// Sender map & helper marker
let senderMap = null;
let helperMarker = null;
let geoWatchId = null;

// Get current user id from session
async function getMyUserId() {
    const res = await fetch("/api/me", { credentials: "include" });
    const data = await res.json();
    return String(data.user_id);
}

// Register user after socket connect
socket.on("connect", async () => {
    const userId = await getMyUserId();

    console.log("🟢 SOCKET CONNECTED, REGISTERING USER:", userId);

    if (!userId || userId === "null") {
        console.error("❌ USER NOT LOGGED IN, SOCKET NOT REGISTERED");
        return;
    }

    socket.emit("register_user", {
        user_id: userId
    });
});

// ================= SOCKET LISTENERS =================

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

// ================= UI FUNCTIONS =================

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
            if (geoWatchId !== null) {
                navigator.geolocation.clearWatch(geoWatchId);
            }

            geoWatchId = navigator.geolocation.watchPosition(pos => {
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
function sendHarassment(customMessage = "") {
    getLocation((lat, lng) => {
        fetch("/alert/harassment", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                lat,
                lng,
                message: customMessage
            })
        });
    });
}

function showHelpAcceptedMessage(message) {
    const container = document.getElementById("alert-container");
    if (!container) return;

    const msgBox = document.createElement("div");
    const mapId = "sender-map-" + Date.now();

    msgBox.className = "relative bg-green-100 border-l-4 border-green-500 p-5 rounded-xl shadow-xl space-y-3";

    msgBox.innerHTML = `
        <button class="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold">
            ✖
        </button>

        <h3 class="text-lg font-bold text-green-700">✅ Help is on the way</h3>
        <p>${message}</p>
        <div id="${mapId}" class="w-full h-[250px] rounded-xl overflow-hidden"></div>
    `;

    msgBox.querySelector("button").onclick = () => {
        msgBox.remove();
    };

    container.prepend(msgBox);

    setTimeout(() => {
        senderMap = L.map(mapId).setView([0, 0], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(senderMap);
    }, 0);
}

function showHelperOnSenderMap(lat, lng) {
    if (!senderMap) return;

    if (!helperMarker) {
        helperMarker = L.marker([lat, lng]).addTo(senderMap)
            .bindPopup("Helper is coming 🚶");
    } else {
        helperMarker.setLatLng([lat, lng]);
    }

    senderMap.setView([lat, lng], 15);
}

// ================= CONFIRM UI =================

function openConfirmHarassment() {
    const container = document.getElementById("alert-container");
    if (!container) return;

    const box = document.createElement("div");

    box.className = "bg-white border-l-4 border-red-500 p-5 rounded-xl shadow-xl space-y-3";

    box.innerHTML = `
        <h3 class="text-lg font-bold text-red-600">⚠️ Confirm Emergency Alert</h3>
        <p class="text-gray-700">
            Are you sure you want to send this emergency alert to nearby users?
        </p>

        <textarea id="custom-alert-message"
                  class="w-full border rounded-lg p-2"
                  rows="3"
                  placeholder="Optional: Add more details..."></textarea>

        <div class="flex gap-3 pt-2">
            <button id="confirmSendBtn"
                    class="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg">
                ✅ Yes, Send Alert
            </button>
            <button id="cancelSendBtn"
                    class="flex-1 bg-gray-300 font-bold py-2 rounded-lg">
                ❌ Cancel
            </button>
        </div>
    `;

    container.prepend(box);

    box.querySelector("#cancelSendBtn").onclick = () => box.remove();

    box.querySelector("#confirmSendBtn").onclick = () => {
        const msg = box.querySelector("#custom-alert-message").value;
        box.remove();
        sendHarassment(msg);
    };
}
