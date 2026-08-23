from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
import os
from supabase import create_client
from backend.core.ai import get_ai_response
from backend.memory.memory import get_memory, save_conversation

from fastapi import UploadFile, File


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
    vision: str | None = None

conversation_history = []

@app.post("/api/chat")
@app.post("/chat")
def chat(request: ChatRequest):

    memory = get_memory()
    print("MEMORY COUNT:", len(memory))

    messages = [
    {
        "role": "system",
        "content": (
            "You are VEYRA, a helpful futuristic AI assistant. "
            "Use the previous conversation memory when relevant. "
            "If the user asks whether you remember something, "
            "use the conversation history to answer. "

            "You have access to a live camera vision system. "
            "When a user message contains 'Current vision', "
            "that information comes from VEYRA's camera object detection "
            "system and should be treated as real-time visual context. "

            "Use the Current vision information to answer questions "
            "about what you can see. "
            "Do not claim that you have no visual sensors when Current vision "
            "information is provided. "
            "Only mention visual information when it is relevant to the "
            "user's request."
            "Vision information is temporary. "
            "Only use vision information when the user's current message "    
            "explicitly asks what you can see, what is in front of them, "
            "or asks about the current visual scene. "
            "Never mention or infer vision from previous conversation memory."
            "Keep responses concise and conversational. "
            "Usually answer in 1-3 sentences. "
            "Never invent visual details such as exact coordinates, distance, "
            "color, clothing, size, or position unless that information is "
            "explicitly provided by the Current vision data. "
            "If the vision data does not contain the requested detail, "
            "clearly say that the detail cannot be determined."
        )
    }
]

    messages.extend(memory)

    user_message = request.message

    vision_keywords = [
    "what can you see",
    "what do you see",
    "can you see",
    "what is in front of me",
    "what's in front of me",
    "what is around me",
    "what's around me",
    "describe what you see",
    "describe the scene",
    "who is in front of me",
    "what is this",
    "where is the person",
    "where is the object",
    "what colour is my dress",
    "what color is my dress",
    "what am i wearing",
    "what color am i wearing",
    ]

    is_vision_question = any(
    keyword in request.message.lower()
    for keyword in vision_keywords
    )

    if request.vision and is_vision_question:
        user_message = f"""
        User message:{request.message}
        Current vision:{request.vision}
        """

    messages.append({
    "role": "user",
    "content": user_message
    })



    reply = get_ai_response(messages)

    save_conversation(
        request.message,
        reply
    )

    return {
        "reply": reply
    }


@app.get("/")
def home():
    return {
        "status": "online",
        "assistant": "VEYRA"
    }

