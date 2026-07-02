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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden text-zinc-200">
      
      {/* Background Glows (Optional subtle effects) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl mb-6">
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Smart Voice Assistant
          </h1>
          <p className="text-lg text-zinc-400 max-w-lg mx-auto">
            Configure your interview parameters. Our AI will tailor the questions specifically to your role, experience level, and resume.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
            <Sparkles className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={isAnalyzed ? (e) => { e.preventDefault(); handleStartInterview(); } : handleAnalyze} className="bg-[#121214]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-zinc-800/80">
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Target Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    disabled={isAnalyzing || isGenerating || isAnalyzed}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Experience Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Years of Experience</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 3 years"
                    disabled={isAnalyzing || isGenerating || isAnalyzed}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Interview Type Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Interview Type</label>
              <div className="relative">
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  disabled={isAnalyzing || isGenerating || isAnalyzed}
                  className="w-full appearance-none pl-11 pr-10 py-3 bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-700/50 hover:border-zinc-600 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
                >
                  <option value="Technical" className="bg-zinc-900 text-zinc-100 py-2">Technical Interview</option>
                  <option value="HR" className="bg-zinc-900 text-zinc-100 py-2">Behavioral Interview</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-emerald-500/80" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-zinc-500" />
                </div>
              </div>
            </div>

            {/* Resume Upload or Analysis Result */}
            {!isAnalyzed ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Upload Resume (PDF)</label>
                <div 
                  onClick={() => !isAnalyzing && !isGenerating && fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center text-center
                    ${isAnalyzing || isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${resume ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-700/50 hover:border-zinc-600 bg-zinc-900/30'}`}
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
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-sm font-medium text-emerald-400 mb-1">Resume Attached Successfully</p>
                      <p className="text-xs text-zinc-500">{resume.name}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-3 shadow-inner">
                        <Upload className="w-6 h-6 text-zinc-400" />
                      </div>
                      <p className="text-sm font-medium text-zinc-300 mb-1">Click to browse or drag and drop</p>
                      <p className="text-xs text-zinc-500">Only PDF files are supported</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-semibold text-zinc-100 border-b border-zinc-800 pb-2">Resume Analysis Result</h3>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-zinc-400">Projects Detected:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {resumeData.projects && resumeData.projects.length > 0 ? (
                      resumeData.projects.map((project, idx) => (
                        <li key={idx} className="text-sm text-zinc-300">{project}</li>
                      ))
                    ) : (
                      <li className="text-sm text-zinc-500 italic">No projects found.</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-medium text-zinc-400">Skills Identified:</h4>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills && resumeData.skills.length > 0 ? (
                      resumeData.skills.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 rounded-md text-xs font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-zinc-500 italic">No skills found.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              {!isAnalyzed ? (
                <button
                  type="submit"
                  disabled={!role || !experience || !resume || isAnalyzing}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:hover:bg-zinc-800 disabled:cursor-not-allowed text-zinc-100 font-bold py-3.5 px-6 rounded-xl transition-all border border-zinc-700 shadow-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      Analyze Resume
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 disabled:cursor-not-allowed text-zinc-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
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
  );
};

export default Setup;