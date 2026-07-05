# 🎬 PrepVector

<div align="center">

**An AI-powered platform for professional resume building and interactive mock interviews.**

<br />

[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)](https://prepvector.onrender.com)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel)](https://prepvector.vercel.app)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![AI Provider](https://img.shields.io/badge/AI-OpenRouter-3448C5?style=flat-square)](https://openrouter.ai)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-ESM-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)

</div>

---

## 📖 Project Overview

**PrepVector** is a full-stack, AI-driven platform that unifies professional resume building with realistic, voice-driven mock interview simulation. It analyzes a candidate's resume and target job description to generate tailored interview questions, evaluates spoken answers in real time, and produces a structured, multi-day preparation roadmap.

The platform focuses on closing the gap between "having a resume" and "being interview-ready" by combining AI-assisted content generation, structured resume parsing, and a conversational interview simulator into one seamless preparation flow.

**Target users:** Job seekers entering the tech industry, professionals looking to tailor their resumes, and candidates needing realistic, spoken interview practice without a human partner.

**What makes PrepVector unique?**
- **Interactive Voice Simulator:** Instead of text forms, interviews use native browser Web Speech APIs (`SpeechSynthesisUtterance` and `react-speech-recognition`) to simulate a real conversation with an AI avatar.
- **Strict Structured AI Output:** Utilizes LangChain and Zod to force LLMs to output complex nested JSON (scorecards, skill gaps) with robust regex fallbacks.
- **HTML-to-PDF Resumes:** Generates highly stylized, ATS-friendly resumes by prompting the LLM for HTML and rendering it via headless Puppeteer.
- **Cross-Domain Hybrid Auth:** Overcomes strict third-party cookie blocking (ITP) between Vercel and Render using a custom Hybrid Token Architecture.

---

## 🌐 Live Links

| Service | URL |
|---------|-----|
| 🖥️ Frontend (Vercel) | https://prepvector.vercel.app |
| ⚙️ Backend API (Render) | https://prepvector.onrender.com |
| 📊 API Health Check | https://prepvector.onrender.com/health |

---

## 🛠️ Complete Tech Stack

### Backend (`server/package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | `^5.2.1` | Web framework (ESM) |
| `mongoose` | `^9.6.3` | MongoDB ODM |
| `jsonwebtoken` | `^9.0.3` | JWT access & blacklist validation |
| `bcrypt` | `^6.0.0` | Password hashing (12 salt rounds) |
| `langchain` / `@langchain/openai` | `^1.4.4` | LLM orchestration and structured output parsing |
| `puppeteer` | `^25.1.0` | Headless Chrome for HTML-to-PDF generation |
| `pdf-parse` | `^2.4.5` | Extracting raw text from uploaded resumes |
| `@imagekit/nodejs` | `^7.7.0` | Image hosting |
| `multer` | `^2.1.1` | Multipart file upload handling (memory and disk storage) |
| `cors` | `^2.8.6` | Cross-Origin Resource Sharing |
| `cookie-parser` | `^1.4.7` | HTTP cookie parsing |
| `helmet` | `^8.2.0` | HTTP security headers |
| `zod` | `^4.4.3` | Schema validation for structured AI outputs |
| `dotenv` | `^17.4.2` | Environment variable loading |

**Backend Runtime:** Node.js with **ESM** (`"type": "module"`)

---

### Frontend (`frontend/package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | `^19.2.7` | UI library |
| `react-router-dom` | `^8.0.1` | Client-side routing |
| `axios` | `^1.18.1` | HTTP client (with interceptors for Hybrid Auth) |
| `@tanstack/react-query` | `^5.101.1` | Server state management & caching |
| `tailwindcss` | `^4.3.1` | Utility-first CSS (v4) |
| `zustand` | `^5.0.14` | Global state (Auth, Toasts) |
| `react-speech-recognition` | `^4.0.1` | Web Speech API wrapper for STT |
| `recharts` | `^3.9.1` | Analytics and scoring charts |
| `lucide-react` | `^1.21.0` | Icon library |
| `@lottiefiles/dotlottie-react`| `^0.19.5` | Animated UI elements (Avatar pulse) |
| `shadcn` | `^4.11.1` | UI component primitives |
| **devDependencies** | | |
| `vite` | `^8.1.0` | Build tool & dev server |
| `typescript` | `~6.0.2` | TypeScript |

---

## 🗂️ Project Structure

```
PrepVector/
├── server/
│   ├── src/
│   │   ├── server.js              # Entry point + DB Connection
│   │   ├── app.js                 # Express app, CORS, Middleware
│   │   ├── controllers/
│   │   │   ├── user.controllers.js     # Auth & usage limits
│   │   │   ├── ai.controllers.js       # Resume parsing & enhancement
│   │   │   ├── interview.controllers.js# Mock interview flow
│   │   │   └── resume.controllers.js   # Resume CRUD
│   │   ├── models/
│   │   │   ├── user.models.js          # Identity & Credits
│   │   │   ├── blacklist.models.js     # Secure logout
│   │   │   ├── interviewAgent.models.js# Live interview session state
│   │   │   ├── interviewReport.models.js# Post-interview analytics
│   │   │   └── resume.models.js        # Structured resume data
│   │   ├── routes/
│   │   │   ├── user.routes.js
│   │   │   ├── ai.routes.js
│   │   │   ├── interview.routes.js
│   │   │   └── resume.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js      # verifyJWT (Hybrid Auth check)
│   │   │   ├── error.middleware.js     # Global error handler
│   │   │   └── multer.middleware.js    # Memory & Disk storage wrappers
│   │   ├── services/
│   │   │   └── ai.services.js          # LangChain pipelines & Puppeteer PDF gen
│   │   └── db/
│   │       └── index.js                # MongoDB connection
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx               # React app entry point
│   │   ├── App.tsx                # Root component (Auth Provider)
│   │   ├── index.css              # Global styles + Tailwind
│   │   ├── features/              # Feature-based folder structure
│   │   │   ├── auth/              # useAuth hook, API, and Modals
│   │   │   ├── dashboard/         # User analytics
│   │   │   ├── docs/              # In-app Documentation (Docs.tsx)
│   │   │   ├── evaluator/         # Home page & Landing
│   │   │   ├── interview/         # Live Interview Simulator (STT/TTS)
│   │   │   └── ResumeBuilder/     # HTML-based resume editor
│   │   ├── store/                 # Zustand stores (useAuth, toastStore)
│   │   ├── components/
│   │   │   ├── shared/            # Navbar, Loader, Footer
│   │   │   └── ui/                # shadcn primitives
│   │   └── app.routes.tsx         # React Router v8 config
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Structure

### User Model

```javascript
{
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  credits:  { type: Number, default: 100 },   // AI Usage Quota (e.g. 50/interview)
  reportGenerationCount: { type: Number, default: 0 },
}
// timestamps: true
```

### InterviewAgent Model (Live Session)

```javascript
{
  userId:      { type: ObjectId, ref: "User", required: true },
  role:        { type: String, required: true },
  experience:  { type: String, required: true },
  mode:        { type: String, required: true },
  resumeText:  { type: String, required: true },
  question:    [{ 
    questionText: String, 
    answerText: String, 
    feedback: String, 
    score: Number 
  }],
  finalScore:  { type: Number, default: 0 },
  status:      { type: String, enum: ["pending", "completed"], default: "pending" },
}
// timestamps: true
```

### InterviewReport Model (Post-Analysis)

```javascript
{
  userId:             { type: ObjectId, ref: "User", required: true },
  jobDescription:     { type: String, required: true },
  resume:             { type: String, required: true },
  matchScore:         { type: Number, required: true },
  technicalQuestions: [{ question: String, context: String, expectedAnswer: String }],
  behavioralQuestions:[{ question: String, context: String, expectedAnswer: String }],
  skillGaps:          [{ skill: String, importance: String, resources: [String] }],
  preparationPlan:    [{ day: Number, focus: String, tasks: [String] }],
}
// timestamps: true
```

### Resume Model

```javascript
{
  userId: { type: ObjectId, ref: "User", required: true },
  title:  { type: String, required: true },
  template: { type: String, default: "modern" },
  accent_color: { type: String, default: "#000000" },
  professional_info: { fullName, email, phone, linkedin, github, portfolio, summary },
  experience: [{ jobTitle, company, startDate, endDate, description }],
  project:    [{ title, techStack, url, description }],
  education:  [{ degree, institution, year }],
  skills:     [String],
}
// timestamps: true
```

### BlacklistToken Model

```javascript
{
  token: { type: String, required: true, unique: true }
}
// Used to securely invalidate JWTs on logout.
```

---

## 🔐 Authentication & Security

### Hybrid Token Architecture
Because PrepVector's frontend is hosted on Vercel and the backend on Render, standard `SameSite="None"` cookies are often blocked by browsers (Safari ITP, Chrome Incognito) as third-party cookies.

PrepVector solves this by using a **Hybrid Token Architecture**:
1. `POST /api/v1/user/login` sets a secure `httpOnly` cookie AND returns the JWT string in the JSON response body.
2. The frontend (via Zustand) stores the JWT in `localStorage`.
3. An Axios Interceptor (in `auth.api.ts`, `interview.api.ts`, etc.) automatically attaches the token as an `Authorization: Bearer <token>` header.
4. The backend `verifyJWT` middleware checks the Cookie first, and if missing, falls back to the Bearer header. 

This guarantees 100% auth persistence across all browsers despite cross-domain deployment.

### Security Notes

- **Password Security:** Hashes via Bcrypt (12 rounds).
- **Security Headers:** Implemented via `helmet()`.
- **CORS:** Explicitly whitelists `https://prepvector.vercel.app` and `localhost`.
- **File Parsing Security:** PDF uploads are buffered in RAM (`multer.memoryStorage()`) and discarded instantly after `pdf-parse` extracts the text strings. No user files are permanently stored on the server.

---

## 📡 Complete API Reference

**Base URL:** `https://prepvector.onrender.com`

### 🔑 Auth & Users (`/api/v1/user`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register new user account |
| `POST` | `/login` | ❌ | Authenticate user and issue JWT |
| `POST` | `/logout` | ✅ | Securely blacklist token and clear cookies |
| `GET` | `/get-me` | ✅ | Fetch active user state via Hybrid Token |

### 🤖 AI Resume Tools (`/api/v1/ai`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/upload-resume` | ✅ | Upload PDF, parse text, extract structured JSON |
| `POST` | `/enhance-pro-sum` | ✅ | LLM-enhance a professional summary |
| `POST` | `/enhance-job-desc` | ✅ | LLM-condense and enhance a job description |
| `POST` | `/enhance-project-desc`| ✅ | LLM-refine a project description for ATS friendliness |

### 🎙️ Mock Interviews (`/api/v1/interview`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/analyze-resume` | ✅ | Analyze resume text for role/skill matching |
| `POST` | `/generate-questions`| ✅ | Generate 7 tailored interview questions (Costs 50 Credits) |
| `POST` | `/submit-answer` | ✅ | Evaluate a candidate's answer and return scores/feedback |
| `POST` | `/finish-interview`| ✅ | Aggregate and finalize the overall interview score |
| `GET` | `/get-interview` | ✅ | Fetch a user's interview history |
| `GET` | `/report/:id` | ✅ | Retrieve full Q&A detail for a specific interview |
| `POST` | `/resume/pdf/:id` | ✅ | Trigger HTML-to-PDF generation for a report via Puppeteer |

---

## 🚀 Deployment Stack

### Backend — Render

| Property | Value |
|----------|-------|
| **Platform** | [Render](https://render.com) |
| **Service URL** | `https://prepvector.onrender.com` |
| **Runtime** | Node.js (ESM) |
| **Health Check** | `GET /health` |

### Frontend — Vercel

| Property | Value |
|----------|-------|
| **Platform** | [Vercel](https://vercel.com) |
| **App URL** | `https://prepvector.vercel.app` |
| **Build Command** | `vite build` *(TypeScript strict checks bypassed)* |
| **Framework Preset** | Vite |

### AI Infrastructure

| Property | Value |
|----------|-------|
| **Provider** | [OpenRouter](https://openrouter.ai) |
| **Primary Model** | `nvidia/nemotron-3-ultra-550b-a55b:free` |
| **Fallback Model** | `google/gemini-2.5-flash` |
| **Orchestration** | `@langchain/openai` |

---

## 🏗️ Architecture Deep Dive

### AI Interview Simulation Pipeline
The simulator acts as a real-time conversational agent. When an interview begins, it generates 7 progressively difficult questions from the candidate's resume and target role. In the browser, questions are spoken aloud via the native `SpeechSynthesisUtterance` API, and candidate responses are captured through `react-speech-recognition`. Transcribed answers are sent to the backend, where an LLM pipeline scores each response out of 10 across Correctness, Communication, and Confidence.

### Structured AI Output with Fallback Recovery
For complex generated reports (skill-gap analyses, multi-day prep plans), the backend uses LangChain's `StructuredOutputParser.fromZodSchema` to force valid JSON output from the LLM. If the model hallucinates markdown fences (e.g. \`\`\`json), a robust regex-based extraction fallback intercepts and recovers the payload, ensuring a single malformed generation doesn't crash the request.

### HTML-to-PDF Generation
Rather than assembling PDFs programmatically with a rigid layout library, PrepVector prompts the LLM to generate a complete, styled HTML document from the candidate's structured data. That HTML is then injected into a headless Puppeteer instance, which renders and captures an A4 PDF buffer to return to the user — trading deterministic layout control for AI-driven styling flexibility.

---

## ⚙️ Environment Variables

### Backend (`.env`)

```bash
PORT=8000
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://prepvector.vercel.app
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_key
```

### Frontend (`.env`)

```bash
VITE_API_BASE_URL=https://prepvector.onrender.com
```

---

## 📜 Scripts

### Backend (`server/package.json`)

```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

### Frontend (`frontend/package.json`)

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

---

## ⚠️ Known Limitations & Missing Features

- **No Network Rate Limiting:** While API usage quotas (Credits) exist on the User model, there is no network-level rate limiter (like `express-rate-limit`), exposing the server to DoS attacks.
- **Zod Validation Scope:** Zod is primarily used for structuring AI output responses rather than validating incoming API request bodies on standard CRUD routes.
- **Cold Starts:** Render's free tier spins down after inactivity. The initial wake-up takes ~50s. This is handled gracefully by a custom global `<Loader />` component on the frontend.
- **Puppeteer RAM Overhead:** The HTML-to-PDF feature spins up a headless Chromium instance, which may cause memory pressure on low-tier hosting environments during concurrent PDF requests.

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- OpenRouter API Key

### Backend Setup
```bash
cd server
npm install

# Create .env file with required variables
npm run dev
# Server runs on http://localhost:8000
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file:
# VITE_API_BASE_URL=http://localhost:8000

npm run dev
# App runs on http://localhost:5173
```

---

## 📄 License

ISC — see [package.json](server/package.json).

---
*PrepVector Ecosystem Documentation © 2026. Minimalist theme configured.*
