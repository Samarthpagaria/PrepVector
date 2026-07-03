import React from 'react';
import { Mail, Phone, MapPin, Globe } from "lucide-react";

const ScrapbookTemplate = ({ data, accentColor }) => {
    const primaryColor = accentColor || "#fcd34d"; // Default to a nice marker yellow

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.toLowerCase() === 'present') return 'Present';
        const parts = dateStr.split("-");
        if (parts.length === 1) return parts[0];
        const [year, month] = parts;
        if (!month) return year;
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    const fullName = data.personal_info?.full_name || "Your Name";
    const nameParts = fullName.split(' ');
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

    const MarkerHeader = ({ title }) => (
        <div className="relative inline-block mb-6 mt-8">
            <h2 className="text-3xl font-extrabold text-zinc-900 relative z-10 px-2">{title}</h2>
            <div 
                className="absolute bottom-0 left-0 w-[105%] h-[60%] -rotate-1 -z-10 opacity-70 rounded-md"
                style={{ backgroundColor: primaryColor }}
            ></div>
        </div>
    );

    // Random pastel colors for sticky notes/tags
    const noteColors = ["#ec4899", "#ef4444", "#eab308", "#10b981", "#3b82f6", "#8b5cf6"];
    
    return (
        <div className="w-full min-h-full font-sans relative dotted-bg text-zinc-900 shadow-xl overflow-hidden pb-12">
            {/* Import handwriting font */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
                
                .font-handwriting {
                    font-family: 'Caveat', cursive;
                }
                
                .dotted-bg {
                    background-color: #f0f0f0;
                    background-image: radial-gradient(#d1d1d1 1.5px, transparent 1.5px);
                    background-size: 15px 15px;
                }
                `}
            </style>

            {/* TOP HEADER SECTION */}
            <div className="flex justify-between items-start pt-12 px-8 sm:px-12 relative z-20">
                
                {/* The Polaroid Card */}
                <div className="w-[65%] bg-[#f7f5ef] p-5 shadow-[5px_5px_15px_rgba(0,0,0,0.15)] rounded-sm -rotate-2 relative border border-zinc-200">
                    {/* Paperclip */}
                    <svg className="absolute -top-10 -left-2 w-12 h-20 text-zinc-400 -rotate-12 drop-shadow-md z-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>

                    <div className="flex gap-5">
                        {/* Image inside card */}
                        {data.personal_info?.image && (
                            <div className="w-[120px] shrink-0">
                                <div className="w-full aspect-[3/4] p-2 bg-white shadow-sm border border-zinc-100" style={{ backgroundColor: primaryColor }}>
                                    <img 
                                        src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover grayscale contrast-125 mix-blend-multiply"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Info inside card */}
                        <div className="flex flex-col justify-center flex-grow overflow-hidden">
                            <h1 className="text-4xl font-black text-zinc-900 leading-none">
                                {firstName} {lastName}
                            </h1>
                            {data.professional_summary && (
                                <p className="text-[12px] text-zinc-700 leading-tight mt-3 font-medium">
                                    {data.professional_summary}
                                </p>
                            )}

                            {/* Contact Grid in Card */}
                            <div className="mt-4 border-2 border-zinc-800 rounded-md p-2.5 bg-[#f7f5ef] text-[11px] font-bold text-zinc-900 grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-2 overflow-hidden">
                                {data.personal_info?.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={12} className="shrink-0" />
                                        <span>{data.personal_info.phone}</span>
                                    </div>
                                )}
                                {data.personal_info?.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={12} className="shrink-0" />
                                        <span className="truncate hover:whitespace-normal hover:break-all hover:overflow-visible" title={data.personal_info.email}>{data.personal_info.email}</span>
                                    </div>
                                )}
                                {data.personal_info?.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={12} className="shrink-0" />
                                        <span className="truncate hover:whitespace-normal hover:break-all hover:overflow-visible" title={data.personal_info.address}>{data.personal_info.address}</span>
                                    </div>
                                )}
                                
                                {/* Social Links & Custom Links */}
                                {data.personal_info?.linkedin && (
                                    <div className="flex items-center gap-2">
                                        <Globe size={12} className="shrink-0 text-zinc-500" />
                                        <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="truncate hover:underline hover:whitespace-normal hover:break-all hover:overflow-visible">LinkedIn</a>
                                    </div>
                                )}
                                {data.personal_info?.portfolio && (
                                    <div className="flex items-center gap-2">
                                        <Globe size={12} className="shrink-0 text-zinc-500" />
                                        <a href={data.personal_info.portfolio} target="_blank" rel="noreferrer" className="truncate hover:underline hover:whitespace-normal hover:break-all hover:overflow-visible">Portfolio</a>
                                    </div>
                                )}
                                {data.personal_info?.github && (
                                    <div className="flex items-center gap-2">
                                        <Globe size={12} className="shrink-0 text-zinc-500" />
                                        <a href={data.personal_info.github} target="_blank" rel="noreferrer" className="truncate hover:underline hover:whitespace-normal hover:break-all hover:overflow-visible">GitHub</a>
                                    </div>
                                )}
                                {data.personal_info?.customLinks?.map((link, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <Globe size={12} className="shrink-0 text-zinc-500" />
                                        <a href={link.url} target="_blank" rel="noreferrer" className="truncate hover:underline hover:whitespace-normal hover:break-all hover:overflow-visible">{link.name || "Link"}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                    {/* Right side doodle */}
                    <div className="w-[30%] rotate-3 pl-4 pt-4">
                        <div className="font-handwriting text-2xl text-zinc-700 leading-snug">
                            Please don&apos;t hesitate to <span className="border-2 border-red-500 rounded-[50%] px-1 text-zinc-900 rotate-2 inline-block">reach me</span> if this resume doesn&apos;t provide enough clarification.
                        </div>
                        {/* Red curly arrow down */}
                        <svg className="w-12 h-12 text-red-500 mt-2 ml-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M19 12l-7 7-7-7"/>
                        </svg>
                        {data.personal_info?.phone && (
                            <div className="flex items-center gap-2 mt-2 text-xl font-handwriting text-zinc-800 font-bold -rotate-3">
                                <Phone size={18} className="text-red-500 fill-red-500" />
                                <span>{data.personal_info.phone}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* MAIN TWO COLUMN LAYOUT */}
                <div className="grid grid-cols-12 gap-10 px-8 sm:px-12 mt-12 pb-12">
                    
                    {/* LEFT COLUMN: Experience & Education */}
                    <div className="col-span-7">
                        
                        {/* Work Experience */}
                        {data.experience?.length > 0 && (
                            <div className="mb-8">
                                <MarkerHeader title="Work experience" />
                                <div className="space-y-6">
                                    {data.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-6 before:absolute before:left-1 before:top-2 before:w-2 before:h-2 before:border-[1.5px] before:border-zinc-900 before:rounded-full before:bg-[#f0f0f0]">
                                            <div className="text-[13px] font-medium italic text-zinc-600 mb-1">
                                                {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                            </div>
                                            <h3 className="text-xl font-bold text-zinc-900 leading-none">{exp.position}</h3>
                                            <div className="flex items-center gap-2 mt-1.5 mb-2">
                                                <span className="text-[13px] font-bold text-zinc-800 uppercase">{exp.company}</span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-[13px] text-zinc-700 leading-relaxed whitespace-pre-line border-l border-dashed border-zinc-400 pl-4 py-1 ml-[5px]">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {data.education?.length > 0 && (
                            <div>
                                <MarkerHeader title="Education" />
                                <div className="space-y-6">
                                    {data.education.map((edu, i) => (
                                        <div key={i} className="relative pl-6 before:absolute before:left-1 before:top-2 before:w-2 before:h-2 before:border-[1.5px] before:border-zinc-900 before:rounded-full before:bg-[#f0f0f0]">
                                            <div className="text-[13px] font-medium italic text-zinc-600 mb-1">
                                                {formatDate(edu.start_date)} {edu.start_date && edu.graduation_date && '-'} {formatDate(edu.graduation_date)}
                                            </div>
                                            <h3 className="text-xl font-bold text-zinc-900 leading-none">{edu.institution}</h3>
                                            <div className="text-[13px] font-bold text-zinc-800 uppercase mt-1.5 mb-1">
                                                {edu.degree}
                                            </div>
                                            {(edu.gpa || edu.percentage) && (
                                                <p className="text-[12px] text-zinc-600 font-medium">
                                                    {edu.gpa && `GPA: ${edu.gpa}`} 
                                                    {edu.gpa && edu.percentage && ' | '}
                                                    {edu.percentage && `${edu.percentage}`}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: Expertise & Skills */}
                    <div className="col-span-5">
                        
                        {/* Expertise (Projects) */}
                        {data.project?.length > 0 && (
                            <div className="mb-12">
                                <MarkerHeader title="Area of Expertise" />
                                <div className="relative mt-8 h-[250px]">
                                    {data.project.map((proj, i) => {
                                        const rot = (i % 2 === 0 ? 1 : -1) * (5 + (i * 3));
                                        const color = noteColors[i % noteColors.length];
                                        return (
                                            <div 
                                                key={i} 
                                                className="absolute w-44 p-4 shadow-xl transform transition-all duration-300 hover:scale-[1.15] z-10 hover:z-50 group cursor-default"
                                                style={{ 
                                                    backgroundColor: color,
                                                    top: `${i * 30}px`,
                                                    left: `${(i % 3) * 20}px`,
                                                    transform: `rotate(${rot}deg)`,
                                                    color: '#fff',
                                                    borderBottomRightRadius: '20px 20px' // Fold effect start
                                                }}
                                            >
                                                <h4 className="font-handwriting text-2xl font-bold leading-tight">{proj.name}</h4>
                                                {proj.url && (
                                                    <a href={proj.url} target="_blank" rel="noreferrer" className="text-[11px] font-medium mt-1 block truncate hover:whitespace-normal hover:break-all hover:overflow-visible underline opacity-90">
                                                        {proj.url}
                                                    </a>
                                                )}
                                                {proj.description && (
                                                    <p className="mt-2 text-[12px] font-medium leading-tight opacity-90 line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                                                        {proj.description}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Software Skills */}
                        {data.skills?.length > 0 && (
                            <div className={data.project?.length > 0 ? "mt-12" : ""}>
                                <MarkerHeader title="Software skills" />
                                <div className="flex flex-wrap gap-4 mt-6">
                                    {data.skills.map((skill, i) => {
                                        const color = noteColors[(i + 3) % noteColors.length];
                                        const rot = (i % 2 === 0 ? 1 : -1) * (2 + (i % 3));
                                        return (
                                            <div 
                                                key={i} 
                                                className="px-4 py-1.5 border-2 border-zinc-900 font-handwriting text-2xl font-bold shadow-[3px_3px_0px_#18181b] transition-transform hover:scale-110 cursor-default"
                                                style={{ 
                                                    backgroundColor: color, 
                                                    color: '#fff',
                                                    textShadow: '1px 1px 0px #18181b',
                                                    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                                                    transform: `rotate(${rot}deg)`
                                                }}
                                            >
                                                {skill}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
        </div>
    );
};

export default ScrapbookTemplate;
