 # ConceptForge AI

(Autonomous Knowledge Extractor & Quiz Builder)

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ef8a09d8-7681-4197-ac61-c1addec04fc0" /> <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/59bcab4c-a144-460f-9321-0ffb64e557fc" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2224bbd8-1414-47d7-9980-6ed1bd1cc7b4" /> <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/1ac91671-f26a-4d35-ba36-e48bc250b4f9" />

 
  
 Overview

ConceptForge AI is a fully autonomous, multi-agent AI system that transforms long educational text into:

📚 Structured concept hierarchies

🧠 Difficulty-ranked quizzes (Easy → Hard)

✅ Correct answers with expert explanations

❌ Reasoning for why other options are wrong

🔁 Self-validated outputs using an agentic feedback loop

Unlike traditional quiz generators, LearnForge does not rely on a single prompt.
It decomposes the learning task into multiple cognitive agents that reason, validate, and regenerate until high-quality output is achieved.

✨ Key Highlights

🤖 True Agentic Architecture (7 Agents)

🔁 Validator Agent with Regeneration Loop

🧩 Concept Dependency Hierarchies

🎓 Bloom’s Taxonomy-based Difficulty Ranking

📊 UI-ready Structured JSON Output

🔐 User Authentication & Learning History

📴 Offline-first, Cloud-compatible

🧠 Agentic Architecture

Input Educational Text
        │
        ▼

Chunk Generator Agent
        │
        ▼

Concept Extraction Agent
        │
        ▼

Hierarchy Generation Agent
        │
        ▼

Quiz Generator Agent
        │
        ▼

Validator / Critic Agent
   ┌───────────────┐
   │ If NOT valid  │───► Regenerate Quiz
   └───────────────┘
        │
        ▼

Answer Generator Agent
        │
        ▼

Expert Explanation Agent
        │
        ▼

Final Learning Package (JSON + UI)


🔁 Agentic Loop:
If quiz quality, difficulty logic, or concept alignment fails, the validator automatically regenerates questions until expected standards are met.

🧪 Why This Is Truly Agentic (Not Just LLM Output)

✔ Task decomposition into specialized agents

✔ Autonomous decision-making

✔ Self-criticism & correction

✔ Minimal human intervention

✔ Deterministic learning pipeline

“The system behaves like a digital instructor, not a text generator.”

🖥️ UI Walkthrough

1️⃣ Home / Landing Page

Clean dark UI

Clear value proposition

Entry points: Login / Register / Get Started

2️⃣ Authentication

Secure user registration

Enables learning history & progress tracking

3️⃣ Input Educational Text

Paste long text (articles, notes, textbooks)

Minimum validation checks

4️⃣ AI Processing

Real-time autonomous agent execution

Visual feedback while processing

5️⃣ Output

Concept hierarchy

Difficulty-ranked quizzes

Answer explanations

Instant feedback

📦 Example Output (Simplified)

{
  "concept_hierarchy": "Blockchain → Consensus → Proof of Work",
  "quiz": {
    "easy": ["Definitions"],
    "medium": ["Comparisons"],
    "hard": ["Trade-offs & analysis"]
  },
  "validation": {
    "difficulty_logic": "Verified",
    "concept_alignment": "Passed"
  }
}

🛠️ Tech Stack
Layer	Technology

LLM	Gemini-3-Flash-Preview

Backend	Node.js

Frontend	React (Dark UI)

Postgresql

Architecture	Sequential Multi-Agent Swarm

Auth	Email + Password
Storage	Database (for user history)
Output	Structured JSON

⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/varun-ai69/Agentic---AI-.git
cd Agentic---AI-


2️⃣ Install Dependencies
npm install


3️⃣ Environment Variables

Create a .env file:

GEMINI_API_KEY=your_api_key_here


4️⃣ Run the Project
npm run dev

🔮 Future Scope

📈 Personalized learning paths

🧾 Learning history & analytics dashboard

🌍 Multilingual content support

🏫 LMS integration (Moodle, Google Classroom)

🧠 Adaptive agents based on learner performance

🏆 Hackathon Context

Hackathon: Autonomous Hacks 26

Theme: Online Agentic Hackathon

Team: Secret Coders

This project directly satisfies:

Knowledge extraction

Hierarchical organization

Quiz generation

Difficulty ranking

Difficulty validation using agentic logic

📜 License

MIT License — free to use, modify, and distribute.

⭐ Final Note

If you like this project:

⭐ Star the repo

🧠 Fork & experiment

🤝 Contributions welcome

ConceptForge doesn’t generate quizzes.
It forges understanding. 🔥
