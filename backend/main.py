from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
import os
from supabase import create_client
from core.ai import get_ai_response
from memory.memory import get_memory, save_conversation
from fastapi import UploadFile, File
from vision.vision import detect_objects


load_dotenv()
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://127.0.0.1:5500",
    "http://127.0.0.1:5501",
    "http://localhost:5500",
    "http://localhost:5501",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

conversation_history = []

@app.post("/chat")

def chat(request: ChatRequest):

    messages = [
    {
        "role": "system",
        "content": "You are VEYRA, a helpful futuristic AI assistant. Answer clearly and concisely."
    }
    ]
    messages.extend(conversation_history)
    messages.append({
        "role": "user",
        "content": request.message
        })

    memory = get_memory()
    messages = [
        {
            "role": "system",
            "content": "You are VEYRA, a helpful futuristic AI assistant."
            }
        ]
    messages.extend(memory)

    messages.append({
        "role": "user",
        "content": request.message
        })
    reply = get_ai_response(messages)
    
    save_conversation(
    request.message,
    reply
    )

    conversation_history.append({
        "role": "user",
        "content": request.message
        })
    conversation_history.append({
        "role": "assistant",
        "content": reply
        })

    return {
        "reply": reply
        }

@app.post("/vision/detect")
async def vision_detect(frame: UploadFile = File(...)):
    image_bytes = await frame.read()

    import numpy as np
    import cv2

    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        return {"error": "Invalid image"}

    detections = detect_objects(image)

    return {
        "detections": detections
    }

@app.get("/")
def home():
    return {
        "status": "online",
        "assistant": "VEYRA"
    }

