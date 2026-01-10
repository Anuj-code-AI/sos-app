// ======================================================
// ResQnet DEMO — Story Mode (Ultra Cinematic Final)
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

// ======================================================
// 🆘 HARASSMENT RESCUE MAP
// ======================================================

function showRescueMap() {
    const container = document.getElementById("alert-container");
    if (!container) return null;

    const box = document.createElement("div");
    box.className = "demo-mapbox bg-white p-4 rounded-xl shadow-xl";

    const mapId = "demo-rescue-map-" + Date.now();
    box.innerHTML = `<div id="${mapId}" class="w-full h-[260px] sm:h-[320px] rounded-xl"></div>`;
    container.prepend(box);

    setTimeout(() => {
        const map = L.map(mapId, { zoomControl: false, attributionControl: false })
            .setView([28.61, 77.20], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        // 3x icons
        const aditiIcon = L.icon({ iconUrl: "/static/images/aditi.png", iconSize: [36,36], iconAnchor: [18,18] });
        const help1Icon = L.icon({ iconUrl: "/static/images/help1.png", iconSize: [40,40], iconAnchor: [40,40] });
        const help2Icon = L.icon({ iconUrl: "/static/images/police.png", iconSize: [40,40], iconAnchor: [40,40] });

        const target = [28.61, 77.20];

        L.marker(target, { icon: aditiIcon }).addTo(map);

        // Heat rings
        for (let i = 0; i < 5; i++) {
            L.circle(target, {
                radius: 120 + i * 120,
                color: "red",
                fillColor: "red",
                fillOpacity: 0.08 - i * 0.01,
                weight: 0
            }).addTo(map);
        }

        // SOS Pulse
        const sos = L.circle(target, {
            radius: 80,
            color: "red",
            fillColor: "red",
            fillOpacity: 0.25
        }).addTo(map);

        let grow = true;
        const sosInterval = setInterval(() => {
            let r = sos.getRadius();
            if (grow) {
                r += 20; if (r > 350) grow = false;
            } else {
                r -= 20; if (r < 80) grow = true;
            }
            sos.setRadius(r);
        }, 120);

        // Helpers
        let h1 = [28.605, 77.185];
        let h2 = [28.615, 77.215];

        const m1 = L.marker(h1, { icon: help1Icon }).addTo(map);
        const m2 = L.marker(h2, { icon: help2Icon }).addTo(map);

        const c1 = [28.607, 77.195];
        const c2 = [28.613, 77.205];

        function bezier(p0,p1,p2,t){
            return [
                (1-t)*(1-t)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0],
                (1-t)*(1-t)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1]
            ];
        }

        const line1 = L.polyline([h1,c1,target], { color:"blue" }).addTo(map);
        const line2 = L.polyline([h2,c2,target], { color:"green" }).addTo(map);

        let t = 0;
        const interval = setInterval(() => {
            t += 0.015;
            if (t > 1) t = 1;

            const p1 = bezier(h1,c1,target,t);
            const p2 = bezier(h2,c2,target,t);

            m1.setLatLng(p1);
            m2.setLatLng(p2);

            line1.setLatLngs([h1,c1,p1]);
            line2.setLatLngs([h2,c2,p2]);

            if (t >= 1) {
                clearInterval(interval);
                map.flyTo(target, 17, { duration: 1.5 });
                setTimeout(()=>clearInterval(sosInterval),2000);
            }
        }, 60);

    }, 200);

    return box;
}

// ======================================================
// 🧯 GAS LEAK EVACUATION MAP
// ======================================================

function showGasMap() {
    const container = document.getElementById("alert-container");
    if (!container) return null;

    const box = document.createElement("div");
    box.className = "demo-mapbox bg-white p-4 rounded-xl shadow-xl";

    const mapId = "demo-gas-map-" + Date.now();
    box.innerHTML = `<div id="${mapId}" class="w-full h-[260px] sm:h-[320px] rounded-xl"></div>`;
    container.prepend(box);

    setTimeout(() => {
        const map = L.map(mapId, { zoomControl: false, attributionControl: false })
            .setView([28.61, 77.20], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        

        const danger = [28.61, 77.20];
        const safe = [28.61, 77.23];

        // Danger + warning
        L.circle(danger, { radius: 500, color:"red", fillColor:"red", fillOpacity:0.25 }).addTo(map);
        L.circle(danger, { radius: 900, color:"orange", fillColor:"orange", fillOpacity:0.15 }).addTo(map);

        // Safe zone
        L.circle(safe, { radius: 300, color:"green", fillColor:"green", fillOpacity:0.25 }).addTo(map);

        L.marker([28.612,77.198], { icon: policeIcon }).addTo(map);

        let crowd = [28.609,77.202];
        const crowdMarker = L.marker(crowd, { icon: peopleIcon }).addTo(map);

        const route = L.polyline([crowd,safe], { color:"green", weight:5, dashArray:"10,10" }).addTo(map);

        const steps = 60;
        let step = 0;
        const dLat = (safe[0]-crowd[0])/steps;
        const dLng = (safe[1]-crowd[1])/steps;

        const interval = setInterval(()=>{
            step++;
            crowd = [crowd[0]+dLat, crowd[1]+dLng];
            crowdMarker.setLatLng(crowd);
            route.setLatLngs([crowd,safe]);

            if(step>=steps){
                clearInterval(interval);
                map.flyTo(safe,16,{duration:1.5});
            }
        },80);

    },200);

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

// ======================================================
// STORY
// ======================================================

async function startDemo() {
    await showOverlay("Welcome to ResQnet. This is a live simulation of how emergencies are handled.");

    // ----------------- Intro -----------------
    const goblin = createActor("/static/images/goblin.png", "bottom-[-40vh] right-4", 30);
    await sleep(100);
    goblin.style.bottom = "1rem";
    await sayTyped(goblin, "Hi! I will show you how ResQnet helps people in emergencies.");
    goblin.remove();

    // ----------------- Harassment Scene -----------------
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

    const rescueMap = showRescueMap();
    lockInput(6500);
    await sleep(6700);
    if (rescueMap) rescueMap.remove();

    help1.remove();
    police.remove();

    await sayTyped(aditi, "Thank God... I am safe now. Thanks to ResQnet!");
    aditi.remove();

    // ----------------- PAUSE -----------------
    await sleep(2000);

    // ----------------- Feature Explanation -----------------
    const goblin2 = createActor("/static/images/goblin.png", "bottom-[-40vh] right-4", 30);
    await sleep(100);
    goblin2.style.bottom = "1rem";

    await sayTyped(goblin2, "Great! But ResQnet is not only for harassment emergencies.");
    await sayTyped(goblin2, "You can report fire, gas leaks, accidents and many other dangers using these buttons.");
    await sayTyped(goblin2, "Nearby people, police, and authorities get notified instantly.");

    // Let this explanation breathe (~8 seconds total already via typing + clicks)
    goblin2.remove();

    // ----------------- SUDDEN GAS ALERT -----------------
    const police1 = createActor("/static/images/police1.png", "top-[-45vh] right-10", 20);
    await sleep(100);
    police1.style.top = "1rem";

    await showPanicCard("🚨 GAS LEAK NEAR FACTORY! Use mask and move to EAST HIGHWAY immediately!");
    police1.remove();

    clearScene();

    // ----------------- Evacuation -----------------
    const people2 = createActor("/static/images/people2.png", "bottom-[-60vh] left-0", 60);
    await sleep(100);
    people2.style.bottom = "1rem";

    await sayTyped(people2, "Follow the directions. Move to the safe highway.");

    const gasMap = showGasMap();
    lockInput(6500);
    await sleep(6700);
    if (gasMap) gasMap.remove();

    clearScene();

    // ----------------- Final Explanation -----------------
    const goblin3 = createActor("/static/images/goblin.png", "bottom-[-40vh] right-4", 30);
    await sleep(100);
    goblin3.style.bottom = "1rem";

    await sayTyped(goblin3, "Not only users, even the Government and authorities can send emergency alerts like this.");
    await sayTyped(goblin3, "This ensures everyone in the area gets the warning in time.");

    goblin3.remove();

    await showOverlay("🎉 This concludes the demo. In real life, all of this happens with real people in real time.");
}

// ----------------- START -----------------

window.onload = () => {
    startDemo();
};
