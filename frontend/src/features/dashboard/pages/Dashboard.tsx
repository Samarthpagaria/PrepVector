import { PlusIcon, UploadCloudIcon, Trash2Icon, FileTextIcon, PencilIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import CreateResumeModal from '../components/CreateResumeModal' 
import UploadResumeModal from '../components/UploadResumeModal'
import { useGetAllResumes, useDeleteResume, useUpdateResumeTitle } from '../hooks/useDashbaord'
import { useAuthStore } from '../../../store/useAuth.store'
import { useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '../../../store/toastStore'

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  // Real backend data via TanStack Query
  const { data, isLoading, isError } = useGetAllResumes();
  const allResumes = data?.resumes || [];
  
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const openToast = useToastStore(state => state.openToast);

  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();
  const { mutate: updateTitle, isPending: isUpdating } = useUpdateResumeTitle();

  const handleDelete = (e: React.MouseEvent, resumeId: string) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this resume?")) {
          deleteResume(resumeId, {
              onSuccess: () => {
                  openToast("Resume deleted successfully");
                  queryClient.invalidateQueries({ queryKey: ["allResumes"] });
              },
              onError: () => {
                  openToast("Failed to delete resume", "error");
              }
          });
      }
  };

  const handleEditSubmit = (e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent, resumeId: string) => {
      e.stopPropagation();
      if (!editTitle.trim()) {
          setEditingResumeId(null);
          return;
      }
      
      updateTitle({ resumeId, title: editTitle }, {
          onSuccess: () => {
              openToast("Title updated");
              queryClient.invalidateQueries({ queryKey: ["allResumes"] });
              setEditingResumeId(null);
          },
          onError: () => {
              openToast("Failed to update title", "error");
              setEditingResumeId(null);
          }
      });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className='max-w-7xl mx-auto px-4 py-6 lg:py-8'>
            <div className="flex justify-between items-center mb-6">
                <h1 className='text-2xl font-bold bg-linear-to-r from-green-50 via-emerald-500 to-green-50 bg-clip-text text-transparent'>
                    Welcome, {user?.name || user?.username || 'User'}
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

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : isError || !user ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
                    <div className="p-4 bg-red-500/10 text-red-400 rounded-full">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-zinc-300">Authentication Error</h3>
                        <p className="mt-1 text-sm">Please log in to view and manage your resumes.</p>
                    </div>
                </div>
            ) : allResumes.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">
                    No resumes found. Create or upload one to get started!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-zinc-800 border border-zinc-800">
                    {allResumes.map((resume: any) => (
                        <div 
                            key={resume._id}
                            onClick={() => navigate(`/app/builder/${resume._id}`)}
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
                                
                                <div className="flex gap-1 z-20">
                                    <button 
                                        className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingResumeId(resume._id);
                                            setEditTitle(resume.title);
                                        }}
                                        title="Edit Title"
                                    >
                                        <PencilIcon className="size-4" />
                                    </button>
                                    <button 
                                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                                        onClick={(e) => handleDelete(e, resume._id)}
                                        disabled={isDeleting}
                                        title="Delete Resume"
                                    >
                                        <Trash2Icon className="size-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mt-3 relative z-30">
                                {editingResumeId === resume._id ? (
                                    <input 
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onBlur={(e) => handleEditSubmit(e, resume._id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleEditSubmit(e, resume._id);
                                            } else if (e.key === 'Escape') {
                                                setEditingResumeId(null);
                                            }
                                        }}
                                        disabled={isUpdating}
                                        autoFocus
                                        className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-2 py-1 rounded-xl text-base font-semibold focus:outline-none focus:border-emerald-500"
                                    />
                                ) : (
                                    <h3 
                                        className="font-semibold text-zinc-100 text-base line-clamp-2 group-hover:text-emerald-400 transition-colors"
                                    >
                                        {resume.title || 'Untitled Resume'}
                                    </h3>
                                )}
                                
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20 ring-inset">
                                        Updated {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <CreateResumeModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)} 
        />
        <UploadResumeModal
            isOpen={showUploadResume}
            onClose={() => setShowUploadResume(false)}
        />
    </div>
  )
}

export default Dashboard

