import React, { useState } from 'react';
import { Target, MessageSquare, Map, AlertTriangle, ChevronRight, BookOpen, CheckCircle, BrainCircuit, Download } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

const DUMMY_REPORT = {
  title: "Senior Frontend Engineer",
  matchScore: 82,
  skillGaps: [
    { skill: "AWS Deployment Pipeline", severity: "Critical" },
    { skill: "Microservices Architecture", severity: "Moderate" },
    { skill: "GraphQL API Integration", severity: "Minor" },
    { skill: "System Design for high scale", severity: "Critical" }
  ],
  technicalQuestions: [
    {
      question: "Can you explain how you would design a rate limiter for a distributed system?",
      intention: "To test your knowledge of system design, concurrency handling, and caching strategies.",
      answer: "Start by discussing Token Bucket or Leaky Bucket algorithms. Explain how you would store tokens in Redis to handle distributed nodes. Mention the importance of sliding window logs for high accuracy if strict rate limiting is required, and discuss the trade-offs in memory versus precision."
    },
    {
      question: "How does React Fiber differ from the previous reconciliation algorithm?",
      intention: "Assess deep understanding of React's rendering engine and performance optimization.",
      answer: "Explain that Fiber uses a linked list traversal instead of a recursive stack. This allows the main thread to be yielded and rendering to be paused, aborted, or prioritized. Mention how this enables Concurrent Mode and smoother UI transitions."
    }
  ],
  behavioralQuestions: [
    {
      question: "Tell me about a time you strongly disagreed with a senior developer's technical decision.",
      intention: "Evaluate conflict resolution, communication skills, and ego management.",
      answer: "Use the STAR method. Focus on communication, bringing objective data/metrics to the discussion rather than opinions. Show that you can commit to the final team decision even if your idea wasn't chosen, prioritizing the project's success over personal preference."
    },
    {
      question: "Describe a project that failed and what you learned from it.",
      intention: "Check for accountability, resilience, and a growth mindset.",
      answer: "Be honest about the failure. Focus 20% of the answer on the issue and 80% on the root cause analysis and what processes you implemented to prevent it from happening again."
    }
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "React Advanced Concepts & Fiber Architecture",
      tasks: [
        "Read the official React documentation on Concurrent Mode.",
        "Build a small prototype using useTransition and useDeferredValue.",
        "Review common React performance pitfalls."
      ]
    },
    {
      day: 2,
      focus: "System Design & Caching",
      tasks: [
        "Study Token Bucket and Leaky Bucket algorithms.",
        "Implement a basic rate limiter in Node.js/Redis.",
        "Read articles on distributed caching strategies."
      ]
    },
    {
      day: 3,
      focus: "Behavioral Preparation (STAR Method)",
      tasks: [
        "Write down 3 comprehensive STAR stories.",
        "Practice delivering the stories out loud.",
        "Refine answers to focus more on 'Action' and 'Result'."
      ]
    }
  ]
};

const ScoreRing = ({ score }: { score: number }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let colorClass = "text-red-500";
  let glowClass = "drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]";
  if (score >= 85) {
    colorClass = "text-emerald-500";
    glowClass = "drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]";
  } else if (score >= 70) {
    colorClass = "text-orange-500";
    glowClass = "drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]";
  }

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Circle */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-zinc-800"
        />
        {/* Progress Circle */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClass} ${glowClass} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-zinc-100 tracking-tight">{score}<span className="text-xl text-zinc-500">%</span></span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium mt-1">Match</span>
      </div>
    </div>
  );
};

export const ReportDetails = () => {
  const [activeTab, setActiveTab] = useState<'technical' | 'behavioral' | 'roadmap'>('technical');
  // Temporary state to show the unauthenticated view
  const [isUnauthenticated, setIsUnauthenticated] = useState(true);

  return (
    <>
    <div className={`h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-emerald-500/30 flex flex-col overflow-hidden transition-all duration-500 ${isUnauthenticated ? 'blur-[6px] pointer-events-none opacity-50' : ''}`}>
      
      {/* Header - Fixed Height */}
      <div className="shrink-0 max-w-7xl mx-auto w-full pt-8 pb-6 px-4 md:px-8 flex justify-between items-start gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 mb-4">
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Analysis Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-zinc-100 tracking-tight">
            Interview Strategy: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">{DUMMY_REPORT.title}</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            Based on our deep analysis of your profile and the target job requirements, we've formulated a custom preparation roadmap to maximize your success rate.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all duration-200 text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 shrink-0 mt-4 md:mt-0">
          <Download className="w-4 h-4" />
          Generate PDF
        </button>
      </div>

      {/* Main Content Area - Fills remaining height */}
      <div className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-4 md:px-8 pb-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: SECTIONS (25%) */}
        <div className="lg:w-[280px] shrink-0 h-full">
          <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-5 shadow-2xl h-full flex flex-col">
            <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-5 px-2 shrink-0">
              Action Plan
            </h2>
            <nav className="flex flex-col gap-2 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a transparent' }}>
              <button 
                onClick={() => setActiveTab('technical')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'technical' ? 'bg-zinc-800/80 text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-zinc-700/50' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent'}`}
              >
                <Target className={`w-4 h-4 shrink-0 ${activeTab === 'technical' ? 'text-emerald-400' : ''}`} />
                Technical Questions
              </button>
              <button 
                onClick={() => setActiveTab('behavioral')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'behavioral' ? 'bg-zinc-800/80 text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-zinc-700/50' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent'}`}
              >
                <MessageSquare className={`w-4 h-4 shrink-0 ${activeTab === 'behavioral' ? 'text-emerald-400' : ''}`} />
                Behavioral Questions
              </button>
              <button 
                onClick={() => setActiveTab('roadmap')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'roadmap' ? 'bg-zinc-800/80 text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-zinc-700/50' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent'}`}
              >
                <Map className={`w-4 h-4 shrink-0 ${activeTab === 'roadmap' ? 'text-emerald-400' : ''}`} />
                Preparation Roadmap
              </button>
            </nav>
          </div>
        </div>

        {/* MIDDLE COLUMN: CONTENT (50%) - Scrollable */}
        <div className="flex-1 min-w-0 h-full">
          <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-6 md:p-8 shadow-2xl h-full overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
            
            {activeTab === 'technical' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-800/60">
                  <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">Technical Questions</h3>
                    <p className="text-sm text-zinc-500 mt-1">High-probability questions tailored to your tech stack.</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-6">
                  {DUMMY_REPORT.technicalQuestions.map((q, idx) => (
                    <div key={idx} className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-6 transition-all duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0 border border-zinc-700/50">
                          {idx + 1}
                        </div>
                        <h4 className="text-[15px] font-medium text-zinc-100 leading-relaxed pt-1">
                          {q.question}
                        </h4>
                      </div>
                      
                      <div className="ml-12 space-y-4">
                        <div className="flex items-start gap-3">
                          <BrainCircuit className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">Interviewer Intention</span>
                            <p className="text-sm text-zinc-400 leading-relaxed">{q.intention}</p>
                          </div>
                        </div>
                        
                        <div className="bg-[#09090b] rounded-lg p-4 border border-zinc-800/60 shadow-inner">
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">Ideal Answer Framework</span>
                          <p className="text-sm text-zinc-300 leading-relaxed">{q.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'behavioral' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-800/60">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">Behavioral Questions</h3>
                    <p className="text-sm text-zinc-500 mt-1">Master the STAR method with these realistic scenarios.</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-6">
                  {DUMMY_REPORT.behavioralQuestions.map((q, idx) => (
                    <div key={idx} className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-6 transition-all duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0 border border-zinc-700/50">
                          {idx + 1}
                        </div>
                        <h4 className="text-[15px] font-medium text-zinc-100 leading-relaxed pt-1">
                          {q.question}
                        </h4>
                      </div>
                      
                      <div className="ml-12 space-y-4">
                        <div className="flex items-start gap-3">
                          <Target className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">Interviewer Intention</span>
                            <p className="text-sm text-zinc-400 leading-relaxed">{q.intention}</p>
                          </div>
                        </div>
                        
                        <div className="bg-[#09090b] rounded-lg p-4 border border-zinc-800/60 shadow-inner">
                          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-2">How to Answer (STAR)</span>
                          <p className="text-sm text-zinc-300 leading-relaxed">{q.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-zinc-800/60">
                  <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Map className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">Preparation Roadmap</h3>
                    <p className="text-sm text-zinc-500 mt-1">Your step-by-step guide to interview readiness.</p>
                  </div>
                </div>
                
                <div className="relative pl-6 space-y-10">
                  {/* Timeline Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-zinc-800" />
                  
                  {DUMMY_REPORT.preparationPlan.map((plan, idx) => (
                    <div key={idx} className="relative pl-8">
                      {/* Timeline Node */}
                      <div className="absolute -left-[23px] top-1 w-6 h-6 rounded-full bg-[#121214] border-2 border-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)] z-10">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                      </div>
                      
                      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-purple-500/30 transition-colors">
                        <div className="flex items-baseline gap-3 mb-4 border-b border-zinc-800/60 pb-3">
                          <h4 className="text-lg font-bold text-zinc-100">Day {plan.day}</h4>
                          <span className="text-sm font-medium text-purple-400">{plan.focus}</span>
                        </div>
                        
                        <ul className="space-y-3">
                          {plan.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-3">
                              <CheckCircle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                              <span className="text-sm text-zinc-300 leading-relaxed">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: SCORE & GAPS (25%) */}
        <div className="lg:w-[320px] shrink-0 h-full overflow-y-auto pr-2 flex flex-col gap-6" style={{ scrollbarWidth: 'none' }}>
          
          {/* Match Score */}
          <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-8 shadow-2xl text-center flex flex-col items-center relative overflow-hidden shrink-0">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
            
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-8 z-10">Profile Match</h3>
            <div className="z-10">
              <ScoreRing score={DUMMY_REPORT.matchScore} />
            </div>
            <p className="text-xs text-zinc-500 mt-6 leading-relaxed z-10">
              Score calculated based on requirement overlap, technical depth, and experience alignment.
            </p>
          </div>

          {/* Skill Gaps */}
          <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-6 shadow-2xl shrink-0">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Critical Gaps
            </h3>
            <ul className="flex flex-col gap-4">
              {DUMMY_REPORT.skillGaps.map((gap, idx) => {
                let badgeColor = "";
                if (gap.severity === 'Critical') badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                else if (gap.severity === 'Moderate') badgeColor = "bg-orange-500/10 text-orange-400 border-orange-500/20";
                else badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

                return (
                  <li key={idx} className="flex flex-col gap-2 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-medium text-zinc-200">{gap.skill}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border shrink-0 ${badgeColor}`}>
                        {gap.severity}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

      </div>
    </div>
    
    {/* Unauthenticated View Modal overlay */}
    {isUnauthenticated && (
      <AuthModal 
        onClose={() => setIsUnauthenticated(false)}
        onSuccess={() => setIsUnauthenticated(false)}
      />
    )}
    </>
  );
};

export default ReportDetails;
