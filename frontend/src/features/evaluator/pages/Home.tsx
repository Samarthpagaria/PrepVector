import React, { useState, useEffect } from 'react';
import { JobDescription } from '../components/JobDescription';
import { UploadResume } from '../components/UploadResume';
import { SelfDescription } from '../components/SelfDescription';
import { HelperNote } from '../components/HelperNote';
import { AuthModal } from '../components/AuthModal';
import { Star, User, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { useGenerateReport } from '../hooks/useEvaluator';
import { useAuthStore } from '../../../store/useAuth.store';

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

  const user = useAuthStore((state) => state.user);
  const { mutate: generateReport, isPending } = useGenerateReport();

  const isLoading = isPending || showFakeLoader;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 3500); // Change message every 3.5 seconds
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = () => {
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
      generateReport({
        jobDescription,
        selfDescription,
        resumeFile
      });
    } else {
      // If not logged in, show the lead magnet flow
      setShowFakeLoader(true);
      setTimeout(() => {
        setShowFakeLoader(false);
        setShowAuthModal(true);
      }, 4500); // 4.5 seconds fake generation
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // User is now logged in, automatically trigger the real generation
    generateReport({
      jobDescription,
      selfDescription,
      resumeFile: resumeFile as File
    });
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-200 p-4 md:p-8 font-sans flex flex-col items-center justify-center relative">
      
      {/* Header */}
      <div className="text-center mb-10 w-full max-w-5xl">
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
               <span className="text-[13px] text-zinc-500">
                 AI-Powered Strategy Generation — Approx 60s
               </span>
             ) : (
               <span 
                 key={loadingStep}
                 className="text-[13px] text-emerald-400 animate-pulse"
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

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}

    </main>
  );
};

export default Home;
