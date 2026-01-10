// ======================================================
// ResQnet DEMO — Story Mode (Ultra Cinematic Command Center)
// ======================================================

// ----------------- Helpers -----------------

let INPUT_LOCKED = false;

function lockInput(ms) {
    INPUT_LOCKED = true;
    setTimeout(() => INPUT_LOCKED = false, ms);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForUserClick(el = document.body) {
    return new Promise(resolve => {
        function handler() {
            if (INPUT_LOCKED) return;
            el.removeEventListener("click", handler);
            resolve();
        }
        setTimeout(() => el.addEventListener("click", handler), 100);
    });
}

function clearScene() {
    document.querySelectorAll(".demo-actor, .demo-bubble, .demo-overlay, .demo-panic, .demo-mapbox").forEach(e => e.remove());
}

// ----------------- Actor -----------------

function createActor(imgSrc, positionClass, sizeVW = 25) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = `demo-actor fixed z-[9000] transition-all duration-700 ease-out drop-shadow-2xl ${positionClass}`;
    img.style.width = sizeVW + "vw";
    img.style.maxWidth = "420px";
    img.style.height = "auto";
    document.body.appendChild(img);
    return img;
}

// ----------------- Message Bubble -----------------

async function sayTyped(actor, text) {
    const bubble = document.createElement("div");
    bubble.className = `
        demo-bubble fixed bottom-[35%] left-1/2 -translate-x-1/2
        bg-white p-4 rounded-xl shadow-xl
        text-base sm:text-lg max-w-[85vw] sm:max-w-md
        whitespace-pre-wrap z-[99999]
    `;
    bubble.textContent = "";
    document.body.appendChild(bubble);

    for (let i = 0; i < text.length; i++) {
        bubble.textContent += text[i];
        await sleep(25);
    }

    await waitForUserClick();
    bubble.remove();
}

// ----------------- Overlay -----------------

function showOverlay(text) {
    return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.className = "demo-overlay fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4";
        overlay.innerHTML = `
            <div class="bg-white p-6 rounded-xl max-w-md w-full text-center space-y-4 shadow-2xl">
                <p class="text-lg font-semibold">${text}</p>
                <div class="text-sm text-gray-500">Tap anywhere to continue</div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.onclick = () => {
            overlay.remove();
            resolve();
        };
    });
}

// ----------------- Panic Card -----------------

async function showPanicCard(text) {
    const card = document.createElement("div");
    card.className = "demo-panic fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-6 rounded-xl shadow-2xl text-lg sm:text-2xl font-bold z-[9999] text-center max-w-[90vw]";
    card.innerText = text;
    document.body.appendChild(card);

    card.animate(
        [
            { transform: "translate(-50%, -50%) translateX(-6px)" },
            { transform: "translate(-50%, -50%) translateX(6px)" }
        ],
        { duration: 60, iterations: 30 }
    );

    await waitForUserClick();
    card.remove();
}

// ----------------- MAP (ULTRA MODE) -----------------

function showDemoMap() {
    const container = document.getElementById("alert-container");
    if (!container) return null;

    const box = document.createElement("div");
    box.className = "demo-mapbox bg-white p-4 rounded-xl shadow-xl";

    const mapId = "demo-map-" + Date.now();
    box.innerHTML = `<div id="${mapId}" class="w-full h-[260px] sm:h-[320px] rounded-xl"></div>`;
    container.prepend(box);

    setTimeout(() => {
        const map = L.map(mapId, {
            zoomControl: false,
            attributionControl: false
        }).setView([28.61, 77.20], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        // Marker icons (small)
        const aditiIcon = L.icon({ iconUrl: "/static/images/aditi.png", iconSize: [18, 18], iconAnchor: [9, 9] });
        const help1Icon = L.icon({ iconUrl: "/static/images/help1.png", iconSize: [20, 20], iconAnchor: [10, 10] });
        const help2Icon = L.icon({ iconUrl: "/static/images/help2.png", iconSize: [20, 20], iconAnchor: [10, 10] });

        const target = [28.61, 77.20];
        L.marker(target, { icon: aditiIcon }).addTo(map);

        // ----------------- HEATMAP DANGER ZONE -----------------
        const heatLayers = [];
        for (let i = 0; i < 6; i++) {
            const c = L.circle(target, {
                radius: 80 + i * 70,
                color: "red",
                fillColor: "red",
                fillOpacity: 0.08 - i * 0.01,
                weight: 0
            }).addTo(map);
            heatLayers.push(c);
        }

        // ----------------- LIVE SOS EXPANDING RADIUS -----------------
        const sosCircle = L.circle(target, {
            radius: 60,
            color: "red",
            fillColor: "red",
            fillOpacity: 0.2
        }).addTo(map);

        let sosGrow = true;
        const sosInterval = setInterval(() => {
            let r = sosCircle.getRadius();
            if (sosGrow) {
                r += 15;
                if (r > 250) sosGrow = false;
            } else {
                r -= 15;
                if (r < 60) sosGrow = true;
            }
            sosCircle.setRadius(r);
        }, 120);

        // ----------------- TRAFFIC-AWARE CURVED ROUTES -----------------

        // Helpers start positions
        let h1 = [28.605, 77.185];
        let h2 = [28.615, 77.215];

        const helper1 = L.marker(h1, { icon: help1Icon }).addTo(map);
        const helper2 = L.marker(h2, { icon: help2Icon }).addTo(map);

        // Control points to simulate road curvature / traffic routing
        const curve1 = [28.607, 77.195];
        const curve2 = [28.613, 77.205];

        function bezier(p0, p1, p2, t) {
            const lat = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0];
            const lng = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1];
            return [lat, lng];
        }

        let t = 0;

        const route1 = L.polyline([h1, curve1, target], { color: "blue" }).addTo(map);
        const route2 = L.polyline([h2, curve2, target], { color: "green" }).addTo(map);

        const interval = setInterval(() => {
            t += 0.015;
            if (t > 1) t = 1;

            const p1 = bezier(h1, curve1, target, t);
            const p2 = bezier(h2, curve2, target, t);

            helper1.setLatLng(p1);
            helper2.setLatLng(p2);

            route1.setLatLngs([h1, curve1, p1]);
            route2.setLatLngs([h2, curve2, p2]);

            if (t >= 1) {
                clearInterval(interval);

                // 🎥 Camera zoom-in
                map.flyTo(target, 17, { duration: 1.5 });

                setTimeout(() => {
                    clearInterval(sosInterval);
                }, 2000);
            }
        }, 60);

    }, 200);

    return box;
}

// ----------------- Highlight Button -----------------

function highlightHarassmentButton() {
    const btn = document.querySelector("button[onclick='openConfirmHarassment()']");
    if (!btn) return null;
    btn.classList.add("ring-4", "ring-yellow-400", "animate-pulse");
    return btn;
}

function unhighlightHarassmentButton() {
    const btn = document.querySelector("button[onclick='openConfirmHarassment()']");
    if (!btn) return;
    btn.classList.remove("ring-4", "ring-yellow-400", "animate-pulse");
}

// ----------------- STORY -----------------

async function startDemo() {
    await showOverlay("Welcome to ResQnet. This is a live simulation of how emergencies are handled.");

    const goblin = createActor("/static/images/goblin.png", "bottom-[-40vh] right-4", 30);
    await sleep(100);
    goblin.style.bottom = "1rem";
    await sayTyped(goblin, "Hi! I will show you how ResQnet helps people in emergencies.");
    goblin.remove();

    const aditi = createActor("/static/images/aditi.png", "bottom-[-40vh] left-4", 22);
    await sleep(100);
    aditi.style.bottom = "1rem";

    await sayTyped(aditi, "Someone is following me... I am scared.");
    await sayTyped(aditi, "Please press the Harassment button.");

    const btn = highlightHarassmentButton();
    await waitForUserClick(btn || document.body);
    unhighlightHarassmentButton();

    const help1 = createActor("/static/images/help1.png", "bottom-[-40vh] right-4", 22);
    const police = createActor("/static/images/police.png", "top-[-50vh] right-[-40vw]", 18);

    await sleep(100);
    help1.style.bottom = "1rem";
    await sayTyped(help1, "I am near. I am coming to help!");

    police.style.top = "1rem";
    police.style.right = "1rem";
    await sayTyped(police, "Police is on the way!");

    const mapBox = showDemoMap();
    lockInput(6000);
    await sleep(6200);
    if (mapBox) mapBox.remove();

    help1.remove();
    police.remove();

    await sayTyped(aditi, "Thank God... I am safe now. Thanks to ResQnet!");
    aditi.remove();

    const police1 = createActor("/static/images/police1.png", "top-[-45vh] right-10", 20);
    await sleep(100);
    police1.style.top = "1rem";

    await showPanicCard("🚨 GAS LEAK NEAR FACTORY! Use mask and move to EAST HIGHWAY immediately!");
    police1.remove();

    clearScene();

    await showOverlay("🎉 This concludes the demo. In real life, all of this happens with real people in real time.");
}

// ----------------- START -----------------

window.onload = () => {
    startDemo();
};
