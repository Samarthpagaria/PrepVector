import React from 'react';

const Star = ({ className }) => (
    <svg className={`w-8 h-8 text-white ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C12 8 16 12 24 12C16 12 12 16 12 24C12 16 8 12 0 12C8 12 12 8 12 0Z" />
    </svg>
);

const CinematicTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.toLowerCase() === 'present') return 'Present';
        const parts = dateStr.split("-");
        if (parts.length === 1) return parts[0];
        const [year, month] = parts;
        if (!month) return year;
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
        });
    };

    const fullName = data.personal_info?.full_name || "Your Name";
    const nameParts = fullName.split(' ');
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

    const SectionTitle = ({ children }) => (
        <h2 className="text-2xl font-normal tracking-wide text-white mb-6">
            {children}:
        </h2>
    );

    return (
        <div className="w-full min-h-full pb-16 relative bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-white selection:text-black">
            <div className="max-w-[8.5in] mx-auto min-h-[11in] bg-[#050505] relative shadow-2xl overflow-hidden p-8 sm:p-12">
                
                {/* Outer Wireframe Wrapper */}
                <div className="w-full h-full border border-zinc-200 relative flex flex-col z-10">
                    
                    {/* Stars - Positioned exactly on the wireframe intersections */}
                    <Star className="absolute -top-4 -right-4 z-30 drop-shadow-md" />
                    <Star className="absolute top-[450px] -translate-y-1/2 -left-4 z-30 drop-shadow-md" />
                    <Star className="absolute top-[450px] -translate-y-1/2 -right-4 z-30 drop-shadow-md" />
                    <Star className="absolute -bottom-4 -right-4 z-30 drop-shadow-md" />

                    {/* HEADER SECTION (Top Half) */}
                    <div className="h-[450px] relative border-b border-zinc-200 shrink-0">
                        
                        {/* Hero Image Background */}
                        <div className="absolute inset-0 bg-[#0a0a0a] overflow-hidden">
                            {data.personal_info?.image && (
                                <>
                                    <img 
                                        src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover opacity-70 grayscale-[30%] contrast-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>
                                </>
                            )}
                        </div>

                        {/* Top Left Contact Info */}
                        <div className="absolute top-8 left-8 z-20 text-[11px] sm:text-[13px] font-medium tracking-widest text-zinc-200 space-y-1 max-w-[40%]">
                            {data.personal_info?.address && (
                                <p className="truncate hover:whitespace-normal hover:break-all hover:overflow-visible transition-all">
                                    {data.personal_info.address}
                                </p>
                            )}
                            {data.personal_info?.phone && (
                                <p>{data.personal_info.phone}</p>
                            )}
                            {data.personal_info?.email && (
                                <p className="truncate hover:whitespace-normal hover:break-all hover:overflow-visible transition-all">
                                    {data.personal_info.email}
                                </p>
                            )}
                            
                            {/* Social Links */}
                            <div className="pt-2 flex flex-col gap-1">
                                {data.personal_info?.linkedin && (
                                    <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="truncate hover:underline hover:whitespace-normal hover:break-all hover:overflow-visible transition-all">LinkedIn</a>
                                )}
                                {data.personal_info?.portfolio && (
                                    <a href={data.personal_info.portfolio} target="_blank" rel="noreferrer" className="truncate hover:underline hover:whitespace-normal hover:break-all hover:overflow-visible transition-all">Portfolio</a>
                                )}
                                {data.personal_info?.github && (
                                    <a href={data.personal_info.github} target="_blank" rel="noreferrer" className="truncate hover:underline hover:whitespace-normal hover:break-all hover:overflow-visible transition-all">GitHub</a>
                                )}
                                {data.personal_info?.customLinks?.map((link, idx) => (
                                    <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="truncate hover:underline hover:whitespace-normal hover:break-all hover:overflow-visible transition-all">{link.name || "Link"}</a>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Center Name & Summary */}
                        <div className="absolute bottom-8 left-0 w-full px-12 z-20 text-center">
                            <h1 className="text-5xl sm:text-7xl font-light tracking-wide text-white drop-shadow-xl mb-3">
                                {firstName} <span className="font-bold">{lastName}</span>
                            </h1>
                            {data.professional_summary && (
                                <p className="text-[12px] sm:text-[14px] font-medium leading-relaxed max-w-2xl mx-auto text-zinc-300">
                                    {data.professional_summary}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BODY SECTION (Bottom Half) */}
                    <div className="flex-1 grid grid-cols-12 bg-[#050505]">
                        
                        {/* LEFT COLUMN: Experience */}
                        <div className="col-span-12 md:col-span-6 border-b md:border-b-0 md:border-r border-zinc-200 p-8 sm:p-10">
                            <SectionTitle>Professional Experience</SectionTitle>
                            
                            {data.experience?.length > 0 && (
                                <div className="space-y-8">
                                    {data.experience.map((exp, i) => (
                                        <div key={i} className="group">
                                            <h3 className="text-lg font-bold text-white leading-snug mb-1">
                                                {exp.company}
                                            </h3>
                                            <div className="text-[14px] font-medium text-zinc-300 mb-1">
                                                {exp.position && <span className="mr-2">Role: {exp.position}</span>}
                                            </div>
                                            <div className="text-[13px] text-zinc-400 mb-2">
                                                Dates: {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                            </div>
                                            {exp.description && (
                                                <p className="text-[13px] text-zinc-300 leading-relaxed whitespace-pre-line">
                                                    Description: {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Education, Skills, Additional Info */}
                        <div className="col-span-12 md:col-span-6 p-8 sm:p-10 flex flex-col gap-10">
                            
                            {/* Education */}
                            {data.education?.length > 0 && (
                                <div>
                                    <SectionTitle>Education</SectionTitle>
                                    <div className="space-y-6">
                                        {data.education.map((edu, i) => (
                                            <div key={i}>
                                                <h3 className="text-lg font-bold text-white leading-snug mb-1">
                                                    {edu.degree}
                                                </h3>
                                                <div className="text-[13px] text-zinc-300 mb-1">
                                                    Institution: {edu.institution}
                                                </div>
                                                <div className="text-[13px] text-zinc-400">
                                                    Graduation Year: {edu.graduation_date ? formatDate(edu.graduation_date) : (edu.end_date ? formatDate(edu.end_date) : "N/A")}
                                                </div>
                                                {(edu.gpa || edu.percentage) && (
                                                    <div className="text-[13px] text-zinc-400 mt-1">
                                                        {edu.gpa && `GPA: ${edu.gpa}`} 
                                                        {edu.gpa && edu.percentage && ' | '}
                                                        {edu.percentage && `${edu.percentage}`}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {data.skills?.length > 0 && (
                                <div>
                                    <SectionTitle>Skills</SectionTitle>
                                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 list-disc list-inside text-[14px] text-zinc-300 marker:text-zinc-500">
                                        {data.skills.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Projects as Additional Information */}
                            {data.project?.length > 0 && (
                                <div>
                                    <SectionTitle>Additional Information</SectionTitle>
                                    <ul className="list-disc list-inside text-[13px] text-zinc-300 space-y-3 marker:text-zinc-500">
                                        {data.project.map((proj, i) => (
                                            <li key={i} className="pl-1">
                                                <span className="font-bold text-white">{proj.name}</span>
                                                {proj.url && (
                                                    <a href={proj.url} target="_blank" rel="noreferrer" className="ml-2 text-[11px] underline opacity-80 hover:opacity-100 hover:whitespace-normal hover:break-all transition-all">Link</a>
                                                )}
                                                {proj.description && (
                                                    <p className="block mt-1 text-zinc-400 pl-4 border-l border-zinc-700 ml-1">
                                                        {proj.description}
                                                    </p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CinematicTemplate;
