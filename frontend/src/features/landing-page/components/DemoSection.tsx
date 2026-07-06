import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
    { id: 1, title: 'Personal Details', desc: 'Add your core contact info.' },
    { id: 2, title: 'Experience & Skills', desc: 'Showcase your work history.' },
    { id: 3, title: 'Download & Apply', desc: 'Get your ATS-ready PDF.' }
];

const DemoSection = () => {
    // Form State
    const [name, setName] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    
    // Animation State
    const [isPlaying, setIsPlaying] = useState(true);
    const [isPulsing, setIsPulsing] = useState(false);
    const [activeField, setActiveField] = useState<'name' | 'skills' | 'experience' | null>(null);

    // Refs for native focus
    const nameRef = useRef<HTMLInputElement>(null);
    const skillsRef = useRef<HTMLInputElement>(null);
    const expRef = useRef<HTMLTextAreaElement>(null);

    // Auto-Demo Sequence
    useEffect(() => {
        if (!isPlaying) return;

        let timeouts: NodeJS.Timeout[] = [];

        const typeText = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, baseSpeed = 40, onComplete?: () => void) => {
            let i = 0;
            setter('');
            
            const typeNext = () => {
                setter(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    if (onComplete) onComplete();
                } else {
                    // Randomize typing speed for human feel
                    const variance = Math.random() * 50; 
                    const nextSpeed = baseSpeed + variance;
                    const t = setTimeout(typeNext, nextSpeed);
                    timeouts.push(t);
                }
            };
            
            const initialT = setTimeout(typeNext, baseSpeed);
            timeouts.push(initialT);
        };

        const runSequence = () => {
            // T+0s: Reset all
            setName('');
            setSkills('');
            setExperience('');
            setIsPulsing(false);
            setActiveField(null);

            // T+1.5s: Type Name
            timeouts.push(setTimeout(() => {
                setActiveField('name');
                typeText("Samarth Pagaria", setName, 60, () => setActiveField(null));
            }, 1500));

            // T+4s: Type Skills
            timeouts.push(setTimeout(() => {
                setActiveField('skills');
                typeText("React, Node.js, TypeScript", setSkills, 50, () => setActiveField(null));
            }, 4000));

            // T+6s: Type Experience
            timeouts.push(setTimeout(() => {
                setActiveField('experience');
                typeText("Built AI Resume Analyzer using Langchain & Express", setExperience, 40, () => setActiveField(null));
            }, 6500));

            // T+9s: Pulse Save Button & Blur
            timeouts.push(setTimeout(() => {
                setIsPulsing(true);
                timeouts.push(setTimeout(() => setIsPulsing(false), 2000));
            }, 9000));

            // T+12s: Restart Loop
            timeouts.push(setTimeout(() => {
                runSequence();
            }, 12500));
        };

        runSequence();

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, [isPlaying]);

    return (
        <section className="relative pt-12 pb-20 overflow-hidden bg-[#050505]">
            {/* Background Texture */}
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <div className="flex flex-col gap-16 items-center">
                    
                    {/* Top Content: Text & Checklist */}
                    <div className="flex flex-col w-full">
                        {/* Badge */}
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 text-white border border-white/30 text-xs font-bold uppercase tracking-widest mb-6 w-max">
                            <div>Resume Builder</div>
                        </div>
                        
                        {/* Heading */}
                        <h2 className="font-mono text-3xl md:text-3xl text-white font-bold leading-tight mb-8 tracking-tight max-w-3xl">
                            Build a resume that doesn't feel like homework.
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-12 w-full">
                            {/* Subtext & CTA */}
                            <div className="flex flex-col items-start">
                                <p className="text-gray-400 text-[1.05rem] leading-relaxed mb-3 font-mono">
                                    Create an ATS-optimized, beautifully formatted resume in minutes without ever fighting with margins or layout blocks.
                                </p>
                                <button className=" text-white px-2 py-1 hover:border border-white rounded-full font-mono font-semibold ">
                                    Start Building →
                                </button>
                            </div>

                            {/* Animated Checklist */}
                            <div className="flex flex-col gap-4">
                                {steps.map((step, idx) => (
                                    <motion.div
                                        key={step.id}
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
                                            <span className="text-white font-bold font-mono text-sm">{step.title}</span>
                                            <span className="text-gray-400 font-mono text-xs">{step.desc}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom Content: Browser Mockup Cluster */}
                    <div className="relative w-full mt-8">
                        {/* Browser Mockup */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative rounded-xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-800 bg-black transform -translate-y-1 hover:-translate-y-2 transition-transform duration-300"
                        >
                        {/* Top Bar */}
                        <div className="bg-[#050505] border-b border-gray-800 py-3 px-4 flex justify-between items-center relative z-10">
                            {/* Traffic Lights */}
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                            </div>
                            
                            {/* Title */}
                            <div className="text-gray-400 text-sm font-medium font-mono">
                                Resume Builder
                            </div>
                            
                            {/* Save Button & Actions */}
                            <div className="flex items-center gap-4">
                                {/* Extra Builder Actions */}
                                <div className="hidden md:flex items-center gap-3 text-gray-400 font-mono text-xs">
                                    <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        PDF
                                    </span>
                                    <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Templates
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Body (Split Pane) */}
                        <div className="flex flex-col md:flex-row h-auto md:h-[480px]">
                            {/* Left Pane (Form) */}
                            <div className="w-full md:w-[45%] h-[300px] md:h-auto p-4 md:p-6 bg-black flex flex-col gap-4 overflow-y-auto pointer-events-none">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                                    <div className="relative">
                                        <input 
                                            ref={nameRef}
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Samarth Pagaria"
                                            className={`w-full p-2 border rounded-md text-sm text-white outline-none transition-colors font-mono bg-transparent ${activeField === 'name' ? 'border-[#0A5C36] ring-1 ring-[#0A5C36]' : 'border-gray-800'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Skills</label>
                                    <div className="relative">
                                        <input 
                                            ref={skillsRef}
                                            type="text" 
                                            value={skills}
                                            onChange={(e) => setSkills(e.target.value)}
                                            placeholder="React, Node.js, TypeScript"
                                            className={`w-full p-2 border rounded-md text-sm text-white outline-none transition-colors font-mono bg-transparent ${activeField === 'skills' ? 'border-[#0A5C36] ring-1 ring-[#0A5C36]' : 'border-gray-800'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Experience</label>
                                    <div className="relative">
                                        <textarea 
                                            ref={expRef}
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            placeholder="Built AI Resume Analyzer..."
                                            rows={5}
                                            className={`w-full p-2 border rounded-md text-sm text-white outline-none transition-colors font-mono resize-none bg-transparent ${activeField === 'experience' ? 'border-[#0A5C36] ring-1 ring-[#0A5C36]' : 'border-gray-800'}`}
                                        />
                                    </div>
                                </div>
                                
                                <div className="mt-2">
                                    <button className="w-full bg-white text-black py-2.5 rounded-md font-mono text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save Profile
                                    </button>
                                </div>
                            </div>

                            {/* Right Pane (Live Preview) */}
                            <div className="w-full md:w-[55%] h-[300px] md:h-auto p-4 md:p-6 bg-[#0a0a0a] border-t md:border-t-0 md:border-l border-gray-800 overflow-y-auto pointer-events-none">
                                <div className="bg-[#111111] p-4 md:p-6 rounded-lg shadow-sm border border-gray-800 min-h-full">
                                    <h3 className="text-xl font-bold text-white mb-4 font-mono border-b border-gray-800 pb-2">
                                        {name || "Your Name"}
                                    </h3>
                                    
                                    <div className="mb-6">
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills ? (
                                                skills.split(',').map((skill, i) => skill.trim() && (
                                                    <span key={i} className="px-2 py-1 bg-[#1A2E24] text-[#4ADE80] text-[10px] font-semibold rounded-md border border-[#0A5C36]">
                                                        {skill.trim()}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-600 text-sm italic font-mono">Skills appear here</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Experience</h4>
                                        <p className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                                            {experience || <span className="text-gray-600 italic">Experience text goes here...</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Cards (Desktop) & Inline Badges (Mobile) */}
                    
                    {/* Mobile Badges */}
                    <div className="flex md:hidden flex-wrap justify-center gap-3 mt-6">
                        <div className="bg-[#111111] shadow-sm rounded-full px-3 py-1.5 border border-gray-800 text-xs font-medium text-white font-mono flex items-center">
                            <span className="text-[#2ECC71] mr-1 text-sm leading-none">✓</span> 7+ templates
                        </div>
                        <div className="bg-[#111111] shadow-sm rounded-full px-3 py-1.5 border border-gray-800 text-xs font-medium text-white font-mono flex items-center">
                            <span className="text-[#2ECC71] mr-1 text-sm leading-none">✓</span> Auto-Format
                        </div>
                        <div className="bg-[#111111] shadow-sm rounded-full px-3 py-1.5 border border-gray-800 text-xs font-medium text-white font-mono flex items-center">
                            <span className="text-[#2ECC71] mr-1 text-sm leading-none">✓</span> ATS Optimized
                        </div>
                    </div>

                    {/* Desktop Floating Cards */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                        className="absolute top-[40px] right-[-45px] rotate-6 bg-[#111111] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-full px-3 py-1.5 border border-gray-800 text-xs font-medium text-white font-mono z-20 hidden md:flex items-center"
                    >
                        <span className="text-[#2ECC71] mr-1 text-sm leading-none">✓</span> Real-time Sync
                    </motion.div>
                    
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute bottom-[-20px] left-[-40px] -rotate-3 bg-[#111111] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-full px-3 py-1.5 border border-gray-800 text-xs font-medium text-white font-mono z-20 hidden md:flex items-center"
                    >
                        <span className="text-[#2ECC71] mr-1 text-sm leading-none">✓</span> Auto-Format
                    </motion.div>
                    
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[-10px] right-[-20px] rotate-[4deg] bg-[#111111] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-full px-3 py-1.5 border border-gray-800 text-xs font-medium text-white font-mono z-20 hidden md:flex items-center"
                    >
                        <span className="text-[#2ECC71] mr-1 text-sm leading-none">✓</span> ATS Optimized
                    </motion.div>
                </div>

                </div>
            </div>
        </section>
    );
};

export default DemoSection;
