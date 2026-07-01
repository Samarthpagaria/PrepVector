import React, { useState, KeyboardEvent } from 'react';
import { X, Sparkles, Save, Loader2 } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { useSaveResume } from '../hooks/useResumeBuilder';

interface SkillsFormProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ skills = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const { resumeData } = useResumeStore();
  const { mutate: saveResume, isPending } = useSaveResume();

  const handleSave = () => {
    saveResume({ resumeId: resumeData._id, resumeData });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-50 via-emerald-500 to-emerald-200 bg-clip-text text-transparent">
            Core Skills
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Add your technical and professional skills</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
          <Sparkles className="w-4 h-4" />
          <span>{skills.length} Skills Added</span>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Add a skill</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. JavaScript, Project Management (press Enter to add)"
              className="flex-1 px-4 py-2.5 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            <button
              onClick={addSkill}
              disabled={!inputValue.trim()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-zinc-500">Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-sans mx-0.5">Enter</kbd> or a comma to add a skill quickly.</p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Your Skills</h3>
          <div className="flex flex-wrap gap-2 min-h-[120px] p-4 bg-[#121214] border border-zinc-800/80 rounded-lg items-start content-start">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-zinc-800/80 border border-zinc-700/80 text-zinc-200 text-sm rounded-full hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="p-0.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            
            {skills.length === 0 && (
              <span className="text-zinc-500 text-sm italic w-full flex items-center justify-center h-full min-h-[60px]">
                No skills added yet. Type above to begin.
              </span>
            )}
          </div>
        </div>
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

export default SkillsForm;
