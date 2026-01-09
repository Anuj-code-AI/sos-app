// ======================================================
// ResQnet DEMO — Story Mode (Cinematic, Slow, Click Based)
// Uses REAL transparent PNGs (no card wrappers)
// ======================================================

// ----------------- Helpers -----------------

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearScene() {
    document.querySelectorAll(".demo-actor, .demo-bubble, .demo-overlay, .demo-panic, .demo-mapbox").forEach(e => e.remove());
}

// Create character (NO card, pure image)
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

// Typed message bubble
async function sayTyped(actor, text) {
    const bubble = document.createElement("div");
    bubble.className = "demo-bubble absolute -top-28 left-1/2 -translate-x-1/2 bg-white p-4 rounded-xl shadow-xl text-base sm:text-lg max-w-[85vw] sm:max-w-md whitespace-pre-wrap";
    bubble.textContent = "";

    actor.style.position = "fixed";
    actor.appendChild(bubble);

    for (let i = 0; i < text.length; i++) {
        bubble.textContent += text[i];
        await sleep(30);
    }

    // Wait for user click
    await waitForUserClick();

    bubble.remove();
}
async function sayTypedforPolice(actor, text) {
    const bubble = document.createElement("div");
    bubble.className = "demo-bubble absolute -top-28 left-1/2 -translate-x-1/2 bg-white p-4 rounded-xl shadow-xl text-base sm:text-lg max-w-[85vw] sm:max-w-md whitespace-pre-wrap";
    bubble.textContent = "";

    actor.style.position = "fixed";
    actor.appendChild(bubble);

    for (let i = 0; i < text.length; i++) {
        bubble.textContent += text[i];
        await sleep(30);
    }
    await sleep(2000);

    bubble.remove();
}
// Fullscreen overlay with Continue button
function showOverlay(text) {
    return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.className = "demo-overlay fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4";
        overlay.innerHTML = `
            <div class="bg-white p-6 rounded-xl max-w-md w-full text-center space-y-4 shadow-2xl">
                <p class="text-lg font-semibold">${text}</p>
                <button class="bg-red-500 text-white px-6 py-2 rounded-lg font-bold w-full">Continue →</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector("button").onclick = () => {
            overlay.remove();
            resolve();
        };
    });
}

// Wait for click anywhere
function waitForUserClick(el = document.body) {
    return new Promise(resolve => {
        function handler() {
            el.removeEventListener("click", handler);
            resolve();
        }
        setTimeout(() => el.addEventListener("click", handler), 100);
    });
}

// Highlight harassment button
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

// ----------------- Map -----------------

function showDemoMap() {
    const container = document.getElementById("alert-container");
    if (!container) return;

    const box = document.createElement("div");
    box.className = "demo-mapbox bg-white p-4 rounded-xl shadow-xl";
    const mapId = "demo-map-" + Date.now();
    box.innerHTML = `<div id="${mapId}" class="w-full h-[260px] sm:h-[320px] rounded-xl"></div>`;
    container.prepend(box);

    setTimeout(() => {
        const map = L.map(mapId).setView([28.61, 77.20], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        L.marker([28.61, 77.20]).addTo(map).bindPopup("Aditi");

        let hLat = 28.60;
        let hLng = 77.18;
        const helper = L.marker([hLat, hLng]).addTo(map).bindPopup("Helper");

        const interval = setInterval(() => {
            hLat += 0.001;
            hLng += 0.001;
            helper.setLatLng([hLat, hLng]);
        }, 700);

        setTimeout(() => clearInterval(interval), 10000);
    }, 300);
}

// Panic card
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
        { duration: 90, iterations: 40 }
    );

    await waitForUserClick();
    card.remove();
}

// ----------------- STORY -----------------

async function startDemo() {
    await showOverlay("Welcome to ResQnet. This is a live simulation of how emergencies are handled.");

    // Goblin
    const goblin = createActor("/static/images/goblin.png", "bottom-[-40vh] right-4", 30);
    await sleep(100);
    goblin.style.bottom = "1rem";
    await sayTyped(goblin, "Hi! I will show you how ResQnet helps people in emergencies.");
    goblin.remove();

    // People
    const people = createActor(
        "/static/images/people.png",
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0",
        40   // ~40% of screen (about 20% bigger than before visually)
    );

    // fade + scale in
    await sleep(100);
    people.style.opacity = "1";
    people.style.transform = "translate(-50%, -50%) scale(1)";

    await sleep(5000);
    people.remove();

    // Aditi
    const aditi = createActor("/static/images/aditi.png", "bottom-[-40vh] left-4", 20);
    await sleep(100);
    aditi.style.bottom = "1rem";

    await sayTyped(aditi, "Someone is following me... I am scared.");
    await sayTyped(aditi, "Please press the Harassment button.");

    const btn = highlightHarassmentButton();
    await waitForUserClick(btn || document.body);
    unhighlightHarassmentButton();

    // Responders
    const help1 = createActor("/static/images/help1.png", "bottom-[-40vh] right-4", 20);
    const police = createActor(
        "/static/images/police.png",
        "top-[-50vh] right-[-40vw]",   // start completely outside from right
        25
    );

    // animate in
    await sleep(100);
    await sayTyped(help1, "I am near. I am coming to help!");

    police.style.top = "1rem";
    police.style.right = "1rem";
    await sayTyped(police, "Police is on the way!");

    showDemoMap();
    help1.remove();
    police.remove();

    await sayTyped(aditi, "Thank God... I am safe now. Thanks to ResQnet!");
    await oneClick();
    aditi.remove();

    // Gas leak
    const police1 = createActor("/static/images/police1.png", "top-[-45vh] right-10", 20);
    await sleep(100);
    police1.style.top = "1rem";

    await showPanicCard("🚨 GAS LEAK NEAR FACTORY! Use mask and move to EAST HIGHWAY immediately!");

    clearScene();

    // Evacuation
    const people2 = createActor(
        "/static/images/people2.png",
        "bottom-[-60vh] left-[-70vw]",  // start far outside left
        60
    );

    // slide in to left side
    await sleep(100);
    people2.style.bottom = "1rem";
    people2.style.left = "0.5rem";     // stick to extreme left


    await sayTyped(people2, "Follow the directions. Move to the safe highway.");

    showDemoMap();

    await oneClick();
    clearScene();

    await showOverlay("🎉 This concludes the demo. In real life, all of this happens with real people in real time.");
}

// ----------------- START -----------------

window.onload = () => {
    startDemo();
};
