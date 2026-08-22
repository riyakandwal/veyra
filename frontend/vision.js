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

    visionRequestInProgress = true;
    const video = document.getElementById("vision-camera");
    const overlay = document.getElementById("vision-overlay");
    const overlayCtx = overlay.getContext("2d");

    overlay.width = video.videoWidth || 640;
    overlay.height = video.videoHeight || 480;

    if (!video || !cameraStream) return;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 640, 480);



    const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, "image/jpeg", 0.8);
    });

    const formData = new FormData();
    formData.append("frame", blob, "frame.jpg");

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/vision/detect",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();


        if (data.detections && data.detections.length > 0) {
            const validObjects = data.detections.filter(
                item => item.confidence >= 0.50
            );

            if (validObjects.length === 0) return;

            const objectNames = [
                ...new Set(validObjects.map(item => item.name))
            ];

            const mainObject = validObjects[0];

            let position = "in front of you";

            if (mainObject.box) {
                const centerX =
                    (mainObject.box.x1 + mainObject.box.x2) / 2;

                if (centerX < 640 / 3) {
                    position = "on your left";
                } else if (centerX > (640 * 2) / 3) {
                    position = "on your right";
                }
            }

            let description;


            if (objectNames.length === 1) {
                description = `I can see a ${objectNames[0]} ${position}`;
            } else if (objectNames.length === 2) {
                description =
                    `I can see a ${objectNames[0]} and a ${objectNames[1]} ${position}`;
            } else {
                const lastObject = objectNames[objectNames.length - 1];
                const otherObjects = objectNames.slice(0, -1);

                description =
                    `I can see ${otherObjects.join(", ")}, and a ${lastObject} ${position}`;
            }

            const now = Date.now();

            if (
                objectNames.join(",") !== lastAnnouncedObject ||
                now - lastAnnouncedTime > 8000
            ) {
                lastAnnouncedObject = objectNames.join(",");
                lastAnnouncedTime = now;

                console.log("VEYRA:", description);

                if (window.speakVeyra) {
                    window.speakVeyra(description);
                }
            }
            overlayCtx.clearRect(
                0,
                0,
                overlay.width,
                overlay.height
            );

            if (data.detections) {
                data.detections.forEach(item => {
                    const box = item.box;

                    if (!box) return;

                    overlayCtx.strokeStyle = "#00ffff";
                    overlayCtx.lineWidth = 2;

                    overlayCtx.strokeRect(
                        box.x1,
                        box.y1,
                        box.x2 - box.x1,
                        box.y2 - box.y1
                    );

                    overlayCtx.font = "16px monospace";
                    overlayCtx.fillStyle = "#00ffff";

                    overlayCtx.fillText(
                        `${item.name} ${Math.round(item.confidence * 100)}%`,
                        box.x1,
                        Math.max(18, box.y1 - 5)
                    );
                });
            }
            console.log("VISION RESULT:", data);
            const resultBox = document.getElementById("vision-result");

            if (resultBox) {
                if (data.detections && data.detections.length > 0) {
                    const objects = data.detections.map(
                        item => `${item.name} (${Math.round(item.confidence * 100)}%)`
                    );

                    resultBox.textContent = `I can see: ${objects.join(", ")}`;
                } else {
                    resultBox.textContent = "VISION: Nothing detected";
                }
            }



        }
    } catch (error) {
        console.error("VEYRA VISION ERROR:", error);
    }
    finally {
        visionRequestInProgress = false;
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