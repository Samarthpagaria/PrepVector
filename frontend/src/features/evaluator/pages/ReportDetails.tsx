import React, { useState, useEffect } from 'react';
import { Target, MessageSquare, Map, AlertTriangle, ChevronRight, BookOpen, CheckCircle, BrainCircuit, Download, Loader2, Star, Sparkles } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { useParams } from 'react-router';
import { useGetReportById, useGeneratePdf } from '../hooks/useEvaluator';
import { useAuthStore } from '../../../store/useAuth.store';
import ReactMarkdown from 'react-markdown';
import Loader from '../../../components/shared/Loader';

const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline ? (
          <div className="rounded-md overflow-hidden my-4 border border-zinc-800">
            <div className="bg-zinc-800/80 px-4 py-1.5 text-xs text-zinc-400 border-b border-zinc-700/50 font-mono flex items-center">
              {match?.[1] || 'code'}
            </div>
            <pre className="bg-[#09090b] p-4 overflow-x-auto text-sm text-zinc-300 font-mono" {...props}>
              <code>{children}</code>
            </pre>
          </div>
        ) : (
          <code className="bg-zinc-800/60 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
            {children}
          </code>
        );
      },
      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-sm text-zinc-300">{children}</p>,
      ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-sm text-zinc-300">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-sm text-zinc-300">{children}</ol>,
      li: ({ children }) => <li>{children}</li>,
    }}
  >
    {content}
  </ReactMarkdown>
);

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
  const { interviewId } = useParams();
  const user = useAuthStore((state) => state.user);
  
  const [activeTab, setActiveTab] = useState<'technical' | 'behavioral' | 'roadmap'>('technical');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { data: report, isLoading, isError, error } = useGetReportById(interviewId);
  const { mutate: generatePdf, isPending: isPdfPending } = useGeneratePdf();

  // Determine if user is unauthenticated
  const isUnauthenticated = !user;

  useEffect(() => {
    console.log(`[ReportDetails] Component mounted. Report ID: ${interviewId}`);
    console.log(`[ReportDetails] User Auth State:`, isUnauthenticated ? "GUEST" : "AUTHENTICATED");
  }, [interviewId, isUnauthenticated]);

  useEffect(() => {
    if (isUnauthenticated) {
      console.log("[ReportDetails] User is unauthenticated. Showing AuthModal for Lead Magnet flow.");
      setShowAuthModal(true);
    } else {
      console.log("[ReportDetails] User is authenticated. Hiding AuthModal (if open).");
      setShowAuthModal(false);
    }
  }, [isUnauthenticated]);

  if (!isUnauthenticated && isLoading) {
    console.log("[ReportDetails] Loading real report data from backend...");
    return (
       <div className="h-screen bg-[#09090b] flex items-center justify-center font-sans">
         <Loader text="Loading your strategy report..." />
       </div>
    );
  }

  if (!isUnauthenticated && isError) {
    console.error("[ReportDetails] Error fetching report. Check if 404/401.", error);
    return (
       <div className="h-screen bg-[#09090b] flex items-center justify-center font-sans">
         <div className="flex flex-col items-center gap-4 text-center">
           <AlertTriangle className="w-10 h-10 text-red-500" />
           <h2 className="text-xl font-bold text-zinc-100">Report Not Found</h2>
           <p className="text-zinc-400 text-sm">This report doesn't exist or you don't have access to it.</p>
         </div>
       </div>
    );
  }

  const displayReport = report || (isUnauthenticated ? { title: "Custom Role", matchScore: 0, skillGaps: [], technicalQuestions: [], behavioralQuestions: [], preparationPlan: [] } : null);
  
  if (!displayReport) {
    console.log("[ReportDetails] Warning: displayReport is null or undefined.");
    return null;
  }
  if (!isUnauthenticated && !isLoading) {
      console.log("[ReportDetails] Successfully loaded report:", displayReport);
  }

  const handleGeneratePdf = () => {
    console.log(`[ReportDetails] 'Generate PDF' clicked. Report ID: ${interviewId}`);
    if (interviewId && !isUnauthenticated) {
      generatePdf(interviewId);
    }
  };

  return (
    <>
    <div className={`min-h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-emerald-500/30 flex flex-col overflow-x-hidden transition-all duration-500 ${isUnauthenticated ? 'blur-[6px] pointer-events-none opacity-50' : ''}`}>
      
      {/* Header - Fixed Height */}
      <div className="shrink-0 max-w-[1600px] mx-auto w-full pt-6 pb-4 px-4 md:px-8 flex justify-between items-start gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20 mb-3">
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Analysis Complete
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-zinc-100 tracking-tight">
            Interview Strategy: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">{displayReport.title || "Custom Role"}</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            Based on our deep analysis of your profile and the target job requirements, we've formulated a custom preparation roadmap to maximize your success rate.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-end md:items-center gap-3 shrink-0 mt-2 md:mt-0">
          {user && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Star className="w-4 h-4 fill-emerald-400" />
              {20 - (user.reportGenerationCount || 0)} Reports Left
            </div>
          )}
          <button 
            onClick={handleGeneratePdf}
            disabled={isPdfPending || isUnauthenticated}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/70 hover:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-400 hover:text-emerald-300 rounded-lg font-semibold transition-all duration-300 text-sm shadow-[inset_0_1px_0_rgba(16,185,129,0.3),0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[inset_0_1px_0_rgba(16,185,129,0.5),0_0_25px_rgba(16,185,129,0.45)] active:scale-[0.98]"
          >
            {isPdfPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <Download className="w-4 h-4 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
            )}
            Download Tailored Resume
          </button>
        </div>
      </div>

      {/* Main Content Area - Fills remaining height */}
      <div className="flex-1 min-h-0 max-w-[1600px] mx-auto w-full px-4 md:px-8 pb-6 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: SECTIONS (25%) */}
        <div className="lg:w-fit shrink-0">
          <div className="bg-[#121214] border border-zinc-800/60 rounded-xl p-4 shadow-xl flex flex-col">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 px-2 shrink-0">
              Action Plan
            </h2>
            <nav className="flex flex-col gap-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a transparent' }}>
              <button 
                onClick={() => setActiveTab('technical')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${activeTab === 'technical' ? 'bg-zinc-800/80 text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-zinc-700/50' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent'}`}
              >
                <Target className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'technical' ? 'text-emerald-400' : ''}`} />
                Technical Questions
              </button>
              <button 
                onClick={() => setActiveTab('behavioral')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${activeTab === 'behavioral' ? 'bg-zinc-800/80 text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-zinc-700/50' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent'}`}
              >
                <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'behavioral' ? 'text-emerald-400' : ''}`} />
                Behavioral Questions
              </button>
              <button 
                onClick={() => setActiveTab('roadmap')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${activeTab === 'roadmap' ? 'bg-zinc-800/80 text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-zinc-700/50' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent'}`}
              >
                <Map className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'roadmap' ? 'text-emerald-400' : ''}`} />
                Preparation Roadmap
              </button>
            </nav>
          </div>
        </div>

        {/* MIDDLE COLUMN: CONTENT (50%) - Scrollable */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#121214] border border-zinc-800/60 rounded-xl p-5 md:p-6 shadow-xl h-full overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
            
            <div className={`animate-in fade-in duration-500 ${activeTab === 'technical' ? 'block' : 'hidden'}`}>
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-800/60">
                <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">Technical Questions</h3>
                  <p className="text-sm text-zinc-500 mt-1">High-probability questions tailored to your tech stack.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {displayReport.technicalQuestions?.map((q: any, idx: number) => (
                  <div key={idx} className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-5 transition-all duration-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[11px] font-bold text-zinc-400 shrink-0 border border-zinc-700/50">
                        {idx + 1}
                      </div>
                      <h4 className="text-sm font-medium text-zinc-100 leading-relaxed pt-0.5">
                        {q.question}
                      </h4>
                    </div>
                    
                    <div className="ml-12 space-y-4">
                      <div className="flex items-start gap-3">
                        <BrainCircuit className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">Interviewer Intention</span>
                          <p className="text-sm text-zinc-400 leading-relaxed">{q.intension || q.intention}</p>
                        </div>
                      </div>
                      
                      <div className="bg-[#09090b] rounded-lg p-4 border border-zinc-800/60 shadow-inner">
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">Ideal Answer Framework</span>
                        <MarkdownRenderer content={q.answer} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`animate-in fade-in duration-500 ${activeTab === 'behavioral' ? 'block' : 'hidden'}`}>
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-800/60">
                <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100 tracking-tight">Behavioral Questions</h3>
                  <p className="text-sm text-zinc-500 mt-1">Master the STAR method with these realistic scenarios.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {displayReport.behavioralQuestions?.map((q: any, idx: number) => (
                  <div key={idx} className="group bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-5 transition-all duration-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[11px] font-bold text-zinc-400 shrink-0 border border-zinc-700/50">
                        {idx + 1}
                      </div>
                      <h4 className="text-sm font-medium text-zinc-100 leading-relaxed pt-0.5">
                        {q.question}
                      </h4>
                    </div>
                    
                    <div className="ml-12 space-y-4">
                      <div className="flex items-start gap-3">
                        <Target className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">Interviewer Intention</span>
                          <p className="text-sm text-zinc-400 leading-relaxed">{q.intension || q.intention}</p>
                        </div>
                      </div>
                      
                      <div className="bg-[#09090b] rounded-lg p-4 border border-zinc-800/60 shadow-inner">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-2">How to Answer (STAR)</span>
                        <MarkdownRenderer content={q.answer} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`animate-in fade-in duration-500 ${activeTab === 'roadmap' ? 'block' : 'hidden'}`}>
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
                
                {displayReport.preparationPlan?.map((plan: any, idx: number) => {
                  const tasks = plan.task || plan.tasks || [];
                  return (
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
                          {tasks.map((t: string, tIdx: number) => (
                            <li key={tIdx} className="flex items-start gap-3">
                              <CheckCircle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                              <span className="text-sm text-zinc-300 leading-relaxed">{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: SCORE & GAPS (25%) */}
        <div className="lg:w-[320px] shrink-0 overflow-y-auto pr-1 flex flex-col gap-4" style={{ scrollbarWidth: 'none' }}>
          
          {/* Match Score */}
          <div className="bg-[#121214] border border-zinc-800/60 rounded-xl p-6 shadow-xl text-center flex flex-col items-center relative overflow-hidden shrink-0">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
            
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-8 z-10">Profile Match</h3>
            <div className="z-10">
              <ScoreRing score={Number(displayReport.matchScore) || 0} />
            </div>
            <p className="text-xs text-zinc-500 mt-6 leading-relaxed z-10">
              Score calculated based on requirement overlap, technical depth, and experience alignment.
            </p>
          </div>

          {/* Skill Gaps */}
          <div className="bg-[#121214] border border-zinc-800/60 rounded-xl p-5 shadow-xl shrink-0">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
              Critical Gaps
            </h3>
            <ul className="flex flex-col gap-3">
              {displayReport.skillGaps?.map((gap: any, idx: number) => {
                let badgeColor = "";
                let severityStr = "Minor";
                if (gap.severity === 'high' || gap.severity === 'Critical') {
                  badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                  severityStr = "Critical";
                } else if (gap.severity === 'medium' || gap.severity === 'Moderate') {
                  badgeColor = "bg-orange-500/10 text-orange-400 border-orange-500/20";
                  severityStr = "Moderate";
                } else {
                  badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                  severityStr = "Minor";
                }

                return (
                  <li key={idx} className="flex flex-col gap-2 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-medium text-zinc-200">{gap.skill}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border shrink-0 ${badgeColor}`}>
                        {severityStr}
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
    {showAuthModal && (
      <AuthModal 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    )}
    </>
  );
};

export default ReportDetails;
