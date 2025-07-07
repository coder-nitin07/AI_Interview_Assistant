## Project: AI Interview Question Generator & Evaluator

# Objective
    - Build a GenAI-powered system that:
    - Generates thoughtful, role-specific interview questions.
    - Evaluates user answers with constructive feedback.
    - Mimics real interviewer behavior using Chain-of-Thought prompting, role simulation, and evaluation logic.

# Core Features
    1. Generate Interview Questions
        - Endpoint: POST /generate-questions
        - Input: Job role, experience level, optional topics (e.g., React, Node.js)
        - Output: 5 detailed questions + brief explanation of each

    2. Evaluate User Answers
        - Endpoint: POST /evaluate-answer
        - Input: Question + user’s answer
        - Output: Evaluation with:
        - Strengths
            - Weaknesses
            - Score (1–10)
            - Suggested improvements

    3. 3. (Optional Advanced) Feedback Loop
        - Let user retry the same question based on feedback
        - AI can track improvement and re-evaluate


# Tech Stack:
| Layer       | Tool                                   |
| ----------- | -------------------------------------- |
| 🧠 GenAI    | **Google Gemini Pro** (via API key)    |
| 💻 Backend  | Node.js + Express                      |
| 📄 Env Vars | `.env` for API keys                    |
| 📦 Package  | `axios` or `node-fetch` for HTTP calls |
| 🧪 Testing  | Postman or Swagger UI                  |
| (Optional)  | React (later) for frontend             |





# Project Folder Structure
genai-interview-assistant/
├── controllers/
│   ├── questionController.js
│   └── evaluationController.js
├── routes/
│   ├── questionRoutes.js
│   └── evaluationRoutes.js
├── utils/
│   └── geminiClient.js
├── .env
├── app.js
├── package.json
└── README.md


# Learning Goals
    - Master GenAI prompt design: System role + chain-of-thought
    - Simulate AI thinking like a human interviewer
    - Learn to use Google Gemini API via REST
    - Structure clean AI logic in backend (no frontend pressure)