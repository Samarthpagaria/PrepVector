import React, { useState } from 'react';
import { Sparkles, Save, Loader2 } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { useSaveResume } from '../hooks/useResumeBuilder';
import { enhanceProfessionalSummary } from '../services/resumeBuilder.api';
import { useToastStore } from '../../../store/toastStore';

interface ProfessionalSummaryFormProps {
  summary: string;
  onChange: (value: string) => void;
}

const ProfessionalSummaryForm: React.FC<ProfessionalSummaryFormProps> = ({ summary, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { resumeData } = useResumeStore();
  const { mutate: saveResume, isPending } = useSaveResume();
  const { openToast } = useToastStore();

  const handleSave = () => {
    saveResume({ resumeId: resumeData._id, resumeData });
  };

  const generateSummary = async () => {
    if (!summary?.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const prompt = `enhance my professional summary "${summary}"`;
      const response = await enhanceProfessionalSummary(prompt);
      if (response.success) {
        onChange(response.data);
        openToast("Summary enhanced successfully!", "success");
      } else {
        openToast(response.message || "Failed to enhance summary", "error");
      }
    } catch (error: any) {
      openToast(error.response?.data?.message || "Failed to communicate with AI", "error");
    } finally {
      setIsGenerating(false);
    }
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
          onClick={generateSummary}
          disabled={isGenerating || !summary?.trim()}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-fuchsia-400 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGenerating ? 'Generating...' : 'AI Enhance'}
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
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
