import React, { useState } from 'react';
import { JobDescription } from '../components/JobDescription';
import { UploadResume } from '../components/UploadResume';
import { SelfDescription } from '../components/SelfDescription';
import { HelperNote } from '../components/HelperNote';
import { Star, User, Loader2 } from 'lucide-react';
import { useGenerateReport } from '../hooks/useEvaluator';

const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selfDescription, setSelfDescription] = useState('');

  const { mutate: generateReport, isPending } = useGenerateReport();

  const handleGenerate = () => {
    if (!resumeFile) {
      alert("Please upload your Resume (required by backend).");
      return;
    }
    if (!jobDescription) {
      alert("Please paste a Target Job Description.");
      return;
    }
    
    generateReport({
      jobDescription,
      selfDescription,
      resumeFile
    });
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-200 p-4 md:p-8 font-sans flex flex-col items-center justify-center">
      
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
      <div className="w-full max-w-[1000px] bg-[#121214] rounded-2xl border border-zinc-800/60 shadow-2xl flex flex-col">
        
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
        <div className="px-7 py-4 md:px-8 border-t border-zinc-800/60 bg-[#09090b] rounded-b-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[13px] text-zinc-500">
            AI-Powered Strategy Generation — Approx 30s
          </span>
          <button 
            onClick={handleGenerate}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 fill-current" />
                Generate Strategy
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
