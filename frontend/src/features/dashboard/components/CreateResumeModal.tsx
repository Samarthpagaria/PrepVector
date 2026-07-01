import { XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGenerateResume } from '../hooks/useDashbaord'

interface CreateResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  allResumes: any[];
  setAllResumes: React.Dispatch<React.SetStateAction<any[]>>;
}
const CreateResumeModal: React.FC<CreateResumeModalProps> = ({ isOpen, onClose ,allResumes,setAllResumes}) => {
  const [title, setTitle] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const {mutate:generateResume,isPending,isError} = useGenerateResume()

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    generateResume(
      { title },
      {
        onSuccess: (data) => {
          console.log("[CreateResumeModal] Success:", data);
          
          if (!data.resume?._id && !data.resume?.id) {
            console.error("[CreateResumeModal] No ID found in response:", data);
            return;
          }

          // Show Toast
          setShowToast(true);
          
          // Update local state
          setAllResumes(prev => [...prev, data.resume]);
          
          // Delay navigation so the user sees the awesome toast!
          setTimeout(() => {
            setShowToast(false);
            setTitle('');
            onClose();
            navigate(`/app/builder/${data.resume._id || data.resume.id}`);
          }, 1500);
        },
        onError: (error) => {
          console.log("[CreateResumeModal] Error generating resume:", error);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      
      {/* 🌟 Premium Grainy Gradient Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="relative overflow-hidden px-6 py-3 rounded-full border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            {/* Grainy Noise Overlay */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            ></div>
            {/* Beautiful Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-400 opacity-90 -z-10"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 rounded-full p-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm tracking-wide">Resume created successfully! Redirecting...</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/50 bg-zinc-900/50">
          <h2 className="text-xl font-bold bg-linear-to-r from-green-50 via-emerald-500 to-green-200 bg-clip-text text-transparent flex items-center gap-2">
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create a Resume"
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
        
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <input 
              type="text" 
              placeholder="Enter resume title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
            />
          </div>
          
          <button 
            onClick={handleCreate}
            disabled={!title.trim()}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300"
          >
            Create Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateResumeModal;
