import React from 'react';
import { motion } from 'framer-motion';

const row1 = [
    { name: "Aarav Sharma", role: "Software Engineer", content: "PrepVector helped me transform my resume into something much more professional. The AI suggestions made my experience stand out, and the mock interviews boosted my confidence." },
    { name: "Priya Patel", role: "Frontend Developer", content: "The AI interview practice felt surprisingly realistic. The personalized feedback showed exactly what I needed to improve before my interviews." },
    { name: "Michael Johnson", role: "Software Engineer", content: "I rebuilt my resume in under an hour. The live preview and ATS-focused suggestions made the entire process effortless." },
    { name: "Emily Davis", role: "Product Manager", content: "The interview reports were my favorite feature. Instead of generic feedback, I received actionable insights and a clear improvement plan." },
    { name: "Rahul Verma", role: "Full Stack Developer", content: "Being able to share a live resume link instead of constantly exporting PDFs saved me a lot of time during my job search." },
    { name: "Neha Gupta", role: "Data Analyst", content: "The personalized interview report was my favorite feature. It showed my strengths, weaknesses, and what I should focus on next." },
    { name: "Arjun Mehta", role: "Backend Developer", content: "I imported my old resume and had a polished version ready within minutes. It saved me a lot of time." },
    { name: "Sneha Iyer", role: "UI/UX Designer", content: "The resume templates look modern and professional. Recruiters even complimented the design." },
];

const row2 = [
    { name: "Vikram Singh", role: "Software Engineer", content: "PrepVector helped me organize my resume into a much cleaner format. The AI suggestions made every bullet point stronger." },
    { name: "Pooja Desai", role: "Frontend Developer", content: "I was able to build a professional-looking resume in less than an hour. The live preview is a fantastic feature." },
    { name: "Nikhil Jain", role: "Full Stack Developer", content: "The AI mock interviews asked relevant follow-up questions, making the experience feel much closer to a real interview." },
    { name: "Meera Nair", role: "Business Analyst", content: "I loved receiving a detailed report after every interview. It clearly showed what I should improve." },
    { name: "Siddharth Agarwal", role: "Backend Engineer", content: "The resume builder is simple to use, and the templates look polished without needing any design skills." },
    { name: "Ritika Sharma", role: "UI Designer", content: "The AI bullet enhancement feature saved me hours of rewriting. My resume reads much more professionally now." },
    { name: "Harsh Patel", role: "Software Developer", content: "Having resume building and interview practice in one platform makes PrepVector incredibly convenient." },
    { name: "Ishita Banerjee", role: "Computer Science Graduate", content: "As a fresher, I found the guided workflow extremely helpful. It took away the stress of creating my first resume." },
];

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
};

const TestimonialCard = ({ name, role, content }: { name: string, role: string, content: string }) => (
    <div className="w-[350px] shrink-0 bg-[#050505] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 mx-3">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm shrink-0">
                {getInitials(name)}
            </div>
            <div>
                <h4 className="text-zinc-200 font-bold text-sm tracking-tight">{name}</h4>
                <p className="text-zinc-500 text-xs font-mono">{role}</p>
            </div>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed font-mono">"{content}"</p>
    </div>
);

const TestimonialsSection = () => {
    return (
        <section className="relative py-24 overflow-hidden bg-black border-t border-zinc-900">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight font-mono"
                    >
                        Wall of Love
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-sm md:text-base text-zinc-400 leading-relaxed font-mono max-w-2xl mx-auto"
                    >
                        See what developers, designers, and students are saying about PrepVector.
                    </motion.p>
                </div>
            </div>

            <div className="relative w-full flex flex-col gap-6 overflow-hidden">
                {/* Left/Right Fades */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                {/* Row 1: Moves Right */}
                <div className="flex w-max animate-marquee-right">
                    {[...row1, ...row1, ...row1].map((t, i) => (
                        <TestimonialCard key={`r1-${i}`} {...t} />
                    ))}
                </div>

                {/* Row 2: Moves Left */}
                <div className="flex w-max animate-marquee-left">
                    {[...row2, ...row2, ...row2].map((t, i) => (
                        <TestimonialCard key={`r2-${i}`} {...t} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
