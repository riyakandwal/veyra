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

    messages = [
        {
            "role": "system",
            "content": (
                "You are VEYRA, a helpful futuristic AI assistant. "
                "Use the previous conversation memory when relevant. "
                "If the user asks whether you remember something, "
                "use the conversation history to answer."
            )
        }
    ]

    messages.extend(memory)

    user_message = request.message

    if request.vision:
        user_message = f"""
        User message:
        {request.message}

        Current vision:
        {request.vision}"""

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

