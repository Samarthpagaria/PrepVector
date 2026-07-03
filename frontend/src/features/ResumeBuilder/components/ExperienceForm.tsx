import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Save, Loader2 } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { useSaveResume } from '../hooks/useResumeBuilder';
import { enhanceJobDescription } from '../services/resumeBuilder.api';
import { useToastStore } from '../../../store/toastStore';

interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  is_current: boolean;
}

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences = [], onChange }) => {
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);
  const { resumeData } = useResumeStore();
  const { mutate: saveResume, isPending } = useSaveResume();
  const { openToast } = useToastStore();

  const handleSave = () => {
    saveResume({ resumeId: resumeData._id, resumeData });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false
    };
    onChange([...experiences, newExperience]);
  };

  const removeExperience = (indexToRemove: number) => {
    onChange(experiences.filter((_, index) => index !== indexToRemove));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    
    // If setting to current, clear end date
    if (field === 'is_current' && value === true) {
      updated[index].end_date = "";
    }
    
    onChange(updated);
  };

  const generateDescription = async (index: number, experience: Experience) => {
    if (!experience.description?.trim()) return;
    
    setEnhancingIndex(index);
    
    try {
      const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}.`;
      const response = await enhanceJobDescription(prompt);
      
      if (response.success) {
        updateExperience(index, "description", response.data);
        openToast("Job description enhanced successfully!", "success");
      } else {
        openToast(response.message || "Failed to enhance description", "error");
      }
    } catch (error: any) {
      openToast(error.response?.data?.message || "Failed to communicate with AI", "error");
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-50 via-emerald-500 to-emerald-200 bg-clip-text text-transparent">
            Professional Experience
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Add your job experience</p>
        </div>
        
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="max-sm:hidden">Add Experience</span>
        </button>
      </div>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4 relative group">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-zinc-300">Experience #{index + 1}</h3>
              <button
                onClick={() => removeExperience(index)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Remove Experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Company Name</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Job Title</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, "position", e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Start Date</label>
                <input
                  type="month"
                  value={exp.start_date}
                  onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">End Date</label>
                <input
                  type="month"
                  value={exp.end_date}
                  disabled={exp.is_current}
                  onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id={`current-${index}`}
                checked={exp.is_current}
                onChange={(e) => updateExperience(index, "is_current", e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-[#121214] text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0"
              />
              <label htmlFor={`current-${index}`} className="text-sm text-zinc-400 cursor-pointer select-none">
                Currently working here
              </label>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <div className="flex justify-between items-end">
                <label className="text-xs font-medium text-zinc-400">Job Description</label>
                <button
                  onClick={() => generateDescription(index, exp)}
                  disabled={enhancingIndex === index || !exp.description?.trim()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-fuchsia-400 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enhancingIndex === index ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {enhancingIndex === index ? 'Generating...' : 'Enhance with AI'}
                </button>
              </div>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                placeholder="Describe your key responsibilities and achievements..."
                className="w-full min-h-[120px] p-3 rounded-lg bg-[#121214] border border-zinc-700/80 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 resize-y transition-all text-sm leading-relaxed"
              />
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500 text-sm">No professional experience added yet.</p>
            <button 
              onClick={addExperience}
              className="mt-3 text-emerald-500 text-sm font-medium hover:text-emerald-400 transition-colors"
            >
              + Add your first experience
            </button>
          </div>
        )}
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

export default ExperienceForm;
