import React from 'react';
import { useGetMyInterviews } from '../hooks/useInterview';
import { useNavigate } from 'react-router';
import { Clock, Briefcase, Calendar, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import Loader from '../../../components/shared/Loader';

const InterviewHistory = () => {
  const { data, isLoading, error } = useGetMyInterviews();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader text="Loading your interviews..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-red-500">Failed to load interviews. Please try again later.</p>
      </div>
    );
  }

  const interviews = data?.data || [];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold flex items-center gap-4 mb-3 tracking-tight">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            Interview History
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Track your past mock interviews and review your performance reports.
        </p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-white dark:bg-[#121214] rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 p-16 text-center transition-all">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Clock className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No interviews yet</h3>
          <p className="text-gray-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
            You haven't completed any mock interviews. Start an interview to see your detailed AI-generated reports here.
          </p>
          <button
            onClick={() => navigate('/app/interview')}
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1"
          >
            Start New Interview
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {interviews.map((interview: any) => {
            const isCompleted = interview.status === 'Completed';
            const date = new Date(interview.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            // Format score properly
            const score = interview.finalScore || 0;
            const normalizedScore = (score > 10 ? score / 10 : score).toFixed(1);

            return (
              <div
                key={interview._id}
                onClick={() => isCompleted && navigate(`/app/interview-report/${interview._id}`)}
                className={`group relative bg-white dark:bg-[#121214] rounded-3xl border border-gray-100 dark:border-zinc-800/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 ${
                  isCompleted 
                    ? 'hover:shadow-2xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:-translate-y-1 cursor-pointer'
                    : 'opacity-70 cursor-default'
                }`}
              >
                {/* Subtle Glow on Hover */}
                {isCompleted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
                )}
                
                <div className="flex-1 min-w-0 mb-6 sm:mb-0 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate mb-2">
                    {interview.role}
                  </h3>
                  <div className="flex items-center text-sm font-medium text-gray-500 dark:text-zinc-400 gap-3 flex-wrap">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-zinc-800/50 rounded-lg">
                      <Briefcase className="w-4 h-4 text-emerald-500" />
                      {interview.experience} Exp
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-zinc-800/50 rounded-lg">
                      {interview.mode || "Technical"}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-zinc-800/50 rounded-lg">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      {date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end relative z-10 border-t sm:border-t-0 border-gray-100 dark:border-zinc-800 pt-6 sm:pt-0">
                  <div className="text-center sm:text-right">
                    <div className="flex items-baseline gap-1 justify-center sm:justify-end mb-1">
                      <span className="text-3xl font-black text-gray-900 dark:text-white leading-none tracking-tight group-hover:text-emerald-500 transition-colors">
                        {normalizedScore}
                      </span>
                      <span className="text-sm font-bold text-gray-400 dark:text-zinc-500">/ 10</span>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
                      Overall Score
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase flex items-center gap-2 ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isCompleted ? 'Completed' : 'Incomplete'}
                    </div>

                    {isCompleted && (
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 hidden sm:flex">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
