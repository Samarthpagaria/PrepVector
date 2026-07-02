import React from 'react';
import { useGetMyInterviews } from '../hooks/useInterview';
import { useNavigate } from 'react-router-dom';
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
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-indigo-600" />
          Interview History
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Track your past interviews and view your performance reports.
        </p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No interviews yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't completed any interviews. Start an interview to see your history here.
          </p>
          <button
            onClick={() => navigate('/app/interview')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Start New Interview
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview: any) => {
            const isCompleted = interview.status === 'Completed';
            const date = new Date(interview.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            // Calculate overall score (either finalScore or calculate from questions)
            const score = interview.finalScore || 0;
            const maxScore = interview.question?.length ? interview.question.length * 10 : 10;
            // Normalize score to 10 if finalScore is out of 100
            const normalizedScore = score > 10 ? Math.round(score / 10) : score;

            return (
              <div
                key={interview._id}
                onClick={() => isCompleted && navigate(`/app/interview-report/${interview._id}`)}
                className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-200 ${
                  isCompleted 
                    ? 'hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer group'
                    : 'opacity-80 cursor-default'
                }`}
              >
                <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {interview.role}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 gap-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {interview.experience}
                    </span>
                    <span>&bull;</span>
                    <span>{interview.mode || "Technical"}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-center sm:text-right">
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                        {normalizedScore}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 pb-0.5">/ 10</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                      Overall Score
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {isCompleted ? 'Completed' : 'Incomplete'}
                    </div>

                    {isCompleted && (
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors hidden sm:block" />
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
