interface SelfDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export const SelfDescription = ({ value, onChange }: SelfDescriptionProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-[13px] font-medium text-zinc-200 mb-3">Quick Self-Description</h3>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Briefly describe your experience, key skills, and years of experience..."
        className="w-full h-[120px] p-4 rounded-xl bg-black border border-neutral-800 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/40 resize-none transition-colors leading-relaxed"
      />
    </div>
  );
};
