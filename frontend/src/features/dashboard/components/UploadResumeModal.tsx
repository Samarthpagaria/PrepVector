import { XIcon, UploadCloudIcon, FileIcon } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadResumeModal: React.FC<UploadResumeModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpload = () => {
    if (!title.trim() || !file) return;
    // Generate a pseudo-random ID for the new resume
    const newResumeId = crypto.randomUUID();
    navigate(`/app/builder/${newResumeId}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        alert('Please select a valid PDF file.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/50 bg-zinc-900/50">
          <h2 className="text-xl font-bold bg-linear-to-r from-green-50 via-emerald-500 to-green-200 bg-clip-text text-transparent">Upload Resume</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
          >
            <XIcon className="size-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <input 
              type="text" 
              placeholder="Enter resume title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-300">Select resume file (PDF only)</span>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-700 hover:border-emerald-500/50 bg-zinc-900/50 hover:bg-zinc-900'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="application/pdf"
                className="hidden" 
              />
              {file ? (
                <>
                  <FileIcon className="size-10 text-emerald-500" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-emerald-400">{file.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloudIcon className="size-10 text-zinc-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-300">Click to upload or drag and drop</p>
                    <p className="text-xs text-zinc-500 mt-1">PDF format only</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleUpload}
            disabled={!title.trim() || !file}
            className="w-full py-3 mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300"
          >
            Upload Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadResumeModal;
