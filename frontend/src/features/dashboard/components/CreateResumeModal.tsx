import { XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

interface CreateResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateResumeModal: React.FC<CreateResumeModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!title.trim()) return;
    // Generate a pseudo-random ID for the new resume
    const newResumeId = crypto.randomUUID();
    navigate(`/app/builder/${newResumeId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/50 bg-zinc-900/50">
          <h2 className="text-xl font-bold bg-linear-to-r from-green-50 via-emerald-500  to-green-200 bg-clip-text text-transparent">Create a Resume</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
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
