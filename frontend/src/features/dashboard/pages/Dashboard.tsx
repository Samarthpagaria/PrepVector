import { PlusIcon, UploadCloudIcon, Trash2Icon, FileTextIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import CreateResumeModal from '../components/CreateResumeModal' 
import UploadResumeModal from '../components/UploadResumeModal'
import { useGenerateResume } from '../hooks/useDashbaord'


const Dashboard = () => {
    const {mutate:generateResume,isPending,isError} = useGenerateResume()
  const [allResumes, setAllResumes] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showUploadResume,setShowUploadResume] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const navigate = useNavigate();

  const handleEditSubmit = (id: string) => {
    setAllResumes(prev => prev.map(r => r.id === id ? { ...r, title: editTitle } : r));
    setEditingResumeId(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className='max-w-7xl mx-auto px-4 py-6 lg:py-8'>
            <div className="flex justify-between items-center mb-6">
                <h1 className='text-2xl font-bold bg-linear-to-r from-green-50 via-emerald-500 to-green-50 bg-clip-text text-transparent'>
                    Welcome, John Doe
                </h1>
            </div>

            {/* Actions */}
            <div className='flex flex-wrap gap-4 mb-8'>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className='group w-full sm:w-40 h-32 flex flex-col items-center justify-center rounded-xl gap-2 bg-zinc-900 border border-dashed border-zinc-700 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 cursor-pointer'>
                    <div className='p-2.5 bg-linear-to-br from-emerald-500 to-green-600 text-white rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300'>
                        <PlusIcon className='size-5' />
                    </div>
                    <p className='text-xs font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors'>Create Resume</p>
                </button>

                <button 
                    onClick={() => setShowUploadResume(true)}
                    className='group w-full sm:w-40 h-32 flex flex-col items-center justify-center rounded-xl gap-2 bg-zinc-900 border border-dashed border-zinc-700 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 cursor-pointer'>
                    <div className='p-2.5 bg-linear-to-br from-emerald-500 to-teal-600 text-white rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300'>
                        <UploadCloudIcon className='size-5' />
                    </div>
                    <p className="text-xs font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors">Upload Existing</p>
                </button> 
            </div>

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold bg-linear-to-r from-green-50 via-emerald-500 to-green-50 bg-clip-text text-transparent">Your Resumes</h2>
            </div>
            
            <hr className='border-zinc-800 mb-6' />

            {/* Resumes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-zinc-800 border border-zinc-800">
                {allResumes.map((resume) => (
                    <div 
                        key={resume.id}
                        onClick={() => navigate(`/app/builder/${resume.id}`)}
                        className="group relative bg-zinc-950 p-5 hover:bg-linear-to-br hover:from-zinc-900 hover:to-emerald-950/40 transition-all duration-300 cursor-pointer flex flex-col aspect-square"
                    >
                        {/* Thin white crosshairs at all 4 corners of every cell */}
                        <PlusIcon className="absolute -top-[8px] -left-[8px] text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.6)] size-4 pointer-events-none z-10" strokeWidth={1} />
                        <PlusIcon className="absolute -top-[8px] -right-[8px] text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.6)] size-4 pointer-events-none z-10" strokeWidth={1} />
                        <PlusIcon className="absolute -bottom-[8px] -left-[8px] text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.6)] size-4 pointer-events-none z-10" strokeWidth={1} />
                        <PlusIcon className="absolute -bottom-[8px] -right-[8px] text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.6)] size-4 pointer-events-none z-10" strokeWidth={1} />

                        {/* Header: Icon & Actions */}
                        <div className="flex justify-between items-start w-full mb-auto">
                            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors shadow-sm">
                                <FileTextIcon className="size-5" />
                            </div>
                            
                            <button 
                                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors z-20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm("Are you sure you want to delete this resume?")) {
                                        setAllResumes(prev => prev.filter(r => r.id !== resume.id));
                                    }
                                }}
                                title="Delete Resume"
                            >
                                <Trash2Icon className="size-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mt-3">
                            {editingResumeId === resume.id ? (
                                <input 
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    onBlur={() => handleEditSubmit(resume.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.stopPropagation();
                                            handleEditSubmit(resume.id);
                                        }
                                    }}
                                    autoFocus
                                    className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-2 py-1 rounded-xl text-base font-semibold focus:outline-none focus:border-emerald-500"
                                />
                            ) : (
                                <h3 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingResumeId(resume.id);
                                        setEditTitle(resume.title);
                                    }}
                                    className="font-semibold text-zinc-100 text-base line-clamp-2 hover:text-emerald-400 transition-colors cursor-text"
                                    title="Click to edit"
                                >
                                    {resume.title}
                                </h3>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20 ring-inset">
                                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <CreateResumeModal 
            isOpen={isCreateModalOpen} 
              onClose={() => setIsCreateModalOpen(false)} 
              allResumes={allResumes}
              setAllResumes={setAllResumes}
        />
        <UploadResumeModal
            isOpen={showUploadResume}
            onClose={() => setShowUploadResume(false)}
        />
    </div>
  )
}

export default Dashboard
