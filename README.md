# Veyra — AI Vision & Voice Assistant

> An AI assistant that can listen, understand, see, remember, and respond.

Veyra is an AI-powered interactive assistant that combines **voice interaction, computer vision, conversational AI, and persistent memory** into a single system.

Instead of interacting with an AI only through text, Veyra allows users to communicate through **voice** while the system can also process visual information from the camera and maintain conversation history across interactions.

---

## ✨ What is Veyra?

Most AI assistants are either:

- text-based
- voice-based
- vision-based

Veyra brings these capabilities together.

A user can speak to Veyra, provide visual context through the camera, and receive an AI-generated response through text and voice.

The system also maintains **persistent conversational memory**, allowing Veyra to use previous interactions as context.

---

## 🧠 Core Capabilities

### 🎙️ Voice Interaction
Veyra accepts voice input from the browser and converts it into text for processing.

### 👁️ Computer Vision
The browser camera can detect objects and provide visual context to the AI system.

### 🤖 AI Reasoning
User queries and available context are sent to an LLM to generate a response.

### 🧠 Persistent Memory
Conversation history is stored in Supabase so previous interactions can be retrieved and used in future conversations.

### 🔊 Voice Response
The generated response can be converted back into speech for a more natural interaction.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │        USER          │
                    └──────────┬───────────┘
                               │
                    Voice / Text / Camera
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Browser Frontend   │
                    │                      │
                    │ Voice Input          │
                    │ Camera / Vision      │
                    │ Text Interface       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │    Vision   │ │   Memory    │ │     AI      │
        │   Context   │ │  Supabase   │ │    Groq     │
        └─────────────┘ └─────────────┘ └─────────────┘
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌──────────────────────┐
                    │    AI Response       │
                    └──────────┬───────────┘
                               │
                         Text + Voice
                               │
                               ▼
                    ┌──────────────────────┐
                    │        USER          │
                    └──────────────────────┘
