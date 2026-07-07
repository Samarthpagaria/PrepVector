import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

type InterviewStep = 'idle' | 'asking' | 'listening' | 'transcribing' | 'evaluating' | 'next';

const features = [
    {
        icon: "🎯",
        title: "Role-Based Interviews",
        desc: "Practice for Frontend, Backend, Full Stack, AI/ML, Data Science, and more."
    },
    {
        icon: "💬",
        title: "Dynamic Follow-ups",
        desc: "The AI asks intelligent follow-up questions based on your previous responses."
    },
    {
        icon: "📊",
        title: "Real-Time Evaluation",
        desc: "Get instant scores for confidence, communication, and technical accuracy."
    },
    {
        icon: "📈",
        title: "Comprehensive Reports",
        desc: "Receive a detailed AI performance report with scores, strengths, weaknesses, and personalized improvement tips."
    }
];

const MockInterviewSection = () => {
    const [step, setStep] = useState<InterviewStep>('idle');
    const [typedText, setTypedText] = useState('');
    const [typedAnswer, setTypedAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const [transcribeProgress, setTranscribeProgress] = useState(0);
    const [currentQ, setCurrentQ] = useState(1);
    const [feedback, setFeedback] = useState('');

    // Auto-Demo Sequence
    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];
        let intervals: NodeJS.Timeout[] = [];

        const typeText = (text: string, baseSpeed = 40, onComplete?: () => void) => {
            let i = 0;
            setTypedText('');
            
            const typeNext = () => {
                setTypedText(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    if (onComplete) onComplete();
                } else {
                    const variance = Math.random() * 30; 
                    const t = setTimeout(typeNext, baseSpeed + variance);
                    timeouts.push(t);
                }
            };
            
            const initialT = setTimeout(typeNext, baseSpeed);
            timeouts.push(initialT);
        };

        const runSequence = () => {
            // Reset
            setStep('idle');
            setTypedText('');
            setTypedAnswer('');
            setTimeLeft(300);
            setTranscribeProgress(0);
            setCurrentQ(1);
            setFeedback('');

            // Step 1: Asking (T+1s)
            timeouts.push(setTimeout(() => {
                setStep('asking');
                typeText("Tell me about yourself and your experience with React.", 40, () => {
                    // Step 2: Listening (T+4s approx)
                    timeouts.push(setTimeout(() => {
                        setStep('listening');
                        
                        // Timer logic
                        let time = 300;
                        const timer = setInterval(() => {
                            time -= 1; // tick down 1 second
                            setTimeLeft(time);
                        }, 50); // fast countdown for demo
                        intervals.push(timer);

                        // User answering logic
                        timeouts.push(setTimeout(() => {
                            const answerStr = "I've been working with React for 4 years, building complex dashboards and optimizing performance.";
                            let charIdx = 0;
                            const answerTimer = setInterval(() => {
                                setTypedAnswer(answerStr.slice(0, charIdx + 1));
                                charIdx++;
                                if (charIdx >= answerStr.length) {
                                    clearInterval(answerTimer);
                                    clearInterval(timer);
                                    
                                    // Step 3: Transcribing
                                    timeouts.push(setTimeout(() => {
                                        setStep('transcribing');
                                        let progress = 0;
                                        const progTimer = setInterval(() => {
                                            progress += 5;
                                            setTranscribeProgress(progress);
                                            if (progress >= 100) {
                                                clearInterval(progTimer);
                                                
                                                // Step 4: Evaluating
                                                timeouts.push(setTimeout(() => {
                                                    setStep('evaluating');
                                                    setFeedback("Great concise answer! You highlighted your years of experience and specific domains you've worked on.");
                                                    
                                                    // Step 5: Next
                                                    timeouts.push(setTimeout(() => {
                                                        setStep('next');
                                                        setTypedText('');
                                                        setTypedAnswer('');
                                                        setTimeLeft(300);
                                                        setFeedback('');
                                                        setCurrentQ(2);
                                                        typeText("Describe a challenging bug you recently fixed.", 40);
                                                        
                                                        // Restart Loop
                                                        timeouts.push(setTimeout(runSequence, 5000));
                                                    }, 4000));
                                                }, 500));
                                            }
                                        }, 100);
                                        intervals.push(progTimer);
                                    }, 500));
                                }
                            }, 30);
                            intervals.push(answerTimer);
                        }, 500));
                    }, 1000));
                });
            }, 1000));
        };

        runSequence();

        return () => {
            timeouts.forEach(clearTimeout);
            intervals.forEach(clearInterval);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className="relative pt-12 pb-20 overflow-hidden bg-[#050505]">
            {/* Background Texture & Floating Elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#2ECC71] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <div className="flex flex-col gap-16 items-center">
                    
                    {/* Top Content: Text & Checklist */}
                    <div className="flex flex-col w-full">
                        {/* Badge */}
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 text-white border border-white/30 text-xs font-bold uppercase tracking-widest mb-6 w-max">
                            <span className="mr-2 text-lg leading-none">🎤</span> AI Interview Coach
                        </div>
                        
                        {/* Heading */}
                        <h2 className="font-mono text-3xl md:text-3xl text-white font-bold leading-tight mb-8 tracking-tight max-w-3xl">
                            Practice before it counts.
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-12 w-full">
                            {/* Subtext & CTA */}
                            <div className="flex flex-col items-start">
                                <p className="text-gray-400 text-[1.05rem] leading-relaxed mb-3 font-mono">
                                    Experience realistic HR and technical interviews with an AI interviewer that adapts to your role, asks follow-up questions, and scores every answer in real time.
                                </p>
                                <Link to="/sign-in" className=" text-white px-2 py-1 hover:border border-white rounded-full font-mono font-semibold inline-block">
                                    Start a Mock Interview →
                                </Link>
                            </div>

                            {/* Animated Checklist */}
                            <div className="flex flex-col gap-4">
                                {features.map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: idx * 0.4 }}
                                        className="flex items-center gap-3 "
                                    >
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ type: "spring", stiffness: 200, delay: (idx * 0.4) + 0.3 }}
                                            className="w-5 h-5 rounded-full bg-[#2ECC71] flex items-center justify-center shrink-0"
                                        >
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                        
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold font-mono text-sm">{feature.title}</span>
                                            <span className="text-gray-400 font-mono text-xs">{feature.desc}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Content: Mockup */}
                    <div className="relative w-full mt-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-zinc-800 bg-black flex flex-col transform -translate-y-1 hover:-translate-y-2 transition-transform duration-300 pointer-events-none p-4"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5 w-full px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    </div>
                                    <div>
                                        <h1 className="text-sm font-bold text-white tracking-tight">AI Smart Interview</h1>
                                        <p className="text-[10px] text-zinc-400">Candidate: Samarth Pagaria</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-500">Voice:</span>
                                    <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] rounded px-1.5 py-0.5">Female</div>
                                </div>
                            </div>

                            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
                                {/* Left Column: Avatar & Status */}
                                <div className="lg:col-span-4 flex flex-col gap-4">
                                    {/* AI Avatar Display */}
                                    <div className="bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl">
                                        <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-950 relative flex flex-col items-center justify-center p-4">
                                            
                                            {(step === 'asking' || step === 'next') && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-24 h-24 border border-emerald-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                                                    <div className="absolute w-16 h-16 border border-emerald-500/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                                                </div>
                                            )}

                                            <div className={`relative z-10 w-14 h-14 bg-zinc-900 border rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${(step === 'asking' || step === 'next') ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-zinc-700'}`}>
                                                <svg className={`w-7 h-7 ${(step === 'asking' || step === 'next') ? 'text-emerald-400' : 'text-zinc-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>

                                            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                                <span className={`px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-medium border flex items-center gap-1.5 transition-all ${(step === 'asking' || step === 'next') ? 'text-emerald-400 border-emerald-500/30' : 'text-zinc-500 border-zinc-800'}`}>
                                                    <span className={`w-1 h-1 rounded-full ${(step === 'asking' || step === 'next') ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`}></span>
                                                    {(step === 'asking' || step === 'next') ? 'Speaking' : 'Waiting'}
                                                </span>
                                                {(step === 'listening') && (
                                                    <span className="px-2 py-0.5 bg-red-500/10 backdrop-blur-md rounded-full text-[10px] font-medium text-red-400 border border-red-500/30 flex items-center gap-1.5">
                                                        <svg className="w-2.5 h-2.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                                        Listening
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Card */}
                                    <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-4 shadow-xl flex flex-col items-center relative">
                                        <h3 className="text-xs font-semibold text-zinc-400 w-full text-left mb-4">Interview Status</h3>
                                        <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" className="fill-none stroke-zinc-800" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="45" className={`fill-none stroke-emerald-500 transition-all duration-300 ease-linear`} strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * timeLeft) / 300} strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className={`text-xl font-bold ${step === 'listening' ? 'text-white' : 'text-zinc-500'}`}>{formatTime(timeLeft)}</span>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-between items-center px-2 pt-3 border-t border-zinc-800/50">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-bold text-emerald-400">{currentQ}</span>
                                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium mt-1">Current</span>
                                            </div>
                                            <div className="h-6 w-px bg-zinc-800"></div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-bold text-zinc-300">7</span>
                                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium mt-1">Total</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Question & Answer */}
                                <div className="lg:col-span-8 flex flex-col gap-4">
                                    {/* Question Box */}
                                    <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-5 shadow-xl relative overflow-hidden transition-all duration-500">
                                        <div className={`absolute top-0 left-0 w-1 h-full bg-emerald-500`}></div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/10`}>
                                                Question {currentQ} of 7
                                            </span>
                                        </div>
                                        <h2 className="text-lg md:text-xl font-semibold leading-snug text-white">
                                            "{typedText}"<span className="animate-pulse text-[#2ECC71]">|</span>
                                        </h2>
                                    </div>

                                    {/* Answer Input Box */}
                                    <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col min-h-[220px] relative overflow-hidden">
                                        
                                        {step === 'transcribing' && (
                                            <div className="absolute inset-0 bg-[#121214]/80 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center p-5">
                                                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3 font-mono">Transcribing...</h3>
                                                <div className="w-full max-w-[200px] h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${transcribeProgress}%` }} />
                                                </div>
                                            </div>
                                        )}

                                        {step === 'evaluating' && (
                                            <div className="absolute inset-0 bg-[#121214]/95 backdrop-blur-md z-20 rounded-2xl flex flex-col items-center justify-center p-5 gap-2">
                                                <h3 className="text-zinc-400 text-[10px] uppercase tracking-widest mb-2 font-bold font-mono">AI Evaluation</h3>
                                                
                                                <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-2 rounded-lg flex items-center justify-between">
                                                    <span className="text-zinc-300 font-mono text-xs">Confidence</span>
                                                    <div className="flex items-center gap-2 w-1/2 justify-end">
                                                        <div className="w-full max-w-[60px] h-1 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[91%]" /></div>
                                                        <span className="text-emerald-400 font-bold font-mono text-xs min-w-[20px] text-right">91</span>
                                                    </div>
                                                </div>
                                                <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-2 rounded-lg flex items-center justify-between">
                                                    <span className="text-zinc-300 font-mono text-xs">Communication</span>
                                                    <div className="flex items-center gap-2 w-1/2 justify-end">
                                                        <div className="w-full max-w-[60px] h-1 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[88%]" /></div>
                                                        <span className="text-emerald-400 font-bold font-mono text-xs min-w-[20px] text-right">88</span>
                                                    </div>
                                                </div>
                                                <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-2 rounded-lg flex items-center justify-between">
                                                    <span className="text-zinc-300 font-mono text-xs">Correctness</span>
                                                    <div className="flex items-center gap-2 w-1/2 justify-end">
                                                        <div className="w-full max-w-[60px] h-1 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[94%]" /></div>
                                                        <span className="text-emerald-400 font-bold font-mono text-xs min-w-[20px] text-right">94</span>
                                                    </div>
                                                </div>

                                                {feedback && (
                                                    <div className="w-full max-w-sm mt-2 flex items-start gap-2 text-zinc-300 bg-zinc-900 p-3 rounded-lg border border-zinc-700/50 shadow-md">
                                                        <div className="w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center text-zinc-400">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <span className="text-xs font-medium leading-relaxed">{feedback}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className={`w-full flex-1 text-sm leading-relaxed resize-none z-0 ${step === 'listening' ? (typedAnswer ? 'text-white' : 'text-emerald-700/50') : 'text-zinc-600'}`}>
                                            {typedAnswer || (step === 'listening' ? "Speaking to type..." : "Type your answer here...")}
                                        </div>

                                        <div className="flex gap-3 items-center mt-auto">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${step === 'listening' ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_10px_20px_-10px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-[#121214] border border-zinc-800 text-zinc-400'}`}>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                            </div>
                                            
                                            <div className="flex-1 bg-zinc-800 text-zinc-500 font-bold text-sm h-12 rounded-xl flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                                Submit Answer
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MockInterviewSection;
