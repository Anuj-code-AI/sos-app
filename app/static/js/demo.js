// ======================================================
// ResQnet DEMO — Cinematic Story Mode (No Backend)
// Assets expected in: /static/images/
// goblin.png, people.png, aditi.png, help1.png, help2.png, police.png, police1.png, people2.png
// ======================================================

// ----------------- Utilities -----------------

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearScene() {
    document.querySelectorAll(".demo-actor, .demo-overlay, .demo-panic").forEach(e => e.remove());
}

function createActor(imgSrc, positionClass, sizeClass = "w-40") {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = `demo-actor fixed z-[9000] transition-all duration-700 ease-out ${sizeClass} ${positionClass}`;
    document.body.appendChild(img);
    return img;
}

function say(actor, text) {
    const bubble = document.createElement("div");
    bubble.className = "demo-overlay absolute -top-20 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-lg text-sm max-w-xs";
    bubble.innerText = text;
    actor.style.position = "fixed";
    actor.appendChild(bubble);
    setTimeout(() => bubble.remove(), 3500);
}

function showOverlayCenter(text, onNext) {
    const overlay = document.createElement("div");
    overlay.className = "demo-overlay fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center";
    overlay.innerHTML = `
        <div class="bg-white p-6 rounded-xl max-w-md text-center space-y-4 shadow-2xl">
            <p class="text-lg font-semibold">${text}</p>
            <button class="bg-red-500 text-white px-6 py-2 rounded-lg font-bold">Continue →</button>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector("button").onclick = () => {
        overlay.remove();
        if (onNext) onNext();
    };
}

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

// ----------------- Map Helpers -----------------

function showDemoMap(lat = 28.61, lng = 77.20) {
    const container = document.getElementById("alert-container");
    if (!container) return null;

    const box = document.createElement("div");
    const mapId = "demo-map-" + Date.now();
    box.className = "bg-white p-4 rounded-xl shadow-xl";
    box.innerHTML = `<div id="${mapId}" class="w-full h-[260px] rounded-xl"></div>`;
    container.prepend(box);

    setTimeout(() => {
        const map = L.map(mapId).setView([lat, lng], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup("Victim");
    }, 100);

    return box;
}

function showEvacuationMap() {
    const container = document.getElementById("alert-container");
    if (!container) return;

    const box = document.createElement("div");
    const mapId = "demo-evac-map-" + Date.now();
    box.className = "bg-white p-4 rounded-xl shadow-xl";
    box.innerHTML = `<div id="${mapId}" class="w-full h-[260px] rounded-xl"></div>`;
    container.prepend(box);

    setTimeout(() => {
        const map = L.map(mapId).setView([28.62, 77.22], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        const marker = L.marker([28.60, 77.18]).addTo(map).bindPopup("You");

        let lat = 28.60;
        let lng = 77.18;

        const interval = setInterval(() => {
            lat += 0.002;
            lng += 0.002;
            marker.setLatLng([lat, lng]);
        }, 700);

        setTimeout(() => clearInterval(interval), 8000);
    }, 100);
}

// ----------------- Panic Card -----------------

function showPanicCard(text) {
    const card = document.createElement("div");
    card.className = "demo-panic fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-6 rounded-xl shadow-2xl text-xl font-bold z-[9999] animate-pulse";
    card.innerText = text;
    document.body.appendChild(card);

    // shake
    card.animate(
        [
            { transform: "translate(-50%, -50%) translateX(-5px)" },
            { transform: "translate(-50%, -50%) translateX(5px)" }
        ],
        { duration: 100, iterations: 20 }
    );

    setTimeout(() => card.remove(), 6000);
}

// ======================================================
// STORY
// ======================================================

async function startDemo() {
    // ---------- Intro ----------
    showOverlayCenter("Welcome to ResQnet. This is a live simulation of how emergencies are handled.", async () => {

        // Goblin explains (bottom right)
        const goblin = createActor("/static/images/goblin.png", "bottom-[-200px] right-4", "w-48");
        await sleep(100);
        goblin.classList.remove("bottom-[-200px]");
        goblin.classList.add("bottom-4");
        say(goblin, "Hi! I will show you how ResQnet saves lives in real situations.");

        await sleep(4000);
        goblin.remove();

        // People appears from bottom center
        const people = createActor("/static/images/people.png", "bottom-[-200px] left-1/2 -translate-x-1/2", "w-48");
        await sleep(100);
        people.classList.remove("bottom-[-200px]");
        people.classList.add("bottom-10");

        await sleep(2000);
        people.remove();

        // ---------- Aditi Appears ----------
        const aditi = createActor("/static/images/aditi.png", "bottom-[-200px] left-4", "w-40");
        await sleep(100);
        aditi.classList.remove("bottom-[-200px]");
        aditi.classList.add("bottom-4");
        say(aditi, "Someone is following me... I need help!");

        await sleep(3000);
        say(aditi, "Please press the Harassment button!");

        // Highlight harassment
        const btn = highlightHarassmentButton();

        // Wait for user click
        if (btn) {
            btn.onclick = async () => {
                unhighlightHarassmentButton();

                // ---------- Responders ----------
                const help1 = createActor("/static/images/help1.png", "bottom-[-200px] right-4", "w-40");
                const help2 = createActor("/static/images/help2.png", "top-1/2 right-[-200px] -translate-y-1/2", "w-40");
                const police = createActor("/static/images/police.png", "top-[-200px] right-20", "w-40");

                await sleep(100);
                help1.classList.remove("bottom-[-200px]");
                help1.classList.add("bottom-4");
                say(help1, "I am near, I will help her!");

                await sleep(800);
                help2.classList.remove("right-[-200px]");
                help2.classList.add("right-4");
                say(help2, "I am also coming!");

                await sleep(800);
                police.classList.remove("top-[-200px]");
                police.classList.add("top-4");
                say(police, "Police is on the way!");

                // Show map
                showDemoMap();

                await sleep(5000);
                say(aditi, "Thank God... I am safe now. Thanks to ResQnet!");

                // ---------- Gas Leak ----------
                await sleep(3000);

                const police1 = createActor("/static/images/police1.png", "top-[-200px] right-10", "w-40");
                await sleep(100);
                police1.classList.remove("top-[-200px]");
                police1.classList.add("top-4");

                showPanicCard("🚨 GAS LEAKAGE NEAR FACTORY! Use mask and move to EAST HIGHWAY immediately!");

                await sleep(6000);

                // Clear scene
                clearScene();

                // ---------- Evacuation ----------
                const people2 = createActor("/static/images/people2.png", "bottom-[-200px] left-1/2 -translate-x-1/2", "w-48");
                await sleep(100);
                people2.classList.remove("bottom-[-200px]");
                people2.classList.add("bottom-6");
                say(people2, "Follow the directions. Move to the safe highway.");

                showEvacuationMap();

                await sleep(8000);

                showOverlayCenter("🎉 This concludes the demo. In real life, all of this happens with real people in real time.", () => {});
            };
        }
    });
}

// ======================================================
// START
// ======================================================

window.onload = () => {
    startDemo();
};
