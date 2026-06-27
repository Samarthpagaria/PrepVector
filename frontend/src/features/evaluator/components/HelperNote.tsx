import { Info } from 'lucide-react';

export const HelperNote = () => {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-800/80">
      <div className="mt-0.5">
        <Info className="w-4 h-4 text-emerald-500" />
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">
        Either a <span className="font-medium text-zinc-200">Resume</span> or a <span className="font-medium text-zinc-200">Self Description</span> is required to generate a personalized plan.
      </p>
    </div>
  );
};
