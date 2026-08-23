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
        console.error(
            "VEYRA VISION: CAMERA ERROR",
            error
        );
    }
}


async function sendFrameToVision() {

    if (visionRequestInProgress) {
        return;
    }

    const video =
        document.getElementById("vision-camera");

    const overlay =
        document.getElementById("vision-overlay");

    if (!video || !cameraStream || !overlay) {
        return;
    }

    visionRequestInProgress = true;

    try {

        const overlayCtx =
            overlay.getContext("2d");

        overlay.width =
            video.videoWidth || 640;

        overlay.height =
            video.videoHeight || 480;


        // -------------------------
        // Load vision model
        // -------------------------

        if (!window.veyraVisionModel) {

            console.log(
                "Loading Veyra vision model..."
            );

            window.veyraVisionModel =
                await cocoSsd.load();

            console.log(
                "VEYRA Vision Model: READY"
            );
        }


        // -------------------------
        // Detect objects
        // -------------------------

        const predictions =
            await window.veyraVisionModel.detect(
                video
            );

        const validObjects =
            predictions.filter(
                item => item.score >= 0.50
            );


        // Clear previous boxes

        overlayCtx.clearRect(
            0,
            0,
            overlay.width,
            overlay.height
        );


        // -------------------------
        // Nothing detected
        // -------------------------

        if (validObjects.length === 0) {

            const resultBox =
                document.getElementById(
                    "vision-result"
                );

            if (resultBox) {
                resultBox.textContent =
                    "VISION: Nothing detected";
            }

            return;
        }


        // -------------------------
        // Object names
        // -------------------------

        const objectNames = [
            ...new Set(
                validObjects.map(
                    item => item.class
                )
            )
        ];


        // -------------------------
        // Main object position
        // -------------------------

        const mainObject =
            validObjects[0];

        const [
            x,
            y,
            width,
            height
        ] = mainObject.bbox;

        const centerX =
            x + width / 2;

        let position = "in front of you";

        if (centerX < overlay.width / 3) {
            position = "on your left";
        } else if (centerX > (overlay.width * 2) / 3) {
            position = "on your right";
        }

        // Exact bounding-box coordinates
        const exactPosition =
            `x=${Math.round(x)}, y=${Math.round(y)}, ` +
            `width=${Math.round(width)}, height=${Math.round(height)}`;


        // -------------------------
        // Create vision description
        // -------------------------

        let description;


        if (objectNames.length === 1) {

            description =
                `I can see a ${objectNames[0]} ${position}. ` +
                `Bounding box: ${exactPosition}.`;

        } else if (objectNames.length === 2) {

            description =
                `I can see a ${objectNames[0]} and a ${objectNames[1]} ${position}. ` +
                `Main object's bounding box: ${exactPosition}.`;

        } else {

            const lastObject =
                objectNames[
                objectNames.length - 1
                ];

            const otherObjects =
                objectNames.slice(0, -1);

            description =
                `I can see ${otherObjects.join(", ")}, and a ${lastObject} ${position}`;
        }


        // -------------------------
        // Store current vision
        // -------------------------

        window.lastVisionDescription =
            description;

        console.log(
            "VISION STORED:",
            window.lastVisionDescription
        );


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
                `${item.class} ${Math.round(
                    item.score * 100
                )}%`,
                boxX,
                Math.max(
                    18,
                    boxY - 6
                )
            );

        });


        // -------------------------
        // Vision result UI
        // -------------------------

        const resultBox =
            document.getElementById(
                "vision-result"
            );


        if (resultBox) {

            const objects =
                validObjects.map(
                    item =>
                        `${item.class} (${Math.round(
                            item.score * 100
                        )}%)`
                );

            resultBox.textContent =
                `I can see: ${objects.join(", ")}`;
        }


        // -------------------------
        // IMPORTANT:
        // No automatic voice here.
        //
        // VEYRA stores the vision
        // silently and only speaks
        // when the user asks.
        // -------------------------

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


// -------------------------
// Vision detection loop
// -------------------------

let visionInterval = null;


function startVisionDetection() {

    if (visionInterval) {
        return;
    }

    visionInterval =
        setInterval(() => {

            sendFrameToVision();

        }, 500);
}


// -------------------------
// Stop vision detection
// -------------------------

function stopVisionDetection() {

    if (visionInterval) {

        clearInterval(
            visionInterval
        );

        visionInterval = null;
    }
}


// -------------------------
// Stop camera
// -------------------------

function stopVisionCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => {
                track.stop();
            });

        cameraStream = null;

        stopVisionDetection();
    }
}