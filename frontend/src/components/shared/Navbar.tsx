import React from 'react';
import { Link } from 'react-router'; 
import { Zap, Activity } from 'lucide-react';
import { useAuthStore } from '../../store/useAuth.store';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/10 backdrop-blur-sm px-4 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/app" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="text-lg font-bold tracking-tight text-zinc-100">
            PrepVector
          </span>
        </Link>
        <div className="flex items-center gap-4">
          
          {/* Attractive Badges - Only shown if authenticated */}
          {user && (
            <div className="hidden sm:flex items-center gap-3 mr-2">
              {/* Credits Badge */}
              <div className="group flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all px-3 py-1.5 rounded-full shadow-sm cursor-default">
                <Zap className="size-3.5 text-emerald-400 fill-emerald-400/20 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-zinc-300">
                  Credits: <span className="text-emerald-400 font-bold tracking-wide">{user.credits || 0}</span>
                </span>
              </div>

              {/* Analysis Badge */}
              <div className="group flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all px-3 py-1.5 rounded-full shadow-sm cursor-default">
                <Activity className="size-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-zinc-300">
                  Analyses Left: <span className="text-emerald-400 font-bold tracking-wide">{20 - (user.reportGenerationCount || 0)}</span>
                </span>
              </div>
            </div>
          )}

          <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-300 cursor-pointer hover:ring-2 hover:ring-emerald-500/50 hover:border-emerald-500 transition-all">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
