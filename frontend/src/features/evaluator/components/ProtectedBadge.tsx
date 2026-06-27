import { Lock } from 'lucide-react';

export const ProtectedBadge = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800">
      <Lock className="w-3 h-3 text-zinc-400" />
      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Protected</span>
    </div>
  );
};
