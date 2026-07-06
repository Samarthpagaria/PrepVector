import React from 'react';
import { Link } from 'react-router';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import lottieLogoUrl from '../../../assets/prepVectorLogo.lottie?url';
import { GradientButton } from '../../../components/ui/gradient-button';

const FooterSection = () => {
    return (
        <footer className="w-full bg-black py-8 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
            <div className="max-w-6xl mx-auto bg-[#0a0a0a] border border-zinc-800 rounded-3xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

                {/* Left: Logo */}
                <div className="flex items-center gap-1.5 shrink-0 z-10">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <DotLottieReact
                            src={lottieLogoUrl}
                            loop
                            autoplay
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                    <span className="font-sans font-bold text-lg tracking-tight text-white">PrepVector</span>
                </div>

                {/* Middle: Copyright */}
                <div className="text-zinc-500 text-sm font-mono text-center z-10">
                    © {new Date().getFullYear()} PrepVector. All rights reserved.
                </div>

                {/* Right: Signup Button */}
                <div className="shrink-0 z-10">
                    <Link to="/auth/signup">
                        <GradientButton className="h-10 px-6 py-2 rounded-xl text-sm font-bold font-mono">
                            Get Started
                        </GradientButton>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
