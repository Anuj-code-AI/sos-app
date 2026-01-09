// ================= UTILITIES =================

function showOverlay(text, onNext) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center";

    overlay.innerHTML = `
      <div class="bg-white p-6 rounded-xl max-w-md text-center space-y-4">
        <p class="text-lg font-semibold">${text}</p>
        <button id="nextBtn" class="bg-red-500 text-white px-6 py-2 rounded-lg font-bold">
          Next →
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("nextBtn").onclick = () => {
        overlay.remove();
        if (onNext) onNext();
    };
}

function showCharacterMessage(name, role, message, onNext) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black/60 z-[9999] flex items-end justify-center p-4";

    overlay.innerHTML = `
      <div class="bg-white rounded-xl p-4 max-w-md w-full shadow-lg space-y-3">
        <div class="font-bold text-red-600">${name}
          <span class="text-gray-500 text-sm">(${role})</span>
        </div>
        <div class="text-gray-800">${message}</div>
        <button class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold w-full">
          Continue →
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("button").onclick = () => {
        overlay.remove();
        if (onNext) onNext();
    };
}

function stepStoryStart() {
    showCharacterMessage(
        "Aditi",
        "Student",
        "Someone is following me near the bus stand. I’m really scared.",
        stepHelperResponds
    );
}

function stepHelperResponds() {
    showCharacterMessage(
        "Rahul",
        "Nearby Citizen (350m)",
        "I got your alert. Don’t worry, I am coming towards you.",
        stepPoliceResponds
    );
}


function highlightElement(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add("ring-4", "ring-yellow-400", "animate-pulse");
}

function unhighlight(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.remove("ring-4", "ring-yellow-400", "animate-pulse");
}

function showTopBroadcast(msg) {
    const bar = document.createElement("div");
    bar.className = "fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center font-bold z-[9999]";
    bar.innerText = msg;
    document.body.appendChild(bar);
}

// ================= DEMO STEPS =================

function stepIntro() {
    showOverlay(
        "Welcome to ResQnet Demo. This is a guided simulation of how the system works in real life.",
        nextStep
    );
}

function stepExplainApp() {
    showOverlay(
        "ResQnet lets you send emergency alerts to nearby people and authorities in seconds.",
        nextStep
    );
}

function stepHighlightHarassment() {
    const btn = document.querySelector("button[onclick='openConfirmHarassment()']");

    if (!btn) {
        alert("Harassment button not found in demo.html");
        return;
    }

    highlightElement("button[onclick='openConfirmHarassment()']");

    showOverlay(
        "Let’s simulate a harassment emergency. Click the highlighted button.",
        () => {}
    );

    btn.onclick = () => {
        unhighlight("button[onclick='openConfirmHarassment()']");
        stepFakeAlertFlow();
    };
}

function stepFakeAlertFlow() {
    showOverlay(
        "🚨 Alert sent! Nearby users and police have been notified.",
        () => {
            stepShowHelperComing();
        }
    );
}

function stepShowHelperComing() {
    showOverlay(
        "A nearby helper is coming to your location. You can track them live on the map.",
        () => {
            stepShowPoliceNotified();
        }
    );
}

function stepShowPoliceNotified() {
    showTopBroadcast("🚓 Police have been notified and are on the way.");

    showOverlay(
        "Authorities are also informed automatically for serious emergencies.",
        nextStep
    );
}

function stepGasLeakBroadcast() {
    showTopBroadcast("🚨 EMERGENCY ALERT: Gas leakage detected nearby. Cover your face and move towards NH-48 immediately!");

    showOverlay(
        "ResQnet can broadcast life-saving alerts to everyone nearby.",
        nextStep
    );
}

function stepEnd() {
    showOverlay(
        "🎉 This concludes the demo. In real usage, everything happens live with real people and responders.",
        () => {}
    );
}

// ================= STEP ENGINE =================

const demoSteps = [
    stepIntro,
    stepExplainApp,
    stepHighlightHarassment,
    stepGasLeakBroadcast,
    stepEnd
];

let currentStep = 0;

function nextStep() {
    if (currentStep < demoSteps.length) {
        demoSteps[currentStep++]();
    }
}

window.onload = () => {
    nextStep();
};
