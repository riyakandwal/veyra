let cameraStream = null;
let visionRequestInProgress = false;

async function startVisionCamera() {
    const video = document.getElementById("vision-camera");

    if (!video) {
        console.error("VEYRA VISION: video element not found");
        return;
    }

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 640,
                height: 480
            },
            audio: false
        });

        video.srcObject = cameraStream;
        await video.play();

        console.log("VEYRA VISION: CAMERA ONLINE");

        startVisionDetection();

    } catch (error) {
        console.error("VEYRA VISION: CAMERA ERROR", error);
    }
}

async function sendFrameToVision() {
    if (visionRequestInProgress) return;

    const video = document.getElementById("vision-camera");
    const overlay = document.getElementById("vision-overlay");

    if (!video || !cameraStream || !overlay) return;

    visionRequestInProgress = true;

    try {
        const overlayCtx = overlay.getContext("2d");

        overlay.width = video.videoWidth || 640;
        overlay.height = video.videoHeight || 480;

        if (!window.veyraVisionModel) {
            console.log("Loading Veyra vision model...");

            window.veyraVisionModel =
                await cocoSsd.load();

            console.log("VEYRA Vision Model: READY");
        }

        const predictions =
            await window.veyraVisionModel.detect(video);

        const validObjects = predictions.filter(
            item => item.score >= 0.50
        );

        overlayCtx.clearRect(
            0,
            0,
            overlay.width,
            overlay.height
        );

        if (validObjects.length === 0) {
            const resultBox =
                document.getElementById("vision-result");

            if (resultBox) {
                resultBox.textContent =
                    "VISION: Nothing detected";
            }

            return;
        }

        const objectNames = [
            ...new Set(
                validObjects.map(item => item.class)
            )
        ];

        const mainObject = validObjects[0];

        const [x, y, width, height] =
            mainObject.bbox;

        const centerX =
            x + width / 2;

        let position = "in front of you";

        if (centerX < overlay.width / 3) {
            position = "on your left";
        } else if (
            centerX >
            (overlay.width * 2) / 3
        ) {
            position = "on your right";
        }

        let description;

        if (objectNames.length === 1) {

            description =
                `I can see a ${objectNames[0]} ${position}`;

        } else if (objectNames.length === 2) {

            description =
                `I can see a ${objectNames[0]} and a ${objectNames[1]} ${position}`;

        } else {

            const lastObject =
                objectNames[objectNames.length - 1];

            const otherObjects =
                objectNames.slice(0, -1);

            description =
                `I can see ${otherObjects.join(", ")}, and a ${lastObject} ${position}`;
        }

        // -------------------------
        // Draw detection boxes
        // -------------------------

        validObjects.forEach(item => {

            const [
                boxX,
                boxY,
                boxWidth,
                boxHeight
            ] = item.bbox;

            overlayCtx.strokeStyle =
                "#c7d0ff";

            overlayCtx.lineWidth = 2;

            overlayCtx.strokeRect(
                boxX,
                boxY,
                boxWidth,
                boxHeight
            );

            overlayCtx.font =
                "14px Inter, sans-serif";

            overlayCtx.fillStyle =
                "#e8eaf0";

            overlayCtx.fillText(
                `${item.class} ${Math.round(item.score * 100)}%`,
                boxX,
                Math.max(18, boxY - 6)
            );
        });

        // -------------------------
        // Vision result
        // -------------------------

        const resultBox =
            document.getElementById("vision-result");

        if (resultBox) {

            const objects =
                validObjects.map(
                    item =>
                        `${item.class} (${Math.round(item.score * 100)}%)`
                );

            resultBox.textContent =
                `I can see: ${objects.join(", ")}`;
        }

        // -------------------------
        // Voice announcement
        // -------------------------

        const now = Date.now();

        const detectionKey =
            objectNames.join(",");

        if (
            detectionKey !== lastAnnouncedObject ||
            now - lastAnnouncedTime > 8000
        ) {

            lastAnnouncedObject =
                detectionKey;

            lastAnnouncedTime =
                now;

            console.log(
                "VEYRA:",
                description
            );

            if (window.speakVeyra) {
                window.speakVeyra(
                    description
                );
            }
        }

    } catch (error) {

        console.error(
            "VEYRA VISION ERROR:",
            error
        );

    } finally {

        visionRequestInProgress =
            false;
    }
}

let visionInterval = null;
let lastAnnouncedObject = null;
let lastAnnouncedTime = 0;

function startVisionDetection() {
    if (visionInterval) return;

    visionInterval = setInterval(() => {
        sendFrameToVision();
    }, 500);
}

function stopVisionDetection() {
    if (visionInterval) {
        clearInterval(visionInterval);
        visionInterval = null;
    }
}

function stopVisionCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());

        cameraStream = null;
        stopVisionDetection();
    }
}