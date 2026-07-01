import React, { useState, useEffect } from 'react';
import { JobDescription } from '../components/JobDescription';
import { UploadResume } from '../components/UploadResume';
import { SelfDescription } from '../components/SelfDescription';
import { HelperNote } from '../components/HelperNote';
import { AuthModal } from '../components/AuthModal';
import { Star, User, Loader2, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { useGenerateReport, useGetAllReports } from '../hooks/useEvaluator';
import { useAuthStore } from '../../../store/useAuth.store';
import { useNavigate } from 'react-router';
import Loader from '../../../components/shared/Loader';

const idleMessages = [
  "AI analyzes your resume against the job description.",
  "Identifies critical skill gaps in your profile.",
  "Generates high-probability technical questions.",
  "Prepares you with role-specific behavioral scenarios.",
  "Builds a personalized day-by-day preparation roadmap."
];

const loadingMessages = [
  "Extracting profile data and experience...",
  "Cross-referencing with target job description...",
  "Analyzing critical skill gaps...",
  "Drafting role-specific technical questions...",
  "Generating behavioral interview scenarios...",
  "Formulating your day-by-day preparation roadmap...",
  "Finalizing your personalized strategy report..."
];

const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selfDescription, setSelfDescription] = useState('');
  
  // Lead Magnet State
  const [showFakeLoader, setShowFakeLoader] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Animation State
  const [loadingStep, setLoadingStep] = useState(0);
  const [idleStep, setIdleStep] = useState(0);

  const user = useAuthStore((state) => state.user);
  const { mutate: generateReport, isPending } = useGenerateReport();
  const { data: reports, isLoading: isReportsLoading } = useGetAllReports();
  const navigate = useNavigate();

  const isLoading = isPending || showFakeLoader;

  useEffect(() => {
    console.log("[Home] Component mounted/updated. User auth state:", user ? "Logged In" : "Not Logged In");
    if (reports) {
      console.log("[Home] Recent reports fetched:", reports.length);
    }
  }, [user, reports]);

  // Handle Loading Messages Animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle Idle Messages Animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isLoading) {
      interval = setInterval(() => {
        setIdleStep((prev) => (prev + 1) % idleMessages.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = () => {
    console.log("[Home] 'Generate Strategy' clicked. Current state:");
    console.log("[Home] Resume uploaded?", !!resumeFile);
    console.log("[Home] Job Description filled?", !!jobDescription);
    console.log("[Home] User logged in?", !!user);

    if (!resumeFile) {
      alert("Please upload your Resume (required by backend).");
      return;
    }
    if (!jobDescription) {
      alert("Please paste a Target Job Description.");
      return;
    }
    
    if (user) {
      // If logged in, generate normally
      console.log("[Home] Triggering generateReport mutation directly...");
      generateReport({
        jobDescription,
        selfDescription,
        resumeFile
      }, {
        onSuccess: (data) => {
          const reportId = data?.interviewReport?._id || data?._id;
          console.log("[Home] Generation success! Navigating to report:", reportId);
          if (reportId) navigate(`/report/${reportId}`);
        }
      });
    } else {
      // If not logged in, show the lead magnet flow
      console.log("[Home] User not logged in. Starting fake loader lead magnet flow...");
      setShowFakeLoader(true);
      setTimeout(() => {
        console.log("[Home] Fake loader finished. Showing AuthModal.");
        setShowFakeLoader(false);
        setShowAuthModal(true);
      }, 4500); // 4.5 seconds fake generation
    }
  };

  const handleAuthSuccess = () => {
    console.log("[Home] AuthModal reported success! Hiding modal and triggering actual generation...");
    setShowAuthModal(false);
    // User is now logged in, automatically trigger the real generation
    generateReport({
      jobDescription,
      selfDescription,
      resumeFile: resumeFile as File
    }, {
      onSuccess: (data) => {
        const reportId = data?.interviewReport?._id || data?._id;
        console.log("[Home] Post-auth generation success! Navigating to report:", reportId);
        if (reportId) navigate(`/report/${reportId}`);
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-200 p-4 md:p-8 font-sans flex flex-col items-center justify-center relative">
      
      {/* Header */}
      <div className="text-center mb-10 w-full max-w-5xl pt-10 relative">
        {user && (
          <div className="absolute top-0 right-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Star className="w-3.5 h-3.5 fill-emerald-400" />
            {20 - (user.reportGenerationCount || 0)} Reports Left
          </div>
        )}
        <h1 className="text-3xl md:text-[32px] font-semibold mb-3 tracking-tight text-zinc-100">
          Create Your Custom <span className="text-emerald-500">Interview Plan</span>
        </h1>
        <p className="text-zinc-500 text-[14px] max-w-lg mx-auto">
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[1000px] bg-[#121214] rounded-2xl border border-zinc-800/60 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column */}
          <div className="p-7 md:p-8 border-b md:border-b-0 md:border-r border-zinc-800/60">
            <JobDescription value={jobDescription} onChange={setJobDescription} />
          </div>

          {/* Right Column */}
          <div className="p-7 md:p-8 flex flex-col">
            <div className="flex items-center gap-2.5 mb-6">
              <User className="w-4 h-4 text-emerald-500" />
              <h2 className="text-base font-medium text-zinc-100">Your Profile</h2>
            </div>
            
            <UploadResume file={resumeFile} onFileSelect={setResumeFile} />
            
            <div className="flex items-center gap-4 my-7">
              <div className="h-px bg-zinc-800/60 flex-1"></div>
              <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">OR</span>
              <div className="h-px bg-zinc-800/60 flex-1"></div>
            </div>
            
            <SelfDescription value={selfDescription} onChange={setSelfDescription} />
            
            <div className="mt-5">
              <HelperNote />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 md:px-8 border-t border-zinc-800/60 bg-[#09090b] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="h-6 overflow-hidden relative flex-1 flex items-center">
             {!isLoading ? (
               <span 
                 key={`idle-${idleStep}`}
                 className="text-[13px] text-zinc-500 animate-in fade-in slide-in-from-bottom-2 duration-500"
               >
                 {idleMessages[idleStep]}
               </span>
             ) : (
               <span 
                 key={`loading-${loadingStep}`}
                 className="text-[13px] text-emerald-400 animate-pulse animate-in fade-in slide-in-from-bottom-2 duration-300"
               >
                 {loadingMessages[loadingStep]}
               </span>
             )}
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {showFakeLoader ? "Analyzing Profile..." : "Generating..."}
              </>
            ) : (
              <>
                <Star className="w-4 h-4 fill-current" />
                Generate Strategy
              </>
            )}
          </button>
        </div>

        {/* Blurred Fake Report Overlay */}
        {showAuthModal && (
          <div className="absolute inset-0 z-40 bg-[#09090b]/80 backdrop-blur-[2px] flex items-center justify-center p-8">
            <div className="w-full h-full border border-zinc-800/80 rounded-xl bg-zinc-900/50 overflow-hidden flex flex-col blur-sm opacity-60">
              <div className="p-6 border-b border-zinc-800/80 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20" />
                <div>
                  <div className="w-48 h-5 bg-zinc-700/50 rounded-md mb-2" />
                  <div className="w-32 h-3 bg-zinc-800 rounded-md" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="w-full h-4 bg-zinc-800 rounded-md" />
                <div className="w-3/4 h-4 bg-zinc-800 rounded-md" />
                <div className="w-5/6 h-4 bg-zinc-800 rounded-md" />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Recent Reports Section (Only if user is logged in) */}
      {user && reports && reports.length > 0 && (
        <div className="w-full max-w-[1000px] mt-8 bg-[#121214] rounded-2xl border border-zinc-800/60 shadow-xl overflow-hidden mb-12">
          <div className="px-6 py-5 border-b border-zinc-800/60 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest">My Recent Reports</h2>
          </div>
          <div className="flex flex-col">
            {reports.map((report: any) => (
              <div 
                key={report._id}
                onClick={() => navigate(`/report/${report._id}`)}
                className="group flex items-center justify-between p-5 border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/50 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                    <FileText className="w-4 h-4 text-emerald-500/70 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
                      {report.title || "Interview Strategy Report"}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(report.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1">Match</span>
                    <span className={`text-sm font-bold ${report.matchScore >= 85 ? 'text-emerald-400' : report.matchScore >= 70 ? 'text-orange-400' : 'text-red-400'}`}>
                      {report.matchScore}%
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}

      {/* Full Screen Loading Overlay */}
      {isLoading && (
        <Loader fullScreen text={loadingMessages[loadingStep]} />
      )}

    </main>
  );
};

export default Home;
