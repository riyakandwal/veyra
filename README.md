

````markdown
# Veyra — Multimodal AI Assistant

> An AI assistant that can listen, see, remember, and respond.

Veyra is a multimodal AI assistant designed to combine **voice interaction, computer vision, conversational AI, and persistent memory** into a single interactive system.

Instead of interacting with an AI only through text, Veyra allows users to communicate through voice, provides visual context through a camera, and maintains conversational history to create a more continuous interaction.

---

## ✨ Features

- 🎙️ **Voice Interaction** — Interact with Veyra using voice input.
- 👁️ **Computer Vision** — Detect objects through the browser camera.
- 🤖 **LLM-powered Responses** — Generate contextual responses using Groq-hosted LLMs.
- 🧠 **Persistent Memory** — Store and retrieve conversation history using Supabase.
- 🔊 **Voice Responses** — Convert generated responses into speech.
- 🌐 **Web-based Interface** — Interact with the assistant directly through the browser.
- ⚡ **FastAPI Backend** — Connects the frontend, AI, vision, and memory components.

---

## 🧠 What Makes Veyra Different?

Most beginner AI projects focus on a single capability such as a chatbot, object detection system, or voice assistant.

Veyra explores how these components can work together:

```text
                 ┌─────────────────┐
                 │      USER       │
                 └────────┬────────┘
                          │
              Voice / Text / Camera
                          │
                          ▼
                 ┌─────────────────┐
                 │    Frontend     │
                 │                 │
                 │ Voice Interface │
                 │ Camera / Vision │
                 │ Chat Interface  │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     FastAPI     │
                 │     Backend     │
                 └────────┬────────┘
                          │
           ┌──────────────┼──────────────┐
           │              │              │
           ▼              ▼              ▼
      ┌─────────┐    ┌──────────┐   ┌─────────┐
      │ Vision  │    │  Memory  │   │   LLM   │
      │         │    │ Supabase │   │  Groq   │
      └─────────┘    └──────────┘   └─────────┘
           │              │              │
           └──────────────┼──────────────┘
                          ▼
                 ┌─────────────────┐
                 │  AI Response    │
                 └────────┬────────┘
                          │
                     Text / Voice
                          │
                          ▼
                 ┌─────────────────┐
                 │      USER       │
                 └─────────────────┘
````

---

# 🏗️ System Architecture

Veyra is composed of four major layers:

### 1. User Interface

The browser provides:

* Voice input
* Text input
* Camera access
* Object detection
* Chat interface
* Text-to-speech output

### 2. FastAPI Backend

FastAPI acts as the central communication layer between the frontend and AI services.

It handles:

* User requests
* AI requests
* Memory retrieval
* Vision requests
* Response generation

### 3. AI Layer

Veyra uses a Groq-hosted Large Language Model to process user queries and contextual information.

The model receives relevant information such as:

```text
User Query
+
Conversation Context
+
Available Visual Context
```

and generates the final response.

### 4. Memory Layer

Supabase is used to persist conversation history.

This allows Veyra to retrieve previous interactions instead of treating every conversation as completely independent.

---

# 🔄 How Veyra Works

## Step 1 — User Interaction

The user can interact with Veyra through:

* Voice
* Text
* Camera

The browser captures the input.

---

## Step 2 — Voice Processing

When the user speaks, the browser captures the speech and converts it into text.

```text
User Speech
     ↓
Speech Recognition
     ↓
Text Query
```

The resulting query is sent to the backend.

---

## Step 3 — Vision Processing

Veyra can access the browser camera and perform object detection.

```text
Camera
   ↓
COCO-SSD
   ↓
Object Detection
   ↓
Detected Objects
   ↓
Visual Context
```

The detected information can then be used as additional context for the AI interaction.

---

## Step 4 — Memory Retrieval

Previous conversation history is stored in Supabase.

When a new query arrives, relevant conversation history can be retrieved and used as context.

```text
New Query
    ↓
Retrieve Conversation History
    ↓
Context
```

This allows Veyra to maintain continuity across interactions.

---

## Step 5 — LLM Processing

The backend combines the available information:

```text
User Query
     +
Conversation Context
     +
Visual Context
     ↓
    LLM
     ↓
Generated Response
```

The response is generated using a Groq-hosted LLM.

---

## Step 6 — Response

The generated response is returned to the frontend.

The user can receive the response as:

```text
Text
 +
Voice
```

creating a more natural interaction experience.

---

# 👁️ Computer Vision Pipeline

Veyra uses browser-based object detection for lightweight real-time vision.

```text
Camera
  ↓
COCO-SSD
  ↓
Object Detection
  ↓
Detected Objects
  ↓
Visual Context
  ↓
AI Interaction
```

This approach allows vision processing to happen directly within the browser without requiring a large server-side vision model.

---

# 🧠 Memory Architecture

Veyra uses Supabase to store conversation history.

Conceptually:

```text
User
 ↓
Query
 ↓
FastAPI
 ↓
Retrieve Previous Context
 ↓
LLM
 ↓
Response
 ↓
Store Conversation
```

Stored information can include:

```text
role
content
timestamp
```

The stored history can then be retrieved during future interactions.

---

# 🤖 AI Architecture

The AI layer is responsible for generating responses based on the available context.

```text
                 ┌──────────────────┐
                 │    User Query     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Context Builder  │
                 └────────┬─────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
        Conversation   Vision       User
          Memory       Context      Query
             │            │            │
             └────────────┼────────────┘
                          ▼
                 ┌──────────────────┐
                 │   Groq LLM       │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ AI Response      │
                 └──────────────────┘
```

---

# 🔌 API Flow

The frontend communicates with the FastAPI backend through API endpoints.

General flow:

```text
Frontend
   ↓
API Request
   ↓
FastAPI
   ↓
Processing
   ↓
AI / Memory / Vision
   ↓
API Response
   ↓
Frontend
```

Example endpoints:

```text
/api/chat
/api/vision/detect
```

---

# 🛠️ Tech Stack

## Programming

* Python
* JavaScript
* HTML
* CSS

## Backend

* FastAPI
* Uvicorn

## AI / ML

* Large Language Models
* Groq
* Computer Vision
* COCO-SSD

## Memory / Database

* Supabase

## Browser APIs

* Web Speech API
* MediaDevices / Camera API
* Browser Text-to-Speech

## Deployment

* Vercel

---

# 📁 Project Structure

```text
veyra/
│
├── main.py
├── ai.py
├── memory.py
├── vision.js
├── script.js
│
├── requirements.txt
├── .env.example
└── README.md
```

### File Responsibilities

| File               | Responsibility                                          |
| ------------------ | ------------------------------------------------------- |
| `main.py`          | FastAPI backend and API routing                         |
| `ai.py`            | LLM interaction and response generation                 |
| `memory.py`        | Supabase conversation memory                            |
| `vision.js`        | Camera and object detection                             |
| `script.js`        | Frontend interaction, voice input and API communication |
| `requirements.txt` | Python dependencies                                     |
| `.env.example`     | Environment variable template                           |

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/riyakandwal/veyra.git
cd veyra
```

---

## 2. Create a Virtual Environment

### macOS / Linux

```bash
python -m venv venv
source venv/bin/activate
```

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

Do not commit your `.env` file to GitHub.

---

## 5. Start the Backend

```bash
uvicorn main:app --reload
```

The FastAPI server will start locally.

---

# 🔐 Environment Variables

| Variable       | Description                 |
| -------------- | --------------------------- |
| `GROQ_API_KEY` | API key for Groq LLM access |
| `SUPABASE_URL` | Supabase project URL        |
| `SUPABASE_KEY` | Supabase API key            |

---

# 🎯 Design Goals

Veyra was built around a simple idea:

> **AI should feel less like a text box and more like an interactive system.**

The project explores how multiple AI capabilities can be combined:

```text
Voice
  +
Vision
  +
Memory
  +
LLM Reasoning
  =
Interactive AI Assistant
```

Rather than building a simple chatbot, Veyra focuses on understanding how the different components of an AI application communicate with one another.

---

# 🧩 Key Concepts Explored

Building Veyra provided hands-on experience with:

* Large Language Model integration
* Prompt and context construction
* Voice interfaces
* Speech recognition
* Text-to-speech
* Computer vision
* Object detection
* FastAPI
* REST API communication
* Persistent conversational memory
* Supabase
* Frontend-backend integration
* AI application architecture
* Multimodal interaction

---

# ⚠️ Current Limitations

Veyra is an experimental AI application and currently has several limitations:

* Object detection is limited by the capabilities of the browser-based vision model.
* Conversation memory is primarily based on stored conversation history.
* LLM responses can still contain hallucinations.
* Visual understanding is limited compared with dedicated multimodal foundation models.
* Voice recognition performance can vary depending on browser and microphone conditions.

---

# 🔮 Future Improvements

Potential improvements include:

### 🧠 Smarter Memory

Implement semantic memory retrieval instead of relying primarily on conversation history.

### 👁️ Advanced Vision

Replace lightweight browser detection with a stronger multimodal vision model.

### 🔍 Better Context Retrieval

Retrieve only the most relevant memories instead of sending large conversation histories.

### 🧩 Multimodal Reasoning

Allow the LLM to reason directly over images, text, and conversation context.

### 📊 Evaluation

Introduce evaluation metrics for:

* Response relevance
* Memory retrieval quality
* Hallucination rate
* Latency
* User interaction quality

### ⚡ Performance

Improve response latency and optimize communication between the frontend, backend, AI model, and database.

---

# 📈 Learning Outcomes

Through Veyra, I explored how an AI application moves beyond a single model and becomes a complete system.

The project helped me understand the importance of:

```text
Models
   ↓
APIs
   ↓
Context
   ↓
Memory
   ↓
Frontend
   ↓
User Interaction
```

The most important lesson was that building an AI application is not only about choosing a powerful model — it is also about designing the system around that model.

---

# 👩‍💻 Author

**Riya Kandwal**

AI/ML Engineer | Generative AI | Computer Vision | NLP

GitHub:
[https://github.com/riyakandwal](https://github.com/riyakandwal)

---

# ⭐ If You Like the Project

If you find Veyra interesting, consider giving the repository a ⭐.

Feedback and contributions are welcome.

```


