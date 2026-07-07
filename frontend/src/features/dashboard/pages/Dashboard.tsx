import { PlusIcon, UploadCloudIcon, Trash2Icon, FileTextIcon, PencilIcon, FileText, ChevronRight, Briefcase, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import CreateResumeModal from '../components/CreateResumeModal' 
import UploadResumeModal from '../components/UploadResumeModal'
import { useGetAllResumes, useDeleteResume, useUpdateResumeTitle } from '../hooks/useDashbaord'
import { useAuthStore } from '../../../store/useAuth.store'
import { useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '../../../store/toastStore'
import { useGetAllReports } from '../../evaluator/hooks/useEvaluator'
import { useGetMyInterviews } from '../../interview/hooks/useInterview'

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  // Real backend data via TanStack Query
  const { data, isLoading, isError } = useGetAllResumes();
  const allResumes = data?.resumes || [];

  const { data: reports, isLoading: isReportsLoading } = useGetAllReports();
  const { data: interviewsData, isLoading: isInterviewsLoading } = useGetMyInterviews();
  const allInterviews = interviewsData?.data || [];
  
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
                            {/* Glowing emerald crosshairs at all 4 corners of every cell */}
                            <svg style={{ filter: "drop-shadow(0px 0px 6px #10b981) drop-shadow(0px 0px 12px #10b981)" }} className="absolute -top-[8px] -left-[8px] text-emerald-500 z-10 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.5"/></svg>
                            <svg style={{ filter: "drop-shadow(0px 0px 6px #10b981) drop-shadow(0px 0px 12px #10b981)" }} className="absolute -top-[8px] -right-[8px] text-emerald-500 z-10 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.5"/></svg>
                            <svg style={{ filter: "drop-shadow(0px 0px 6px #10b981) drop-shadow(0px 0px 12px #10b981)" }} className="absolute -bottom-[8px] -left-[8px] text-emerald-500 z-10 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.5"/></svg>
                            <svg style={{ filter: "drop-shadow(0px 0px 6px #10b981) drop-shadow(0px 0px 12px #10b981)" }} className="absolute -bottom-[8px] -right-[8px] text-emerald-500 z-10 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.5"/></svg>

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

            {/* Analyze Resume Reports Section */}
            <div className="mt-12 mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold bg-linear-to-r from-green-50 via-emerald-500 to-green-50 bg-clip-text text-transparent">Your Analyze Resume Reports</h2>
            </div>
            <hr className='border-zinc-800 mb-6' />

            {isReportsLoading ? (
                <div className="flex justify-center py-10">
                    <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : reports && reports.length > 0 ? (
                <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden mb-12">
                    <div className="flex flex-col">
                        {reports.map((report: any) => (
                            <div 
                                key={report._id}
                                onClick={() => navigate(`/report/${report._id}`)}
                                className="group flex items-center justify-between p-5 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 cursor-pointer transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                                        <FileText className="w-4 h-4 text-emerald-500/70 group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
                                            {report.title || "Interview Strategy Report"}
                                        </h3>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            {new Date(report.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-5">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1">Match</span>
                                        <span className={`text-sm font-bold ${report.matchScore >= 85 ? 'text-emerald-400' : report.matchScore >= 70 ? 'text-orange-400' : 'text-red-400'}`}>
                                            {report.matchScore || 0}%
                                        </span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 text-zinc-500">
                    No mock interview reports found. Generate one from the Analyze Resume page!
                </div>
            )}

            {/* Mock Interview History Section */}
            <div className="mt-12 mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold bg-linear-to-r from-green-50 via-emerald-500 to-green-50 bg-clip-text text-transparent">Your Mock Interview History</h2>
            </div>
            <hr className='border-zinc-800 mb-6' />

            {isInterviewsLoading ? (
                <div className="flex justify-center py-10">
                    <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : allInterviews && allInterviews.length > 0 ? (
                <div className="grid gap-4 mb-12">
                    {allInterviews.map((interview: any) => {
                        const isCompleted = interview.status === 'Completed';
                        const date = new Date(interview.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });
                        const score = interview.finalScore || 0;
                        const normalizedScore = (score > 10 ? score / 10 : score).toFixed(1);

                        return (
                            <div
                                key={interview._id}
                                onClick={() => isCompleted && navigate(`/app/interview-report/${interview._id}`)}
                                className={`group relative bg-zinc-950 rounded-2xl border border-zinc-800 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 ${
                                    isCompleted 
                                        ? 'hover:bg-zinc-900/50 hover:border-emerald-500/30 cursor-pointer'
                                        : 'opacity-70 cursor-default'
                                }`}
                            >
                                <div className="flex-1 min-w-0 mb-6 sm:mb-0 relative z-10">
                                    <h3 className="text-lg font-bold text-zinc-100 truncate mb-2 group-hover:text-emerald-400 transition-colors">
                                        {interview.role}
                                    </h3>
                                    <div className="flex items-center text-xs font-medium text-zinc-400 gap-3 flex-wrap">
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                                            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                                            {interview.experience} Exp
                                        </span>
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                                            {interview.mode || "Technical"}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                            {date}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 sm:gap-8 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end relative z-10 border-t sm:border-t-0 border-zinc-800 pt-5 sm:pt-0">
                                    <div className="text-center sm:text-right">
                                        <div className="flex items-baseline gap-1 justify-center sm:justify-end mb-1">
                                            <span className="text-2xl font-black text-zinc-100 leading-none tracking-tight group-hover:text-emerald-500 transition-colors">
                                                {normalizedScore}
                                            </span>
                                            <span className="text-xs font-bold text-zinc-500">/ 10</span>
                                        </div>
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                                            Score
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                                            isCompleted
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                            {isCompleted ? 'Completed' : 'Incomplete'}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 text-zinc-500">
                    No mock interviews found. Start an interview to see your reports here!
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

