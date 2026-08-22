from ultralytics import YOLO

model = YOLO("yolo11n.pt")
last_detection = None
detection_count = 0


def detect_objects(frame):
    global last_detection, detection_count
    results = model(
    frame,
    conf=0.50,
    verbose=False)

    detections = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            object_name = model.names[class_id]
        
            if object_name == "mouse":
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            detections.append({
                "name": object_name,
                "confidence": round(confidence, 2),
                "box": {
                    "x1": x1,
                    "y1": y1,
                    "x2": x2,
                    "y2": y2
                }
            })

    if not detections:
        return []

    global last_detection, detection_count

    current_detection = detections[0]["name"]

    if current_detection == last_detection:
        detection_count += 1
    else:
        last_detection = current_detection
        detection_count = 1

    if detection_count < 2:
        return []

    return detections

    return detections

    return detections
if __name__ == "__main__":
    print("VEYRA Vision: YOLO loaded successfully")

