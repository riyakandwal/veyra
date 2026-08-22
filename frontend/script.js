import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const container = document.getElementById("skull-container");

// -------------------------
// Scene
// -------------------------

const scene = new THREE.Scene();

// -------------------------
// Camera
// -------------------------

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 0, 5);

// -------------------------
// Renderer
// -------------------------

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

container.appendChild(renderer.domElement);

// -------------------------
// Lights
// -------------------------

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const cyanLight = new THREE.PointLight(0x00eaff, 10, 10);
cyanLight.position.set(2, 2, 3);
scene.add(cyanLight);

const blueLight = new THREE.PointLight(0x0066ff, 8, 10);
blueLight.position.set(-2, -1, 2);
scene.add(blueLight);


// -------------------------
// Holographic Particles
// -------------------------

const particleCount = 250;

const particleGeometry = new THREE.BufferGeometry();

const particlePositions = new Float32Array(
    particleCount * 3
);

for (let i = 0; i < particleCount * 3; i++) {

    particlePositions[i] =
        (Math.random() - 0.5) * 5;

}

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        particlePositions,
        3
    )
);

const particleMaterial = new THREE.PointsMaterial({

    color: 0xb8c2ff,

    size: 0.025,

    transparent: true,

    opacity: 0.35,

    blending: THREE.AdditiveBlending,

    depthWrite: false

});

const particles = new THREE.Points(
    particleGeometry,
    particleMaterial
);

scene.add(particles);


// -------------------------
// VEYRA AI Eyes
// -------------------------

const eyeGeometry = new THREE.SphereGeometry(0.055, 16, 16);

const eyeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const leftEye = new THREE.Mesh(
    eyeGeometry,
    eyeMaterial
);

const rightEye = new THREE.Mesh(
    eyeGeometry,
    eyeMaterial
);

// Eye positions
leftEye.position.set(0.82, 0.12, 0.18);
rightEye.position.set(0.82, 0.12, -0.18);
if (window.veyraSkull) {
    window.veyraSkull.add(leftEye);
    window.veyraSkull.add(rightEye);
}




// =========================
// VEYRA NEURAL CORE
// =========================

const neuralCore = new THREE.Group();
scene.add(neuralCore);

// -------------------------
// Core sphere
// -------------------------

const coreGeometry = new THREE.IcosahedronGeometry(0.85, 4);

const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xdde3ff,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const core = new THREE.Mesh(
    coreGeometry,
    coreMaterial
);

neuralCore.add(core);


// -------------------------
// Inner glow sphere
// -------------------------

const coreGlowGeometry =
    new THREE.SphereGeometry(0.62, 32, 32);


const coreGlowMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x9caeff,
        transparent: true,
        opacity: 0.10,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

const innerGlow = new THREE.Mesh(
    coreGlowGeometry,
    coreGlowMaterial
);

neuralCore.add(innerGlow);


// -------------------------
// Neural particles
// -------------------------

const nodeCount = 180;

const nodeGeometry =
    new THREE.BufferGeometry();

const nodePositions =
    new Float32Array(nodeCount * 3);

for (let i = 0; i < nodeCount; i++) {

    const radius =
        0.45 + Math.random() * 0.55;

    const theta =
        Math.random() * Math.PI * 2;

    const phi =
        Math.acos(
            2 * Math.random() - 1
        );

    const x =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

    const y =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

    const z =
        radius *
        Math.cos(phi);

    nodePositions[i * 3] = x;
    nodePositions[i * 3 + 1] = y;
    nodePositions[i * 3 + 2] = z;
}

nodeGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        nodePositions,
        3
    )
);

const nodeMaterial =
    new THREE.PointsMaterial({

        color: 0xf0f2ff,

        size: 0.010,

        transparent: true,

        opacity: 0.55,

        blending:
            THREE.AdditiveBlending,

        depthWrite: false
    });

const neuralNodes =
    new THREE.Points(
        nodeGeometry,
        nodeMaterial
    );

neuralCore.add(neuralNodes);


// -------------------------
// Orbital rings
// -------------------------

function createOrbit(
    radius,
    tube,
    rotation
) {

    const geometry =
        new THREE.TorusGeometry(
            radius,
            tube,
            16,
            160
        );

    const material =
        new THREE.MeshBasicMaterial({

            color: 0xb9c3ff,

            transparent: true,

            opacity: 0.18,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });

    const ring =
        new THREE.Mesh(
            geometry,
            material
        );

    ring.rotation.set(
        rotation.x,
        rotation.y,
        rotation.z
    );

    neuralCore.add(ring);

    return ring;
}


const orbit1 = createOrbit(
    1.12,
    0.008,
    {
        x: 0.4,
        y: 0.2,
        z: 0
    }
);

const orbit2 = createOrbit(
    1.22,
    0.006,
    {
        x: 1.2,
        y: -0.5,
        z: 0.4
    }
);

const orbit3 = createOrbit(
    1.05,
    0.005,
    {
        x: -0.7,
        y: 0.8,
        z: 0.2
    }
);


// -------------------------
// Small energy points
// -------------------------

const energyGeometry =
    new THREE.SphereGeometry(
        0.018,
        12,
        12
    );

const energyMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xdde3ff,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
    });

for (let i = 0; i < 8; i++) {

    const point =
        new THREE.Mesh(
            energyGeometry,
            energyMaterial
        );

    const angle =
        (i / 8) * Math.PI * 2;

    point.position.set(
        Math.cos(angle) * 1.15,
        Math.sin(angle) * 1.15,
        (Math.random() - 0.5) * 0.35
    );

    neuralCore.add(point);
}


// -------------------------
// Core position
// -------------------------

neuralCore.position.set(
    0,
    0,
    0
);

neuralCore.scale.setScalar(1.15);

console.log(
    "VEYRA neural core initialized"
);

// -------------------------
// Animation
// -------------------------

function animate() {

    requestAnimationFrame(animate);

    // Neural core rotation

    neuralCore.rotation.y += 0.002;
    neuralCore.rotation.x += 0.0005;

    // Orbital movement

    orbit1.rotation.z += 0.004;
    orbit2.rotation.x -= 0.003;
    orbit3.rotation.y += 0.0025;

    // Subtle breathing effect

    const corePulse =
        0.82 + Math.sin(Date.now() * 0.002) * 0.02;

    neuralCore.scale.setScalar(corePulse);

    // Eye pulse
    const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.2;

    leftEye.scale.setScalar(pulse);
    rightEye.scale.setScalar(pulse);

    // Slowly rotate particles
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;




    renderer.render(scene, camera);
}

animate();

// -------------------------
// Responsive
// -------------------------

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// =========================
// VEYRA Voice Input
// =========================

const voiceButton =
    document.getElementById("voice-button");

const voiceStatus =
    document.getElementById("voice-status");

const userCommand =
    document.getElementById("user-command");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    voiceStatus.textContent =
        "VOICE INPUT NOT SUPPORTED";

} else {

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    voiceButton.addEventListener(
        "click",
        () => {

            voiceStatus.textContent =
                "LISTENING...";

            voiceButton.textContent =
                "LISTENING";

            recognition.start();

        }
    );

    window.speakVeyra = function (text) {
        voiceStatus.textContent = text;

        const speech = new SpeechSynthesisUtterance(text);

        const voices = speechSynthesis.getVoices();

        speech.voice =
            voices.find(v =>
                v.name.includes("Sonia")
            ) ||
            voices.find(v =>
                v.name.includes("Jenny")
            ) ||
            voices.find(v =>
                v.lang.startsWith("en")
            );
        speech.lang = "en-GB";
        speech.rate = 1.1;
        speech.pitch = 1.05;
        speech.volume = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
    };


    recognition.onresult = async (event) => {

        const transcript =
            event.results[0][0].transcript;

        userCommand.textContent =
            `> ${transcript}`;

        voiceStatus.textContent =
            "COMMAND RECEIVED";

        voiceButton.textContent =
            "ACTIVATE VEYRA";

        console.log(
            "User said:",
            transcript
        );
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: transcript
            })
        });

        const data = await response.json();

        console.log("VEyRA REPLY:", data.reply);
        voiceStatus.textContent = data.reply;
        const speech = new SpeechSynthesisUtterance(data.reply);
        speech.voice = speechSynthesis.getVoices()[2];

        speech.lang = "en-IN";
        speech.rate = 1.1;
        speech.pitch = 1.05;
        speech.volume = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);

    };


    recognition.onerror = (event) => {

        console.error(
            "Voice error:",
            event.error
        );

        voiceStatus.textContent =
            "VOICE ERROR";

        voiceButton.textContent =
            "TRY AGAIN";

    };


    recognition.onend = () => {

        voiceButton.textContent =
            "ACTIVATE VEYRA";

    };

}

async function checkVeyraBackend() {
    try {
        const response = await fetch("http://127.0.0.1:8000/");
        const data = await response.json();

        console.log("VEYRA BACKEND:", data);

    } catch (error) {
        console.error("Backend connection failed:", error);
    }
}

checkVeyraBackend();

const voices = window.speechSynthesis.getVoices();

voices.forEach((voice, index) => {
    console.log(index, voice.name, voice.lang);
});