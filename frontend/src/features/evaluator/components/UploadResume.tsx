import React, { useRef, useState } from 'react';
import { CloudUpload, FileText, X } from 'lucide-react';

interface UploadResumeProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const UploadResume = ({ file, onFileSelect }: UploadResumeProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-medium text-zinc-200">Upload Resume</h3>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider text-teal-400 bg-zinc-900 border border-teal-500/20 uppercase">
          Recommended
        </span>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group flex flex-col items-center justify-center p-8 rounded-xl border border-dashed transition-all cursor-pointer ${
            isDragging 
              ? 'border-emerald-500 bg-emerald-500/10' 
              : 'border-neutral-800 bg-black hover:bg-neutral-900/40 hover:border-emerald-500/40'
          }`}
        >
          <CloudUpload className={`w-6 h-6 mb-3 transition-colors ${isDragging ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-emerald-500'}`} />
          <span className="text-sm font-medium text-zinc-300 mb-1.5 transition-colors">
            {isDragging ? 'Drop file here' : 'Click to upload or drag & drop'}
          </span>
          <span className="text-xs text-zinc-600">
            PDF or DOCX (Max 5MB)
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">{file.name}</span>
              <span className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors group"
          >
            <X className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
};
