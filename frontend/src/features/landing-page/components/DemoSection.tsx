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
    const [showToast, setShowToast] = useState(false);
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
            setShowToast(false);
            setIsPulsing(false);
            setActiveField(null);
            
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

            // T+1.5s: Type Name
            timeouts.push(setTimeout(() => {
                setActiveField('name');
                nameRef.current?.focus();
                typeText("Samarth Pagaria", setName, 60, () => setActiveField(null));
            }, 1500));

            // T+4s: Type Skills
            timeouts.push(setTimeout(() => {
                setActiveField('skills');
                skillsRef.current?.focus();
                typeText("React, Node.js, TypeScript", setSkills, 50, () => setActiveField(null));
            }, 4000));

            // T+6s: Type Experience
            timeouts.push(setTimeout(() => {
                setActiveField('experience');
                expRef.current?.focus();
                typeText("Built AI Resume Analyzer using Langchain & Express", setExperience, 40, () => setActiveField(null));
            }, 6500));

            // T+9s: Show Toast
            timeouts.push(setTimeout(() => {
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                setShowToast(true);
                timeouts.push(setTimeout(() => setShowToast(false), 2000));
            }, 9000));

            // T+9.5s: Pulse Save Button
            timeouts.push(setTimeout(() => {
                setIsPulsing(true);
                timeouts.push(setTimeout(() => setIsPulsing(false), 2000));
            }, 9500));

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
        <section className="relative bg-[#F9FFFC] py-20 overflow-hidden">
            {/* Background Texture */}
            <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Column: Text & Timeline */}
                    <div className="flex flex-col items-start pr-0 md:pr-10">
                        {/* Badge */}
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#0A5C36] text-xs font-bold uppercase tracking-widest mb-6">
                            ✨ Resume Builder
                        </div>
                        
                        {/* Heading */}
                        <h2 className="font-mono text-4xl md:text-5xl text-[#1A2E24] font-bold leading-tight mb-4 tracking-tight">
                            Build a resume that doesn't feel like homework.
                        </h2>
                        
                        {/* Description */}
                        <p className="text-gray-600 max-w-sm text-[1.1rem] leading-relaxed mb-6 font-mono">
                            Create an ATS-optimized, beautifully formatted resume in minutes without ever fighting with margins or layout blocks.
                        </p>

                        {/* Steps Timeline */}
                        <div className="relative pl-6 flex flex-col gap-8 border-l-2 border-gray-200 mt-4 ml-2">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                                    className="relative"
                                >
                                    {/* Step Dot */}
                                    <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-[#0A5C36] ring-4 ring-[#F9FFFC]" />
                                    
                                    <h4 className="text-[#1A2E24] font-bold text-lg font-mono mb-1">{step.title}</h4>
                                    <p className="text-gray-500 text-sm font-mono">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button className="bg-[#0A5C36] text-white px-8 py-4 rounded-xl font-mono font-semibold hover:bg-[#1A7A4A] transition-all hover:-translate-y-0.5 hover:shadow-xl mt-12">
                            Start Building →
                        </button>
                    </div>
                    
                    {/* Right Column: Browser Mockup Cluster */}
                    <div className="relative">
                        {/* Browser Mockup */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative rounded-xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-200/50 bg-white transform -translate-y-1 hover:-translate-y-2 transition-transform duration-300"
                        >
                        {/* Save Toast Notification */}
                        <AnimatePresence>
                            {showToast && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20, x: 20 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    exit={{ opacity: 0, y: -10, x: 20 }}
                                    className="absolute top-14 right-4 bg-[#2ECC71] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xl z-50 flex items-center gap-2 font-mono"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Saved!
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Top Bar */}
                        <div className="bg-[#1A1E24] py-3 px-4 flex justify-between items-center relative z-10">
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
                            
                            {/* Save Button */}
                            <motion.div 
                                animate={isPulsing ? { scale: [1, 1.2, 1], color: ['#2ECC71', '#4ADE80', '#2ECC71'] } : {}}
                                transition={{ duration: 0.4 }}
                                className="text-[#2ECC71] text-sm font-semibold font-mono"
                            >
                                Save ✓
                            </motion.div>
                        </div>

                        {/* Body (Split Pane) */}
                        <div className="flex flex-col md:flex-row h-auto md:h-[480px]">
                            {/* Left Pane (Form) */}
                            <div className="w-full md:w-[45%] h-[300px] md:h-auto p-4 md:p-6 bg-white flex flex-col gap-4 overflow-y-auto pointer-events-none">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                                    <div className="relative">
                                        <input 
                                            ref={nameRef}
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Samarth Pagaria"
                                            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:border-[#0A5C36] focus:ring-1 focus:ring-[#0A5C36] outline-none transition-colors font-mono bg-white"
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
                                            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:border-[#0A5C36] focus:ring-1 focus:ring-[#0A5C36] outline-none transition-colors font-mono bg-white"
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
                                            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:border-[#0A5C36] focus:ring-1 focus:ring-[#0A5C36] outline-none transition-colors font-mono resize-none bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Pane (Live Preview) */}
                            <div className="w-full md:w-[55%] h-[300px] md:h-auto p-4 md:p-6 bg-[#F9FAFB] border-t md:border-t-0 md:border-l border-gray-200 overflow-y-auto pointer-events-none">
                                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 min-h-full">
                                    <h3 className="text-xl font-bold text-[#1A2E24] mb-4 font-mono border-b border-gray-100 pb-2">
                                        {name || "Your Name"}
                                    </h3>
                                    
                                    <div className="mb-6">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills ? (
                                                skills.split(',').map((skill, i) => skill.trim() && (
                                                    <span key={i} className="px-2 py-1 bg-[#E8F5E9] text-[#0A5C36] text-[10px] font-semibold rounded-md border border-green-200">
                                                        {skill.trim()}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-300 text-sm italic font-mono">Skills appear here</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Experience</h4>
                                        <p className="text-sm text-gray-600 font-mono leading-relaxed whitespace-pre-wrap">
                                            {experience || <span className="text-gray-300 italic">Experience text goes here...</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Cards (Desktop) & Inline Badges (Mobile) */}
                    
                    {/* Mobile Badges */}
                    <div className="flex md:hidden flex-wrap justify-center gap-3 mt-6">
                        <div className="bg-white shadow-sm rounded-full px-4 py-2 border border-gray-100 text-xs font-medium text-[#1A2E24] font-mono flex items-center">
                            <span className="text-[#2ECC71] mr-1 text-sm leading-none">✓</span> Live Preview
                        </div>
                        <div className="bg-white shadow-sm rounded-full px-4 py-2 border border-gray-100 text-xs font-medium text-[#1A2E24] font-mono flex items-center">
                            <span className="text-[#2ECC71] mr-1 text-sm leading-none">✓</span> Multiple Templates
                        </div>
                        <div className="bg-white shadow-sm rounded-full px-4 py-2 border border-gray-100 text-xs font-medium text-[#1A2E24] font-mono flex items-center">
                            <span className="text-[#2ECC71] mr-1 text-sm leading-none">✓</span> ATS Friendly
                        </div>
                    </div>

                    {/* Desktop Floating Cards */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                        className="absolute top-[-20px] right-[-30px] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-full px-5 py-2.5 border border-gray-100 text-sm font-medium text-[#1A2E24] font-mono z-20 hidden md:flex items-center"
                    >
                        <span className="text-[#2ECC71] mr-1 text-lg leading-none">✓</span> Live Preview
                    </motion.div>
                    
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute bottom-[-20px] left-[-40px] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-full px-5 py-2.5 border border-gray-100 text-sm font-medium text-[#1A2E24] font-mono z-20 hidden md:flex items-center"
                    >
                        <span className="text-[#2ECC71] mr-1 text-lg leading-none">✓</span> Multiple Templates
                    </motion.div>
                    
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[-10px] right-[-20px] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-full px-5 py-2.5 border border-gray-100 text-sm font-medium text-[#1A2E24] font-mono z-20 hidden md:flex items-center"
                    >
                        <span className="text-[#2ECC71] mr-1 text-lg leading-none">✓</span> ATS Friendly
                    </motion.div>
                </div>

                </div>
            </div>
        </section>
    );
};

export default DemoSection;
