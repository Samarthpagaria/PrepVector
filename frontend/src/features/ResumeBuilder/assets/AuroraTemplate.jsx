import React from 'react';

const AuroraTemplate = ({ data, accentColor }) => {
    const primaryColor = accentColor || "#ec4899"; // Neon Pink default
    const secondaryColor = "#a855f7"; // Purple for gradients

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.toLowerCase() === 'present') return 'Present';
        const parts = dateStr.split("-");
        if (parts.length === 1) return parts[0];
        const [year, month] = parts;
        if (!month) return year;
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
        });
    };

    const GlassCard = ({ children, className = "" }) => (
        <div className={`bg-white/5 border border-white/10 rounded-[1.5rem] p-8 shadow-2xl backdrop-blur-md ${className}`}>
            {children}
        </div>
    );

    const SectionTitle = ({ children }) => (
        <h2 className="text-[13px] font-bold tracking-widest uppercase mb-6" style={{ color: primaryColor }}>
            {children}
        </h2>
    );

    return (
        <div className="w-full min-h-full font-sans text-zinc-300 pb-16 bg-[#0f0c1b]">
            <div className="max-w-[8.5in] mx-auto min-h-[11in] relative overflow-hidden shadow-2xl p-8 sm:p-10 bg-gradient-to-br from-[#2a1b38] via-[#10101b] to-[#1e2343]">
                
                {/* Optional decorative background blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-6">
                    
                    {/* HEADER CARD */}
                    <GlassCard className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">
                                {data.personal_info?.full_name || "Your Name"}
                            </h1>
                            {data.personal_info?.profession && (
                                <h2 className="text-xl sm:text-2xl font-semibold opacity-90" style={{ color: primaryColor }}>
                                    {data.personal_info.profession}
                                </h2>
                            )}
                            
                            {/* Custom Links with proper horizontal space */}
                            {data.personal_info?.customLinks?.length > 0 && (
                                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-zinc-300 font-medium">
                                    {data.personal_info.customLinks.map((link, idx) => (
                                        <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white hover:underline transition-all">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 opacity-70" style={{ color: primaryColor }}>
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                            </svg>
                                            {link.name || link.url.replace(/^https?:\/\/(www\.)?/, '')}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-2 text-sm text-zinc-300 font-medium text-left md:text-right shrink-0">
                            {data.personal_info?.phone && (
                                <p>{data.personal_info.phone}</p>
                            )}
                            {data.personal_info?.email && (
                                <p className="truncate hover:whitespace-normal hover:break-all hover:overflow-visible transition-all">
                                    {data.personal_info.email}
                                </p>
                            )}
                            {data.personal_info?.address && (
                                <p className="truncate hover:whitespace-normal hover:break-all hover:overflow-visible transition-all">
                                    {data.personal_info.address}
                                </p>
                            )}
                        </div>
                    </GlassCard>

                    {/* BODY CONTENT (Dynamic Masonry Layout) */}
                    <div className="columns-1 md:columns-2 gap-6 space-y-6">
                        
                        {/* About / Summary */}
                        {(data.professional_summary || !data.professional_summary) && (
                            <GlassCard className="break-inside-avoid mb-6">
                                <SectionTitle>About</SectionTitle>
                                <p className="text-[14px] leading-relaxed text-zinc-300 font-medium">
                                    {data.professional_summary || "A passionate and driven professional ready to leverage my skills and experience to create impactful solutions. Proven track record in collaborative environments and dedicated to continuous learning."}
                                </p>
                            </GlassCard>
                        )}

                        {/* Experience Timeline */}
                        {data.experience?.length > 0 && (
                            <GlassCard className="break-inside-avoid mb-6">
                                <SectionTitle>Experience</SectionTitle>
                                
                                <div className="relative border-l border-white/10 ml-2 mt-4 space-y-10 pb-4">
                                    {data.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-8 group">
                                            {/* Glowing Timeline Dot */}
                                            <div 
                                                className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full ring-4 ring-[#1a1a2e]"
                                                style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}
                                            ></div>
                                            
                                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-2 mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white leading-tight">
                                                        {exp.position}
                                                    </h3>
                                                    <div className="text-[14px] font-medium text-[#818cf8] mt-1">
                                                        {exp.company}
                                                    </div>
                                                </div>
                                                {/* Date Pill */}
                                                <div className="bg-white/10 px-3 py-1 rounded-md text-[11px] font-bold text-zinc-300 uppercase tracking-widest self-start shrink-0">
                                                    {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                                </div>
                                            </div>

                                            <p className="text-[13px] text-zinc-400 leading-relaxed font-medium mt-3 whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}
                        
                        {/* Projects */}
                        {data.project?.length > 0 && (
                            <GlassCard className="break-inside-avoid mb-6">
                                <SectionTitle>Projects</SectionTitle>
                                <div className="space-y-6">
                                    {data.project.map((proj, i) => (
                                        <div key={i}>
                                            <h3 className="text-[15px] font-bold text-white leading-snug mb-1">
                                                {proj.name}
                                            </h3>
                                            {proj.url && (
                                                <a href={proj.url} target="_blank" rel="noreferrer" className="text-[12px] font-medium text-[#818cf8] underline truncate hover:whitespace-normal hover:break-all hover:overflow-visible transition-all block mb-2">
                                                    {proj.url}
                                                </a>
                                            )}
                                            <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
                                                {proj.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {/* Skills / Expertise */}
                        {data.skills?.length > 0 && (
                            <GlassCard className="break-inside-avoid mb-6">
                                <SectionTitle>Expertise</SectionTitle>
                                <div className="flex flex-wrap gap-3">
                                    {data.skills.map((skill, i) => (
                                        <div key={i} className="bg-white/10 hover:bg-white/20 transition-colors border border-white/5 rounded-full px-4 py-2 text-[13px] font-semibold text-zinc-200 shadow-sm w-max max-w-full truncate hover:whitespace-normal hover:break-words hover:overflow-visible">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {/* Education */}
                        {data.education?.length > 0 && (
                            <GlassCard className="break-inside-avoid mb-6">
                                <SectionTitle>Education</SectionTitle>
                                <div className="space-y-6">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className="text-[15px] font-bold text-white leading-snug mb-1">
                                                {edu.degree}
                                            </h3>
                                            <div className="text-[13px] font-medium text-zinc-400">
                                                {edu.institution}
                                            </div>
                                            <div className="text-[13px] font-medium text-[#818cf8]">
                                                {edu.graduation_date ? formatDate(edu.graduation_date) : (edu.end_date ? formatDate(edu.end_date) : "")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuroraTemplate;
