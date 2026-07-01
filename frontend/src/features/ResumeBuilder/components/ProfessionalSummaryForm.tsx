import React, { useState } from 'react';
import { Sparkles, Save } from 'lucide-react';

interface ProfessionalSummaryFormProps {
  summary: string;
  onChange: (value: string) => void;
}

const ProfessionalSummaryForm: React.FC<ProfessionalSummaryFormProps> = ({ summary, onChange }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!summary.trim()) return;
    
    setIsEnhancing(true);
    
    // Simulate AI enhancement API call
    setTimeout(() => {
      // In a real implementation, this would be an API call to your backend
      onChange(summary + " [AI Enhanced: added more impactful action verbs and optimized for ATS systems.]");
      setIsEnhancing(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-50 via-emerald-500 to-emerald-200 bg-clip-text text-transparent">
            Professional Summary
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Add a summary for your resume here</p>
        </div>
        
        <button
          onClick={handleEnhance}
          disabled={isEnhancing || !summary.trim()}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-fuchsia-400 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className={`w-4 h-4 ${isEnhancing ? 'animate-pulse' : ''}`} />
          {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
          className="w-full min-h-[250px] p-4 rounded-xl bg-zinc-900/50 border border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-y transition-all"
        />
        <p className="text-xs text-zinc-500 text-center mt-2">
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>

      <div className="pt-4 mt-2 border-t border-zinc-800/60 flex justify-end">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
