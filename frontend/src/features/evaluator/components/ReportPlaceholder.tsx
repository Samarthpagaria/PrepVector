import { FileSearch } from 'lucide-react';

export const ReportPlaceholder = () => {
  return (
    <div className="h-full w-full rounded-2xl border border-zinc-800 bg-[#111316] flex flex-col items-center justify-center text-center p-6">
      <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3 border border-zinc-800 shadow-inner">
        <FileSearch className="w-4 h-4 text-zinc-500" />
      </div>
      <h3 className="text-zinc-300 text-sm font-medium mb-1">Your report will appear here</h3>
      <p className="text-zinc-500 text-[11px] max-w-[200px]">
        Upload your resume and provide details to generate an analysis.
      </p>
    </div>
  );
};
