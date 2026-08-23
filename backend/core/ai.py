from dotenv import load_dotenv
import os
from groq import Groq

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def get_ai_response(messages):

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0.4,
        max_tokens=80,
        reasoning_effort="low"
    )

    print("AI RESPONSE OBJECT:", response)
    print("AI CONTENT:", repr(response.choices[0].message.content))

    return response.choices[0].message.content or ""