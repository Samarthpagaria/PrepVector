# PrepVector: AI-Powered Interview Ecosystem

<div align="center">
  <p><strong>v1.0.0 | Technical Specs</strong></p>
  <p>Full technical and architectural documentation of the PrepVector AI resume & interview preparation ecosystem.</p>
</div>

---

## 1. Project Overview

**PrepVector** is an AI-powered platform that unifies professional resume building with realistic, voice-driven mock interview simulation. It analyzes a candidate's resume and target job description to generate tailored interview questions, evaluate spoken answers in real time, and produce a structured, multi-day preparation roadmap.

The platform focuses on closing the gap between "having a resume" and "being interview-ready" by combining AI-assisted content generation, structured resume parsing, and a conversational interview simulator into one seamless preparation flow.

### Purpose
PrepVector aims to give job seekers a personalized, end-to-end interview preparation experience — from building an ATS-friendly resume to practicing live, spoken mock interviews scored against real evaluation criteria.

### Core Functionalities
- AI-assisted resume builder (enhances summaries, job descriptions, and projects).
- Resume PDF parsing with structured data extraction.
- High-fidelity HTML-to-PDF resume generation (via Puppeteer).
- Live, voice-enabled mock interview simulator utilizing native browser Web Speech APIs.
- AI-driven scoring (Correctness, Communication, Confidence) and skill-gap analysis.

### Target Users
- Job seekers entering the tech industry or preparing for rigorous HR rounds.
- Professionals looking to tailor their resume to specific job descriptions.
- Candidates needing realistic, spoken interview practice without a human partner.

### Value Proposition
PrepVector eliminates the anxiety of interview prep by providing a private, AI-driven environment. It gives actionable, metric-based feedback on both written profiles and spoken communication, resulting in higher candidate confidence and success rates.

---

## 2. Tech Stack

### Frontend Architecture
- **Framework:** React 19 (SPA)
- **Build Tool:** Vite + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** Zustand (Auth/Toasts) + React Component State
- **Data Fetching:** TanStack React Query + Axios
- **Routing:** React Router v8
- **Audio & Media:** `react-speech-recognition` + Browser `SpeechSynthesisUtterance`

### Backend Architecture
- **Runtime:** Node.js (ES Modules)
- **Web Framework:** Express 5
- **Authentication:** Hybrid Token Architecture (JWT via `localStorage` + Cookies) to bypass cross-domain ITP blocking.
- **Security:** Helmet headers, Bcrypt password hashing, CORS explicit matching.
- **File Parsing:** Multer + `pdf-parse`
- **PDF Engine:** Headless Chrome (Puppeteer)
- **AI Integration:** LangChain (OpenRouter models: Nemotron/Gemini)

### Database & Infrastructure
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Frontend Host:** Vercel
- **Backend Host:** Render

---

## 3. How It’s Made (Architecture & Workflows)

### AI Interview Simulation Pipeline
The simulator generates 7 progressively difficult questions from the candidate's resume and target role. In the browser, questions are spoken aloud via the native `SpeechSynthesisUtterance` API, and candidate responses are captured through `react-speech-recognition`. Transcribed answers are sent to the backend, where an LLM pipeline scores each response out of 10 across Correctness, Communication, and Confidence.

### Structured AI Output with Fallback Recovery
For complex generated reports (skill-gap analyses, multi-day prep plans), the backend uses LangChain's `StructuredOutputParser.fromZodSchema` to force valid JSON output from the LLM. If the model hallucinates markdown fences (e.g. \`\`\`json), a robust regex-based extraction fallback intercepts and recovers the payload.

### Cross-Domain Hybrid Authentication
To combat strict third-party cookie blocking (Intelligent Tracking Prevention) between Vercel and Render, PrepVector implements a **Hybrid Token Architecture**. The backend returns the JWT in the JSON body, which the frontend securely stores in `localStorage` and attaches to every request via Axios interceptors as a `Bearer` token.

---

## 4. Database Structure

- **User:** Stores identity, hashed passwords, AI usage credits, and report-generation counters.
- **InterviewAgent:** Represents a mock interview session. Stores generated questions, time limits, candidate answers, and per-question scores.
- **InterviewReport:** Comprehensive candidate-vs-job match report. Contains technical/behavioral questions, skill gaps, and a multi-day preparation plan.
- **Resume:** Structured data parsed from an uploaded PDF — summary, experience, education, projects, and styling parameters.
- **BlacklistToken:** Stores invalidated JWT strings to securely enforce logout.

---

## 5. Backend API Routes

All secure backend endpoints are versioned under `/api/v1/`.

| Category | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | `/user/register` | Register new user account |
| **Auth** | POST | `/user/login` | Authenticate user and issue JWT |
| **Auth** | GET | `/user/logout` | Securely blacklist token |
| **AI Resume** | POST | `/ai/upload-resume` | Upload PDF, parse text, extract structured JSON |
| **AI Resume** | POST | `/ai/enhance-*` | Enhance job descriptions, summaries, or projects |
| **Interview** | POST | `/interview/generate-questions`| Generate 7 tailored interview questions |
| **Interview** | POST | `/interview/submit-answer` | Evaluate candidate answer and return feedback |
| **Interview** | GET | `/interview/report/:id` | Retrieve comprehensive Q&A detail for an interview |

---

## 6. Deployment Specifics

### Frontend (Vercel)
- **Live URL:** `https://prepvector.vercel.app`
- **Build Command:** `vite build` *(TypeScript strict checks bypassed for rapid deployment)*
- **Environment:** Requires `VITE_API_BASE_URL` pointing to the Render backend.

### Backend (Render)
- **Live URL:** `https://prepvector.onrender.com`
- **Health Check:** `GET /health`
- **Cold Starts:** Server spins down when idle. Initial wake-up takes ~50s. Handled gracefully by global frontend loaders.
- **Environment:** Requires MongoDB URI, OpenRouter API Key, and `FRONTEND_URL`.

---
*PrepVector Ecosystem Documentation © 2026. Minimalist theme configured.*
