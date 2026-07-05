import React, { useState } from 'react';
import Navbar from '../../../components/shared/Navbar';
import { Database, Lock, Server, Activity, Cpu, Code, ShieldAlert, ArrowRight } from 'lucide-react';

const HoverCard = ({ title, description, details }: { title: string, description: string, details: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative p-6 border border-zinc-800 bg-[#121214] rounded-xl cursor-pointer overflow-hidden group transition-all duration-300 hover:border-emerald-500/50 min-h-[140px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`transition-all duration-300 ${isHovered ? '-translate-y-8 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        </div>
        <p className="text-sm text-zinc-400 flex items-center gap-2 mt-4">
          Hover to view <ArrowRight className="w-4 h-4" />
        </p>
      </div>
      <div className={`absolute inset-0 p-6 bg-[#121214] flex flex-col justify-center transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100 z-10' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <h3 className="text-lg font-semibold text-emerald-400 mb-2">{title}</h3>
        <p className="text-sm text-zinc-300">{description}</p>
        {details && <p className="text-xs text-zinc-500 mt-3 border-t border-zinc-800 pt-2">{details}</p>}
      </div>
    </div>
  );
};

export default function Docs() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-emerald-500/30">
      <Navbar />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 max-w-[1600px] mx-auto min-h-[calc(100vh-64px)]">
        {/* Left column - Black (Empty/Nav) */}
        <div className="hidden lg:block lg:col-span-3 bg-black border-r border-zinc-900 p-8 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
          <div className="mb-8 mt-12">
            <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-6">Contents</h2>
            <ul className="space-y-4 text-sm font-medium text-zinc-400">
              <li><a href="#overview" className="hover:text-zinc-100 transition-colors">1. Project Overview</a></li>
              <li><a href="#tech-stack" className="hover:text-zinc-100 transition-colors">2. Tech Stack</a></li>
              <li><a href="#workflows" className="hover:text-zinc-100 transition-colors">3. How It's Made</a></li>
              <li><a href="#database" className="hover:text-zinc-100 transition-colors">4. Database Structure</a></li>
              <li><a href="#frontend" className="hover:text-zinc-100 transition-colors">5. Frontend Details</a></li>
              <li><a href="#routes" className="hover:text-zinc-100 transition-colors">6. Backend API Routes</a></li>
              <li><a href="#backend" className="hover:text-zinc-100 transition-colors">7. Backend Details</a></li>
              <li><a href="#deployment" className="hover:text-zinc-100 transition-colors">8. Deployment Specifics</a></li>
            </ul>
          </div>
        </div>

        {/* Middle column - Content */}
        <div className="col-span-1 lg:col-span-6 bg-[#09090b] p-6 sm:p-8 md:p-12 lg:p-16 border-r border-zinc-900">
          <div className="max-w-3xl mx-auto space-y-20">
            
            {/* Header */}
            <header className="space-y-4 border-b border-zinc-800 pb-12 mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20 mb-2">
                <span>v1.0.0</span>
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                <span>Technical Specs</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">PrepVector</h1>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mt-4">
                Full technical and architectural documentation of the PrepVector AI resume & interview preparation ecosystem.
              </p>
            </header>

            {/* Section 1 */}
            <section id="overview" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-emerald-500">1.</span> Project Overview
              </h2>
              <div className="text-zinc-300 leading-relaxed space-y-4 text-base">
                <p>
                  PrepVector is an AI-powered platform that unifies professional resume building with realistic, 
                  voice-driven mock interview simulation. It analyzes a candidate's resume and target job description 
                  to generate tailored interview questions, evaluate spoken answers in real time, and produce a 
                  structured, multi-day preparation roadmap.
                </p>
                <p>
                  The platform focuses on closing the gap between "having a resume" and "being interview-ready" by 
                  combining AI-assisted content generation, structured resume parsing, and a conversational interview 
                  simulator into one seamless preparation flow.
                </p>
                
                <h3 className="text-lg font-semibold text-white mt-8 mb-2">Purpose</h3>
                <p>
                  PrepVector aims to give job seekers a personalized, end-to-end interview preparation experience — 
                  from building an ATS-friendly resume to practicing live, spoken mock interviews scored against 
                  real evaluation criteria.
                </p>

                <h3 className="text-lg font-semibold text-white mt-8 mb-2">Core Functionalities</h3>
                <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
                  <li>AI-assisted resume builder that enhances summaries, job descriptions, and project write-ups</li>
                  <li>Resume PDF parsing with structured data extraction</li>
                  <li>On-demand HTML-to-PDF resume generation via headless Chrome</li>
                  <li>Dynamic generation of role-specific technical and behavioral interview questions</li>
                  <li>Voice-driven mock interview simulator (speech-to-text + text-to-speech)</li>
                  <li>Post-interview scoring, feedback, and skill-gap analysis with a multi-day prep plan</li>
                  <li>Credit-based usage quota system to manage AI API consumption</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mt-8 mb-2">Target Users</h3>
                <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
                  <li>Job seekers preparing for technical or HR interviews</li>
                  <li>Professionals wanting AI-refined, ATS-friendly resumes</li>
                  <li>Candidates who want realistic, spoken interview practice rather than static text Q&A</li>
                </ul>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl mt-10">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Value Proposition</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    PrepVector goes beyond static resume templates and canned interview questions — it builds a 
                    conversational, AI-driven interview experience with a speaking avatar, real answer transcription, 
                    and rigorous structured scoring, all wrapped around a personalized, resume-aware prep pipeline.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="tech-stack" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
                <span className="text-emerald-500">2.</span> Tech Stack
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-5 border-b border-zinc-800 pb-3">Frontend Architecture</h3>
                  <dl className="space-y-4 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Framework</dt><dd className="font-medium text-zinc-200">React 19.2 (Vite + TS)</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Build Tool</dt><dd className="font-medium text-zinc-200">Vite</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Styling</dt><dd className="font-medium text-zinc-200 text-right">Tailwind 4.3 + shadcn/ui</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">State Mgt</dt><dd className="font-medium text-zinc-200">Zustand</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Data Fetching</dt><dd className="font-medium text-zinc-200 text-right">React Query 5 + Axios</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Routing</dt><dd className="font-medium text-zinc-200">React Router v8</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Forms</dt><dd className="font-medium text-zinc-200 text-right">Native components</dd></div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-5 border-b border-zinc-800 pb-3">Backend Architecture</h3>
                  <dl className="space-y-4 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Runtime</dt><dd className="font-medium text-zinc-200">Node.js (ESM)</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Framework</dt><dd className="font-medium text-zinc-200">Express 5</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Auth</dt><dd className="font-medium text-zinc-200 text-right">Custom JWT + DB Blacklist</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">Security</dt><dd className="font-medium text-zinc-200">bcrypt, CORS</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">File Uploads</dt><dd className="font-medium text-zinc-200 text-right">Multer + ImageKit</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">AI Logic</dt><dd className="font-medium text-zinc-200 text-right">LangChain (OpenRouter)</dd></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"><dt className="text-zinc-500">PDF Gen</dt><dd className="font-medium text-zinc-200 text-right">Puppeteer (headless Chrome)</dd></div>
                  </dl>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-5 border-b border-zinc-800 pb-3">Database & Infrastructure</h3>
                <dl className="space-y-4 text-sm max-w-xl">
                    <div className="flex justify-between"><dt className="text-zinc-500">Database</dt><dd className="font-medium text-zinc-200">MongoDB Atlas</dd></div>
                    <div className="flex justify-between"><dt className="text-zinc-500">ODM</dt><dd className="font-medium text-zinc-200">Mongoose</dd></div>
                    <div className="flex justify-between"><dt className="text-zinc-500">Pagination</dt><dd className="font-medium text-zinc-200 text-right">Not implemented — standard find().sort() queries</dd></div>
                    <div className="flex justify-between"><dt className="text-zinc-500">AI Provider</dt><dd className="font-medium text-zinc-200 text-right">OpenRouter (nemotron-3-ultra-550b, gemini-2.5-flash)</dd></div>
                </dl>
              </div>
            </section>

            {/* Section 3 - CENTERPIECE */}
            <section id="workflows" className="space-y-8 bg-zinc-900/30 -mx-6 sm:-mx-8 px-6 sm:px-8 py-14 border-y border-zinc-800 relative overflow-hidden scroll-mt-24">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
              
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 relative z-10 mb-8">
                <span className="text-emerald-500">3.</span> How It's Made (Architecture & Workflows)
              </h2>
              
              <div className="space-y-12 relative z-10">
                <div className="border-l-2 border-emerald-500 pl-6">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Cpu className="w-5 h-5 text-emerald-400" /> AI Interview Simulation Pipeline</h3>
                  <p className="text-[15px] text-zinc-300 leading-relaxed">
                    The simulator generates 7 progressively difficult questions from the candidate's resume, target 
                    role, and experience level. In the browser, questions are spoken aloud via the native 
                    <code className="mx-1.5 text-emerald-300 bg-emerald-950/50 px-1.5 py-0.5 rounded text-sm">SpeechSynthesisUtterance</code> API, and candidate responses are captured through <code className="mx-1.5 text-emerald-300 bg-emerald-950/50 px-1.5 py-0.5 rounded text-sm">react-speech-recognition</code>. 
                    Transcribed answers are sent to the backend, where an LLM pipeline scores each response out of 10 
                    across Correctness, Communication, and Confidence, before aggregating a final interview score.
                  </p>
                </div>

                <div className="border-l-2 border-emerald-500 pl-6">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Code className="w-5 h-5 text-emerald-400" /> Structured AI Output with Fallback Recovery</h3>
                  <p className="text-[15px] text-zinc-300 leading-relaxed">
                    For complex generated reports (skill-gap analyses, multi-day prep plans), the backend uses 
                    LangChain's <code className="mx-1.5 text-emerald-300 bg-emerald-950/50 px-1.5 py-0.5 rounded text-sm">StructuredOutputParser.fromZodSchema</code> to force valid JSON output from the LLM. When 
                    the model still wraps output in markdown fences, a regex-based extraction fallback strips the 
                    fences and recovers the payload — preventing a single malformed generation from crashing the request.
                  </p>
                </div>

                <div className="border-l-2 border-emerald-500 pl-6">
                  <h3 className="text-xl font-semibold text-white mb-3">HTML-to-PDF Resume Generation</h3>
                  <p className="text-[15px] text-zinc-300 leading-relaxed">
                    Rather than assembling PDFs programmatically with a layout library, PrepVector prompts the LLM to 
                    generate a complete, styled HTML document from the candidate's structured data. That HTML is then 
                    injected into a headless Puppeteer instance, which renders and captures an A4 PDF buffer to return 
                    to the user — trading deterministic layout control for AI-driven styling flexibility.
                  </p>
                </div>

                <div className="border-l-2 border-emerald-500 pl-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Credit-Based Usage Quotas</h3>
                  <p className="text-[15px] text-zinc-300 leading-relaxed">
                    To contain AI API costs, a credit system lives directly on the User model: generating a set of 
                    interview questions deducts 50 credits, and comprehensive report generation is capped at 20 free 
                    attempts per user — a simple, DB-enforced throttle rather than a network-level rate limiter.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="database" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-emerald-500">4.</span> Database Structure
              </h2>
              <p className="text-sm text-zinc-400 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                Hover over each collection card to reveal the structured properties (all password references and 
                sensitive data keys are strictly hidden for complete privacy).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
                <HoverCard 
                  title="User" 
                  description="Stores identity and auth data, AI usage credits, and report-generation counters."
                  details="username, email, password(hidden), credits, reportGenerationCount"
                />
                <HoverCard 
                  title="InterviewAgent" 
                  description="Represents a live or completed mock interview — generated questions, time limits, candidate answers, and per-question scores. References User."
                  details="userId, role, experience, mode, resumeText, question[], finalScore, status"
                />
                <HoverCard 
                  title="InterviewReport" 
                  description="Comprehensive candidate-vs-job-description match report — technical/behavioral question sets, skill gaps, and a multi-day preparation plan."
                  details="jobDescription, resume, selfDescription, matchScore, technicalQuestions[], behavioralQuestions[], skillGaps[], preparationPlan[]"
                />
                <HoverCard 
                  title="Resume" 
                  description="Structured resume data parsed from an uploaded PDF — summary, experience, education, projects, and template/styling parameters."
                  details="userId, title, template, accent_color, skills, professional_info, experience[], project[], education[]"
                />
                <HoverCard 
                  title="BlacklistToken" 
                  description="Stores invalidated JWTs to securely enforce logout across sessions."
                  details="token"
                />
              </div>
            </section>

            {/* Section 5 */}
            <section id="frontend" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-emerald-500">5.</span> Frontend Details
              </h2>
              <div className="text-zinc-300 text-[15px] leading-relaxed space-y-4">
                <p>
                  The client is a Vite + TypeScript React SPA routed via <code className="text-emerald-300 bg-emerald-950/50 px-1.5 py-0.5 rounded text-sm mx-1">createBrowserRouter</code>, split into a public 
                  landing space and a protected <code className="text-emerald-300 bg-emerald-950/50 px-1.5 py-0.5 rounded text-sm mx-1">/app</code> layout housing the Dashboard, Resume Builder, and Interview 
                  modules.
                </p>
                <p>
                  Global state is kept intentionally minimal — Zustand handles auth state and toast notifications, 
                  while most interactive complexity lives in local component state. The standout UI flow is the 
                  interview simulator itself: a multi-stage wizard orchestrating countdown timers, native browser 
                  TTS/STT hooks, sequential AI interaction states (Intro → Q&A → Submit), and an animated avatar 
                  whose pulse animation syncs to the AI's speaking state.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="routes" className="space-y-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-emerald-500">6.</span> Backend API Routes
              </h2>
              <p className="text-[15px] text-zinc-400">Below is the comprehensive catalog of secure backend routing endpoints under <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm">/api/v1/</code>:</p>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-[15px] font-bold text-zinc-100 mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2"><Lock className="w-4 h-4 text-emerald-400"/> Authentication & Users — /api/v1/user</h3>
                  <div className="overflow-x-auto border border-zinc-800 rounded-xl shadow-lg bg-[#0c0c0e]">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[11px] tracking-wider font-semibold">
                        <tr><th className="px-5 py-4 w-24">Method</th><th className="px-5 py-4 w-64">Endpoint Path</th><th className="px-5 py-4 w-24">Auth</th><th className="px-5 py-4">Operation Description</th></tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/register</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-semibold">No</span></td><td className="px-5 py-3.5">Register a new user account</td></tr>
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/login</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-semibold">No</span></td><td className="px-5 py-3.5">Authenticate user and issue JWT</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-[15px] font-bold text-zinc-100 mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2"><Server className="w-4 h-4 text-emerald-400"/> AI-Assisted Resume Tools — /api/v1/ai</h3>
                  <div className="overflow-x-auto border border-zinc-800 rounded-xl shadow-lg bg-[#0c0c0e]">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[11px] tracking-wider font-semibold">
                        <tr><th className="px-5 py-4 w-24">Method</th><th className="px-5 py-4 w-64">Endpoint Path</th><th className="px-5 py-4 w-24">Auth</th><th className="px-5 py-4">Operation Description</th></tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/enhance-pro-sum</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">LLM-enhance a professional summary</td></tr>
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/enhance-job-desc</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">LLM-condense and enhance a job description</td></tr>
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/enhance-project-desc</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">LLM-refine a project description for ATS friendliness</td></tr>
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/upload-resume</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">Upload PDF, parse text, extract structured resume JSON</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-[15px] font-bold text-zinc-100 mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2"><Activity className="w-4 h-4 text-emerald-400"/> Mock Interviews — /api/v1/interview</h3>
                  <div className="overflow-x-auto border border-zinc-800 rounded-xl shadow-lg bg-[#0c0c0e]">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[11px] tracking-wider font-semibold">
                        <tr><th className="px-5 py-4 w-24">Method</th><th className="px-5 py-4 w-64">Endpoint Path</th><th className="px-5 py-4 w-24">Auth</th><th className="px-5 py-4">Operation Description</th></tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/analyze-resume</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">Analyze resume text for role/skill matching</td></tr>
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/generate-questions</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">Generate 7 tailored interview questions (costs 50 credits)</td></tr>
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/submit-answer</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">Evaluate a candidate's answer and return scores/feedback</td></tr>
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">POST</td><td className="px-5 py-3.5 font-mono">/finish-interview</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">Aggregate and finalize the overall interview score</td></tr>
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-blue-400 font-bold">GET</td><td className="px-5 py-3.5 font-mono">/get-interview</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">Fetch a user's interview history</td></tr>
                        <tr className="hover:bg-zinc-800/20 transition-colors"><td className="px-5 py-3.5 font-mono text-blue-400 font-bold">GET</td><td className="px-5 py-3.5 font-mono">/report/:id</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">Yes</span></td><td className="px-5 py-3.5">Retrieve full Q&A detail for a specific interview</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-zinc-500 mt-4 italic bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">Note: Additional standard CRUD routes exist for user settings and resume management under their respective router files.</p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="backend" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-emerald-500">7.</span> Backend Details
              </h2>
              <div className="text-zinc-300 text-[15px] leading-relaxed">
                <p>
                  The server runs a versioned REST API pattern with modular controllers. Media staging, credential 
                  validation, and AI-output parsing are each handled by dedicated layers.
                </p>

                <h3 className="text-lg font-semibold text-white mt-8 mb-4">Global Middleware Pipeline</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 bg-[#121214] p-4 rounded-xl border border-zinc-800/80">
                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <div>
                      <strong className="text-zinc-200 block mb-1">verifyJWT (Auth Guard)</strong> 
                      <span className="text-sm text-zinc-400">Validates Bearer token or cookie, checks against a DB-backed BlacklistToken collection, and attaches the user document to the request.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 bg-[#121214] p-4 rounded-xl border border-zinc-800/80">
                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <div>
                      <strong className="text-zinc-200 block mb-1">errorHandler</strong> 
                      <span className="text-sm text-zinc-400">Global catch-all for uniformly formatting 500-level errors.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 bg-[#121214] p-4 rounded-xl border border-zinc-800/80">
                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <div>
                      <strong className="text-zinc-200 block mb-1">Multer Upload Guard</strong> 
                      <span className="text-sm text-zinc-400">Validates MIME types for PDFs/images and enforces in-memory size limits.</span>
                    </div>
                  </li>
                </ul>

                <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-6 mt-10">
                  <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-4"><ShieldAlert className="w-5 h-5"/> Known Security Gaps</h3>
                  <ul className="list-disc pl-5 space-y-3 marker:text-red-500/50 text-red-300/80 text-sm">
                    <li><strong>No network-level rate limiting</strong> (e.g. <code className="bg-red-950/50 px-1 py-0.5 rounded text-red-400/90 text-xs">express-rate-limit</code>) — credit quotas exist at the application layer, but the server itself has no brute-force/DoS protection.</li>
                    <li><strong>No request-body validation middleware</strong> — Zod is used only to structure AI output, not to validate incoming API requests.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="deployment" className="space-y-6 pb-20 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-emerald-500">8.</span> Deployment Specifics
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-[#121214] p-6 rounded-xl border border-zinc-800 shadow-lg">
                  <h3 className="font-semibold text-emerald-400 mb-4 border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Frontend
                  </h3>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1">Build Command</strong> <code className="text-xs bg-zinc-900 border border-zinc-800 px-2 py-1 rounded block w-max">tsc -b && vite build</code></li>
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 mt-3">Output Dir</strong> <code className="text-xs text-zinc-300">dist/</code></li>
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 mt-3">Env Config</strong> <span className="text-xs">Standard Vite environment variables for API connectivity</span></li>
                  </ul>
                </div>
                
                <div className="bg-[#121214] p-6 rounded-xl border border-zinc-800 shadow-lg">
                  <h3 className="font-semibold text-emerald-400 mb-4 border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Backend
                  </h3>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1">Live URL</strong> <code className="text-[11px] text-emerald-400 font-semibold break-all bg-emerald-950/20 px-1.5 py-0.5 rounded">https://prepvector.onrender.com</code></li>
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 mt-3">Health Check</strong> <code className="text-[11px] bg-zinc-900 border border-zinc-800 px-2 py-1 rounded block w-max text-zinc-300">GET /health</code></li>
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 mt-3">Cold Start (Render)</strong> <span className="text-xs leading-relaxed inline-block text-zinc-400">Server spins down when idle. Initial wake-up takes ~50s. Handled by global loaders in frontend.</span></li>
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 mt-3">Requirements</strong> <span className="text-xs">Live MongoDB, OpenRouter API key, <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-400">FRONTEND_URL</code> config</span></li>
                  </ul>
                </div>

                <div className="bg-[#121214] p-6 rounded-xl border border-zinc-800 shadow-lg sm:col-span-2 lg:col-span-1">
                  <h3 className="font-semibold text-emerald-400 mb-4 border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> AI Service
                  </h3>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1">Provider</strong> <span className="text-xs">OpenRouter</span></li>
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 mt-3">Default Models</strong> <code className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-1 rounded block mt-1 w-max">nvidia/nemotron-3-ultra-550b-a55b:free</code><code className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-1 rounded block mt-1.5 w-max">google/gemini-2.5-flash</code></li>
                    <li><strong className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1 mt-3">Cost Control</strong> <span className="text-xs leading-relaxed inline-block">Application-level credit deduction (50 credits/query), relies on OpenRouter's free tier/billing.</span></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="techstack" className="space-y-6 pb-20 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-emerald-500">9.</span> Tech Stack & Packages
              </h2>
              <p className="text-sm text-zinc-400 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                Core technologies and libraries powering the PrepVector ecosystem.
              </p>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-emerald-500/30 rounded-md text-xs font-semibold text-emerald-400 shadow-sm">React 19</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-emerald-500/30 rounded-md text-xs font-semibold text-emerald-400 shadow-sm">Vite</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-emerald-500/30 rounded-md text-xs font-semibold text-emerald-400 shadow-sm">TypeScript</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-emerald-500/30 rounded-md text-xs font-semibold text-emerald-400 shadow-sm">Tailwind CSS 4</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-emerald-500/30 rounded-md text-xs font-semibold text-emerald-400 shadow-sm">Zustand</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-emerald-500/30 rounded-md text-xs font-semibold text-emerald-400 shadow-sm">Express 5</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-emerald-500/30 rounded-md text-xs font-semibold text-emerald-400 shadow-sm">MongoDB</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-emerald-500/30 rounded-md text-xs font-semibold text-emerald-400 shadow-sm">Mongoose</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">Helmet</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">Shadcn UI</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">Lucide React</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">React Router 8</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">Axios</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">Zod</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">LangChain</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">pdf-parse</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">jsPDF</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">html2canvas</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">JSONWebToken</span>
                <span className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors">Bcrypt</span>
              </div>
            </section>

          </div>
        </div>

        {/* Right column - Black (Empty/Misc) */}
        <div className="hidden lg:block lg:col-span-3 bg-black border-l border-zinc-900 p-8 sticky top-[64px] h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <div className="w-32 h-32 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-950 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent)]"></div>
                <Code className="w-10 h-10 text-zinc-600" />
            </div>
            <p className="text-xs text-zinc-500 text-center font-medium">PrepVector Ecosystem Documentation <br/>© 2026</p>
            <p className="text-[10px] text-zinc-600 text-center mt-2 uppercase tracking-widest">Minimalist theme configured</p>
          </div>
        </div>
      </div>
    </div>
  );
}
