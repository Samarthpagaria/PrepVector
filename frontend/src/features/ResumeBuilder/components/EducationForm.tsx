import React from 'react';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { useSaveResume } from '../hooks/useResumeBuilder';

interface Education {
  institution: string;
  degree: string;
  field: string;
  graduation_date: string;
  gpa: string;
}

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ education = [], onChange }) => {
  const { resumeData } = useResumeStore();
  const { mutate: saveResume, isPending } = useSaveResume();

  const handleSave = () => {
    saveResume({ resumeId: resumeData._id, resumeData });
  };

  const addEducation = () => {
    const newEducation: Education = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: ""
    };
    onChange([...education, newEducation]);
  };

  const removeEducation = (indexToRemove: number) => {
    onChange(education.filter((_, index) => index !== indexToRemove));
  };

  const updateEducation = (index: number, fieldName: keyof Education, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [fieldName]: value };
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-50 via-emerald-500 to-emerald-200 bg-clip-text text-transparent">
            Education
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Add your education details</p>
        </div>
        
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="max-sm:hidden">Add Education</span>
        </button>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4 relative group">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-zinc-300">Education #{index + 1}</h3>
              <button
                onClick={() => removeEducation(index)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Remove Education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Institution Name</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  placeholder="e.g. Bachelor's, Master's"
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Field of Study</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, "field", e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Graduation Date</label>
                <input
                  type="month"
                  value={edu.graduation_date}
                  onChange={(e) => updateEducation(index, "graduation_date", e.target.value)}
                  className="w-full px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400">GPA (optional)</label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                  placeholder="e.g. 3.8/4.0"
                  className="w-full md:w-1/2 px-3 py-2 bg-[#121214] border border-zinc-700/80 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
        ))}

        {education.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500 text-sm">No education added yet.</p>
            <button 
              onClick={addEducation}
              className="mt-3 text-emerald-500 text-sm font-medium hover:text-emerald-400 transition-colors"
            >
              + Add your first education details
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

export default EducationForm;
