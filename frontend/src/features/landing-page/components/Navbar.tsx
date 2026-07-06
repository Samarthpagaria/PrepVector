import { Link } from "react-router";
import { FileText, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import lottieLogoUrl from '../../../assets/prepVectorLogo.lottie?url';
import { GradientButton } from '../../../components/ui/gradient-button';

const GithubIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const Navbar = () => {
    const [isDark, setIsDark] = useState(true); 

    return (
        <nav className="sticky top-0 z-50 w-full flex items-center justify-between py-3 px-6 border-b border-zinc-800 bg-black/40 backdrop-blur-md shadow-sm">
            {/* Left side: Actual Logo and Same Font */}
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
                    <div className="w-7 h-7 flex items-center justify-center">
                        <DotLottieReact
                            src={lottieLogoUrl}
                            loop
                            autoplay
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white font-mono">
                        PrepVector
                    </span>
                </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 pr-4 border-r border-gray-800">
                    {/* GitHub Icon Button */}
                    <a href="https://github.com" target="_blank" rel="noreferrer" 
                       className="w-8 h-8 flex items-center justify-center rounded-lg border border-green-500/30 text-white hover:bg-green-500/10 hover:border-green-500 transition-all">
                        <GithubIcon className="w-4 h-4" />
                    </a>
                    
                    {/* Docs Icon Button */}
                    <Link to="/docs" 
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-cyan-500/30 text-white hover:bg-cyan-500/10 hover:border-cyan-500 transition-all">
                        <FileText className="w-4 h-4" />
                    </Link>
                    
                    {/* Theme Toggle Button */}
                    <button onClick={() => setIsDark(!isDark)} 
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-orange-500/30 text-white hover:bg-amber-500/10 hover:border-amber-500 transition-all">
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Analyze Resume Button using GradientButton */}
                    <GradientButton asChild className="px-4 py-1.5 h-auto text-xs font-bold font-mono border-0 min-w-0 rounded-lg">
                        <Link to="/test" className="group">
                            <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay pointer-events-none rounded-lg" />
                            <span className="relative z-10">Analyze Resume</span>
                        </Link>
                    </GradientButton>
                    
                    <Link 
                        to="/sign-in" 
                        className="relative block overflow-hidden px-4 py-1.5 rounded-full font-bold font-mono text-xs tracking-wide text-emerald-950"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-white to-emerald-200 animate-gradient-x" />
                        <div className="absolute inset-0 bg-noise opacity-70 mix-blend-overlay pointer-events-none" />
                        <span className="relative z-10 flex items-center justify-center gap-1">
                            Sign In
                        </span>
                    </Link>
                </div>
                </div>
         
        </nav>
    );
};

export default Navbar;
