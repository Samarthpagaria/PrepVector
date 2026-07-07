import React, { useState, useRef } from 'react';
import { Briefcase, Clock, FileText, Upload, Sparkles, ChevronDown, CheckCircle2, Loader2, Play } from 'lucide-react';
import { useSetInterview, useGenerateQuestions } from '../hooks/useInterview';
import { useInterviewStore } from '../store/useInterview.store';

interface SetupProps {
  onStart: (data: any) => void;
}

const Setup: React.FC<SetupProps> = ({ onStart }) => {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [resume, setResume] = useState<File | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: analyzeResume, isPending: isAnalyzing } = useSetInterview();
  const { mutate: generateQuestions, isPending: isGenerating } = useGenerateQuestions();
  const resumeData = useInterviewStore((state) => state.resumeData);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !experience || !resume) return;
    
    setError(null);
    analyzeResume({ 
      role, 
      experience, 
      interviewType, 
      resumeFile: resume 
    }, {
      onSuccess: () => {
        setIsAnalyzed(true);
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || "Failed to analyze resume. Please ensure the PDF has readable text.");
      }
    });
  };

  const handleStartInterview = () => {
    generateQuestions({
      role,
      experience,
      mode: interviewType,
      resumeText: resumeData.resumeText,
      projects: resumeData.projects,
      skills: resumeData.skills,
    }, {
      onSuccess: (data) => {
        // Pass the returned interview data (including questions, interviewId) to parent
        onStart(data?.data || data);
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-8 relative overflow-hidden text-zinc-200">
      
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Half: Text Content */}
          <div className="text-left max-w-xl">
            <div className="inline-flex items-center justify-center p-3 bg-black border border-neutral-800 rounded-2xl shadow-xl mb-6">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              AI Mock <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Interview</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Experience a hyper-realistic mock interview. Our AI will analyze your resume and tailor questions specifically to your target role and experience level.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-zinc-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm font-medium">Hyper-realistic voice conversations</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm font-medium">Questions tailored to your resume</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm font-medium">Instant actionable feedback and scoring</span>
              </li>
            </ul>
          </div>

          {/* Right Half: The Form Card */}
          <div className="w-full max-w-[36rem] mx-auto lg:ml-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-200 text-sm">
                <Sparkles className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={isAnalyzed ? (e) => { e.preventDefault(); handleStartInterview(); } : handleAnalyze} className="bg-black p-6 md:p-8 rounded-[1.5rem] shadow-2xl border border-neutral-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Target Role */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 ml-1">Target Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    disabled={isAnalyzing || isGenerating || isAnalyzed}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 text-sm"
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 ml-1">Experience</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 3 years"
                    disabled={isAnalyzing || isGenerating || isAnalyzed}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Interview Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 ml-1">Interview Type</label>
              <div className="relative">
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  disabled={isAnalyzing || isGenerating || isAnalyzed}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-zinc-100 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <option value="Technical" className="bg-neutral-900 text-zinc-100 py-2">Technical Interview</option>
                  <option value="HR" className="bg-neutral-900 text-zinc-100 py-2">Behavioral Interview</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-emerald-500/80" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                </div>
              </div>
            </div>

            {/* Resume Upload / Results */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 ml-1">Resume Input</label>
              {!isAnalyzed ? (
                <div 
                  onClick={() => !isAnalyzing && !isGenerating && fileInputRef.current?.click()}
                  className={`relative border border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center group
                    ${isAnalyzing || isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${resume ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-900/50'}`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".pdf"
                    disabled={isAnalyzing || isGenerating}
                    className="hidden" 
                  />
                  
                  {resume ? (
                    <>
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <p className="text-sm font-medium text-emerald-400 mb-0.5">Resume Attached</p>
                      <p className="text-[11px] text-zinc-500">{resume.name}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center mb-3 shadow-inner border border-neutral-800 group-hover:border-emerald-500/30 transition-colors">
                        <Upload className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-[13px] font-medium text-zinc-300 mb-0.5">Click to browse (PDF)</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800/80 animate-in fade-in slide-in-from-bottom-2 duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Sparkles className="w-16 h-16 text-emerald-500" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-[11px] font-bold tracking-widest uppercase text-emerald-400 mb-4 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Analysis Complete
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-black/50 p-3 rounded-lg border border-neutral-800">
                        <h4 className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Key Projects</h4>
                        <ul className="space-y-1.5">
                          {resumeData.projects && resumeData.projects.length > 0 ? (
                            resumeData.projects.map((project, idx) => (
                              <li key={idx} className="text-[10px] text-zinc-300 flex items-start gap-1.5 leading-tight">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                                {project}
                              </li>
                            ))
                          ) : (
                            <li className="text-[10px] text-zinc-600 italic">No projects found.</li>
                          )}
                        </ul>
                      </div>

                      <div className="bg-black/50 p-3 rounded-lg border border-neutral-800">
                        <h4 className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Core Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {resumeData.skills && resumeData.skills.length > 0 ? (
                            resumeData.skills.map((skill, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-black text-zinc-400 border border-neutral-800 rounded text-[9px] font-medium">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-zinc-600 italic">No skills found.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              {!isAnalyzed ? (
                <button
                  type="submit"
                  disabled={!role || !experience || !resume || isAnalyzing}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:hover:bg-neutral-900 disabled:cursor-not-allowed text-zinc-100 font-bold py-3.5 rounded-xl transition-all border border-neutral-800 shadow-sm text-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Analyze Resume
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 disabled:border-zinc-800 disabled:cursor-not-allowed text-zinc-950 font-bold tracking-wide text-sm py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Start Interview
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
};

export default Setup;