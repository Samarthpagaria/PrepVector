import { Briefcase } from 'lucide-react';

interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescription = ({ value, onChange }: JobDescriptionProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <Briefcase className="w-4 h-4 text-emerald-500" />
          <h2 className="text-base font-medium text-zinc-100">Target Job Description</h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider text-emerald-400 bg-emerald-500/10 uppercase">
          Required
        </span>
      </div>
      
      <div className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col">
        <textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7000}
          placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React...'"
          className="flex-1 w-full bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed min-h-[350px]"
        />
        <div className="text-right mt-3">
          <span className={`text-xs font-medium ${value.length === 7000 ? 'text-red-400' : 'text-zinc-600'}`}>
            {value.length} / 7000 chars
          </span>
        </div>
      </div>
    </div>
  );
};
