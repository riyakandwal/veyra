from supabase import create_client
from dotenv import load_dotenv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)


def get_memory():
    result = (
        supabase
        .table("conversations")
        .select("role, content")
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )

    return list(reversed(result.data))


def save_conversation(user_message, assistant_reply):
    supabase.table("conversations").insert([
        {
            "role": "user",
            "content": user_message
        },
        {
            "role": "assistant",
            "content": assistant_reply
        }
    ]).execute()