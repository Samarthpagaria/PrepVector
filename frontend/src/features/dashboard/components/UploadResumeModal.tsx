import { XIcon, UploadCloudIcon, FileIcon } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import pdfToText from 'react-pdftotext';
import { useUploadExistingResume } from '../hooks/useDashbaord';
import { useToastStore } from '../../../store/toastStore';
import { useQueryClient } from '@tanstack/react-query';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadResumeModal: React.FC<UploadResumeModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const openToast = useToastStore(state => state.openToast);
  const queryClient = useQueryClient();
  
  const { mutate: uploadExistingResume, isPending } = useUploadExistingResume();

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!title.trim() || !file) return;

    try {
      console.log(`[Frontend] Starting text extraction for file: ${file.name}`);
      const resumeText = await pdfToText(file);
      console.log(`[Frontend] Extraction successful! Extracted text length: ${resumeText?.length}`);
      
      console.log("[Frontend] Sending payload to backend:", { title, resumeTextLength: resumeText?.length });
      uploadExistingResume(
        { title, resumeText },
        {
          onSuccess: (data) => {
            console.log("[UploadResumeModal] Success:", data);
            
            openToast('Resume uploaded successfully! Redirecting...');
            
            // Invalidate the cache to automatically refetch all resumes in the background
            queryClient.invalidateQueries({ queryKey: ["allResumes"] });
            
            setTimeout(() => {
              setTitle('');
              setFile(null);
              onClose();
              navigate(`/app/builder/${data.resume?._id || data.resume?.id || data.resumeId}`);
            }, 1500);
          },
          onError: (error: any) => {
            console.error("[UploadResumeModal] Error:", error);
            const errMsg = error?.response?.data?.message || error.message || "Failed to upload resume";
            openToast(errMsg, 'error');
          }
        }
      );
    } catch (error: any) {
      console.error("Failed to extract text from pdf:", error);
      openToast("Failed to read PDF file.", 'error');
    }
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
          <h2 className="text-xl font-bold bg-linear-to-r from-green-50 via-emerald-500 to-green-200 bg-clip-text text-transparent flex items-center gap-2">
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload Resume"
            )}
          </h2>
          <button 
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isPending}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-300">Select resume file (PDF only)</span>
            <div 
              onClick={() => !isPending && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } ${
                file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-700 hover:border-emerald-500/50 bg-zinc-900/50 hover:bg-zinc-900'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                disabled={isPending}
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
            disabled={!title.trim() || !file || isPending}
            className="w-full py-3 mt-2 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300"
          >
            {isPending ? 'Uploading & Parsing...' : 'Upload Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadResumeModal;
