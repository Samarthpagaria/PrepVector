import React from 'react';
import { useToastStore } from '../../store/toastStore';

const GlobalToast: React.FC = () => {
  const { isOpen, message, type } = useToastStore();

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
      <div 
        className={`relative overflow-hidden px-6 py-3 rounded-full border shadow-[0_0_20px_rgba(0,0,0,0.2)] ${
          isSuccess ? 'border-emerald-500/30' : 'border-red-500/30'
        }`}
      >
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
        
        <div 
          className={`absolute inset-0 opacity-90 -z-10 bg-gradient-to-r ${
            isSuccess ? 'from-emerald-600 to-green-400' : 'from-red-600 to-rose-500'
          }`}
        ></div>
        
        <div className="flex items-center gap-3 relative z-10">
          {isSuccess && (
            <div className="bg-white/20 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <span className="text-white font-medium text-sm tracking-wide">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalToast;
