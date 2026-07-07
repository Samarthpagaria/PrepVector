import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        title: "Guided Resume Builder",
        desc: "Build your resume step by step with dedicated sections for Personal Details, Summary, Skills, Experience, Projects, and Education.",
        colSpan: "md:col-span-2"
    },
    {
        title: "Live Resume Preview",
        desc: "See every change instantly with a real-time preview—no surprises when you're ready to export.",
        colSpan: "md:col-span-1"
    },
    {
        title: "AI Resume Extraction",
        desc: "Paste your existing resume and let AI automatically organize it into a structured, editable profile.",
        colSpan: "md:col-span-1"
    },
    {
        title: "AI Bullet Enhancement",
        desc: "Transform generic bullet points into ATS-friendly, impact-driven achievements with AI.",
        colSpan: "md:col-span-2"
    },
    {
        title: "AI Mock Interviews",
        desc: "Practice realistic HR and technical interviews tailored to your target role and experience level.",
        colSpan: "md:col-span-1"
    },
    {
        title: "AI Interview Reports",
        desc: "Receive detailed scores, skill-gap analysis, strengths, weaknesses, and a personalized improvement roadmap.",
        colSpan: "md:col-span-1"
    },
    {
        title: "Shareable Resume Link",
        desc: "Publish your resume and share a live, always up-to-date link with recruiters.",
        colSpan: "md:col-span-1"
    },
    {
        title: "Custom Templates & Themes",
        desc: "Choose from multiple resume templates and personalize them with your preferred accent color.",
        colSpan: "md:col-span-2"
    },
    {
        title: "Pixel-Perfect PDF Export",
        desc: "Export professional PDFs that preserve your design, layout, colors, and spacing.",
        colSpan: "md:col-span-1"
    }
];

const getBorderClasses = (idx: number) => {
    switch(idx) {
        case 0: return "border-b md:border-r border-dashed border-zinc-800";
        case 1: return "border-b border-dashed border-zinc-800";
        case 2: return "border-b md:border-r border-dashed border-zinc-800";
        case 3: return "border-b border-dashed border-zinc-800";
        case 4: return "border-b md:border-r border-dashed border-zinc-800";
        case 5: return "border-b md:border-r border-dashed border-zinc-800";
        case 6: return "border-b border-dashed border-zinc-800";
        case 7: return "border-b md:border-b-0 md:border-r border-dashed border-zinc-800";
        case 8: return "";
        default: return "";
    }
};

const Crosshair = ({ position }: { position: string }) => (
    <svg 
        style={{ filter: "drop-shadow(0px 0px 6px #10b981) drop-shadow(0px 0px 12px #10b981)" }}
        className={`absolute ${position} w-4 h-4 text-emerald-500 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none`} 
        viewBox="0 0 16 16" 
        fill="none"
    >
        <path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

const FeatureGridSection = () => {
    return (
        <section className="relative py-24 overflow-hidden bg-black border-t border-zinc-900">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/20 rounded-[100%] blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight font-mono"
                    >
                        Features
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-sm md:text-base text-zinc-400 leading-relaxed font-mono max-w-2xl mx-auto"
                    >
                        From crafting a standout resume to mastering interviews, PrepVector gives you every tool you need in one seamless platform.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto w-full border border-dashed border-zinc-800 relative">
                    
                    {/* Container Top Edge Crosshairs */}
                    <Crosshair position="top-0 left-0" />
                    <Crosshair position="hidden md:block top-0 left-[33.333%]" />
                    <Crosshair position="hidden md:block top-0 left-[66.666%]" />
                    <Crosshair position="top-0 left-[100%]" />

                    {/* Container Bottom Edge Crosshairs */}
                    <Crosshair position="top-[100%] left-0" />
                    <Crosshair position="hidden md:block top-[100%] left-[33.333%]" />
                    <Crosshair position="hidden md:block top-[100%] left-[66.666%]" />
                    <Crosshair position="top-[100%] left-[100%]" />

                    {features.map((feature, idx) => {
                        return (
                            <motion.div
                                key={idx}
                                className={`group relative flex flex-col items-center justify-center text-center p-10 md:p-14 ${feature.colSpan} ${getBorderClasses(idx)} overflow-hidden`}
                            >
                                {/* Hover background with green radial and noise */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,204,113,0.15)_0%,transparent_80%)]" />
                                    <div className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-screen" />
                                </div>

                                {/* Mobile crosshairs for bottom edge of every cell except the last one */}
                                {idx < 8 && (
                                    <>
                                        <Crosshair position="md:hidden top-[100%] left-0" />
                                        <Crosshair position="md:hidden top-[100%] left-[100%]" />
                                    </>
                                )}

                                {/* Desktop precise interior crosshairs attached to bottom edge of cells */}
                                {idx === 0 && (
                                    <>
                                        <Crosshair position="hidden md:block top-[100%] left-0" />
                                        <Crosshair position="hidden md:block top-[100%] left-[50%]" />
                                        <Crosshair position="hidden md:block top-[100%] left-[100%]" />
                                    </>
                                )}
                                {idx === 1 && <Crosshair position="hidden md:block top-[100%] left-[100%]" />}
                                
                                {idx === 2 && (
                                    <>
                                        <Crosshair position="hidden md:block top-[100%] left-0" />
                                        <Crosshair position="hidden md:block top-[100%] left-[100%]" />
                                    </>
                                )}
                                {idx === 3 && (
                                    <>
                                        <Crosshair position="hidden md:block top-[100%] left-[50%]" />
                                        <Crosshair position="hidden md:block top-[100%] left-[100%]" />
                                    </>
                                )}

                                {idx === 4 && (
                                    <>
                                        <Crosshair position="hidden md:block top-[100%] left-0" />
                                        <Crosshair position="hidden md:block top-[100%] left-[100%]" />
                                    </>
                                )}
                                {idx === 5 && <Crosshair position="hidden md:block top-[100%] left-[100%]" />}
                                {idx === 6 && <Crosshair position="hidden md:block top-[100%] left-[100%]" />}

                                <h3 className="relative z-10 text-xl font-bold text-white mb-4 tracking-tight font-mono group-hover:text-[#2ECC71] transition-colors duration-300">{feature.title}</h3>
                                <p className="relative z-10 text-xs md:text-sm text-zinc-500 leading-relaxed font-mono max-w-[280px] group-hover:text-zinc-300 transition-colors duration-300">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeatureGridSection;
