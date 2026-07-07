import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import AnimatedGradientBackground from '../../../components/ui/animated-gradient-background';

const ROTATING_PHRASES = [
    "get you hired.",
    "beat the ATS.",
    "sound job-ready.",
    "impress recruiters.",
    "Prep by Job Description.",
    "Prepare With Analysis.",
];

const TYPING_SPEED = 55;
const DELETING_SPEED = 28;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_DELETE = 300;

const TypewriterText = () => {
    const [displayText, setDisplayText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const currentPhrase = ROTATING_PHRASES[phraseIndex];
        const tick = () => {
            if (!isDeleting) {
                if (displayText.length < currentPhrase.length) {
                    setDisplayText(currentPhrase.slice(0, displayText.length + 1));
                    timeoutRef.current = setTimeout(tick, TYPING_SPEED);
                } else {
                    timeoutRef.current = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                    timeoutRef.current = setTimeout(tick, DELETING_SPEED);
                } else {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
                    timeoutRef.current = setTimeout(tick, PAUSE_AFTER_DELETE);
                }
            }
        };
        timeoutRef.current = setTimeout(tick, TYPING_SPEED);
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [displayText, isDeleting, phraseIndex]);

    return (
        <span className="inline-flex items-baseline">
            <span
                className="font-mono font-bold"
                style={{
                    background: 'linear-gradient(90deg, #6ee7b7 0%, #34d399 40%, #10b981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    minWidth: '1ch',
                }}>
                {displayText}
            </span>
            <span className="ml-[2px] inline-block w-[1.5px] h-[0.85em] rounded-full bg-emerald-400 animate-pulse align-middle" />
        </span>
    );
};

const HeroSection = () => {
    return (
        <section className="relative w-full flex flex-col items-center justify-center px-6 overflow-hidden h-[70vh]">
            <AnimatedGradientBackground
                Breathing={true}
                animationSpeed={0.015}
                breathingRange={4}
                startingGap={80}
                topOffset={20}
                gradientColors={[
                    "transparent",
                    "#050505",
                    "#052e16",
                    "#065f46",
                    "#0d9488",
                    "#4ade80",
                    "#86efac",
                    "#bbf7d0",
                ]}
                gradientStops={[25, 40, 64, 76, 85, 92, 97, 100]}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl mx-auto -mt-6 px-2">

                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-950/30">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-medium text-emerald-400 tracking-[0.15em] uppercase">
                        AI-Powered Career Tool
                    </span>
                </div>

                {/* Headline */}
                <h1
                    className="font-mono font-bold leading-snug tracking-tight text-white mb-3"
                    style={{ fontSize: 'clamp(1.2rem, 2.8vw, 2rem)' }}
                >
                    Land your next job with a resume and <br/>interview prep that actually{' '}
                    <TypewriterText />
                </h1>

                {/* Subheadline */}
                <p className="font-mono text-xs text-white max-w-xl leading-relaxed mb-7 tracking-wide">
                    Build an{' '}
                    <span className="text-emerald-300 font-medium">ATS-optimized resume</span>,
                    {' '}sharpen every bullet with{' '}
                    <span className="text-emerald-300 font-medium">AI</span>,
                    {' '}and practice with an{' '}
                    <span className="text-emerald-300 font-medium">AI interviewer</span>
                    {' '}that scores you like a{' '}
                    <span className="text-white font-medium">hiring manager</span> would.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <Link
                        to="/sign-in"
                        className="group relative inline-flex items-center gap-1.5 px-5 py-2 rounded-lg font-mono font-bold text-xs text-zinc-950 overflow-hidden transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 animate-gradient-x" />
                        <span className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay" />
                        <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ boxShadow: '0 0 18px rgba(52,211,153,0.4)' }} />
                        <span className="relative z-10 flex items-center gap-1.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Build My Resume — Free
                        </span>
                    </Link>

                    <div className="relative group rounded-lg p-[1px]  transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
                        <Link
                            to="/sign-in"
                            className="relative flex items-center gap-1.5 px-5 py-2 rounded-[7px] font-mono font-semibold text-xs bg-zinc-950/80 backdrop-blur-md hover:bg-zinc-900/80 transition-colors"
                        >
                            <span className="flex items-center gap-1.5 ">
                                <svg className="w-3 h-3 text-white " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Try a Mock Interview
                            </span>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
