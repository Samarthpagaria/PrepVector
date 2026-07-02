import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router'; 
import { Zap, Activity, LogOut, History, CreditCard, Settings } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAuthStore } from '../../store/useAuth.store';
import lottieLogoUrl from '../../assets/prepVectorLogo.lottie?url';
import { Button } from '../ui/button';
import { logoutUser as logoutUserApi } from '../../features/auth/services/auth.api';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const creditsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (creditsRef.current && !creditsRef.current.contains(event.target as Node)) {
        setShowCreditsPopup(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUserApi();
    } catch (error) {
      console.error("Logout failed on backend", error);
    }
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/10 backdrop-blur-sm px-4 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/app" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="w-8 h-8 flex items-center justify-center">
              <DotLottieReact
                src={lottieLogoUrl}
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-100">
              PrepVector
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          
          {/* Attractive Badges - Only shown if authenticated */}
          {user && (
            <div className="hidden sm:flex items-center gap-3 mr-2">
              {/* Credits Badge */}
              <div className="relative" ref={creditsRef}>
                <button 
                  onClick={() => setShowCreditsPopup(!showCreditsPopup)}
                  className="group flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all px-3 py-1.5 rounded-full shadow-sm cursor-pointer"
                >
                  <Zap className="size-3.5 text-emerald-400 fill-emerald-400/20 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-zinc-300">
                    Credits: <span className="text-emerald-400 font-bold tracking-wide">{user.credits || 0}</span>
                  </span>
                </button>
                
                {/* Credits Popup */}
                {showCreditsPopup && (
                  <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-[#121214] rounded-xl shadow-2xl border border-zinc-800 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-sm text-zinc-300 mb-4 font-medium leading-relaxed">
                      Need more credits to continue interviews?
                    </p>
                    <Button className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-600 rounded-lg shadow-md font-semibold">
                      Buy more credits
                    </Button>
                  </div>
                )}
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

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-300 cursor-pointer hover:ring-2 hover:ring-emerald-500/50 hover:border-emerald-500 transition-all"
              >
                {user.username?.[0]?.toUpperCase() || 'U'}
              </button>
              
              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 p-2 bg-[#121214] rounded-xl shadow-2xl border border-zinc-800 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                    <span className="text-[17px] font-semibold text-emerald-400 tracking-wide">
                      {user.username || 'User'}
                    </span>
                  </div>
                  
                  <button className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 rounded-lg transition-colors text-left font-medium">
                    <History className="size-4 text-zinc-400" />
                    Interview History
                  </button>
                  
                  <button className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 rounded-lg transition-colors text-left font-medium">
                    <CreditCard className="size-4 text-zinc-400" />
                    Pricing
                  </button>
                  
                  <button className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 rounded-lg transition-colors text-left font-medium">
                    <Settings className="size-4 text-zinc-400" />
                    Settings
                  </button>

                  <div className="border-t border-zinc-800/50 my-1"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors text-left font-medium"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-300" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
