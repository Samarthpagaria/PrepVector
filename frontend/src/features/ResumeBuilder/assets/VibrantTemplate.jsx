import React from 'react';
import { Mail, Phone, MapPin, Globe, ChevronRight } from "lucide-react";

const VibrantTemplate = ({ data, accentColor }) => {
    // Default to the lime green from the design if no accent color is heavily specified, 
    // but we will use accentColor to drive the dynamic parts so the user can change it.
    const primaryColor = accentColor || "#d2f34c";
    const cardBgColor = "#ebeae6"; // The soft gray for cards
    const pageBgColor = "#fdfaf4"; // The warm cream for the page

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

    const SectionHeader = ({ title }) => (
        <h3 className="text-xl font-bold text-zinc-900 mb-4 capitalize">{title}</h3>
    );

    return (
        <div className="w-full min-h-full" style={{ backgroundColor: pageBgColor }}>
            <div className="w-full mx-auto p-8 sm:p-12 text-zinc-900 grid grid-cols-12 gap-8 sm:gap-12">
                
                {/* LEFT COLUMN */}
                <div className="col-span-4 flex flex-col gap-8">
                    
                    {/* Profile Image & Badge */}
                    <div className="relative">
                        {/* Decorative background shapes */}
                        <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-2xl" style={{ backgroundColor: primaryColor, opacity: 0.8 }}></div>
                        <div className="absolute bottom-4 left-4 w-1/2 h-1/2 rounded-2xl" style={{ backgroundColor: primaryColor, opacity: 0.8 }}></div>
                        
                        {/* Actual Image */}
                        {data.personal_info?.image && (
                            <div className="relative z-10 w-full aspect-square p-2">
                                <img 
                                    src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover rounded-xl shadow-lg border-4 border-white grayscale"
                                />
                            </div>
                        )}

                        {/* Profession Badge */}
                        {data.personal_info?.profession && (
                            <div className="relative z-30 -mt-6 mx-auto w-max max-w-[95%] flex items-center rounded-full p-1 shadow-lg border-4" style={{ backgroundColor: primaryColor, borderColor: pageBgColor }}>
                                <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <ChevronRight size={18} className="text-white ml-0.5" />
                                </div>
                                <span className="font-extrabold text-zinc-900 text-[12px] uppercase tracking-wide ml-3 pr-4 truncate hover:whitespace-normal hover:break-words hover:overflow-visible transition-all">
                                    {data.personal_info.profession}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Name Header */}
                    <div className="mt-2">
                        <h1 className="text-3xl font-extrabold text-zinc-900 leading-tight">
                            Hello, I'm
                        </h1>
                        <h1 className="text-4xl font-extrabold text-zinc-900 leading-none mt-1 break-words">
                            {fullName}
                        </h1>
                    </div>

                    {/* Education */}
                    {data.education?.length > 0 && (
                        <div>
                            <SectionHeader title="Education" />
                            <div className="space-y-5">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-zinc-900 mb-2" style={{ backgroundColor: primaryColor }}>
                                            {formatDate(edu.start_date)} {edu.start_date && edu.graduation_date && '-'} {formatDate(edu.graduation_date)}
                                        </div>
                                        <h4 className="font-bold text-[15px] text-zinc-900 leading-tight">{edu.degree}</h4>
                                        <p className="text-[13px] text-zinc-700 mt-1">{edu.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {data.skills?.length > 0 && (
                        <div>
                            <SectionHeader title="Skills" />
                            <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: cardBgColor }}>
                                {data.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        {/* Skill Icon Block */}
                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 text-white font-bold text-[11px] uppercase shadow-sm" style={{ backgroundColor: primaryColor, color: '#18181b' }}>
                                            {skill.substring(0, 2)}
                                        </div>
                                        {/* Skill Text */}
                                        <span className="text-[13.5px] font-bold text-zinc-900 break-words flex-grow leading-tight">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* RIGHT COLUMN */}
                <div className="col-span-8 flex flex-col gap-8 pt-2">
                    
                    {/* Header: Portfolio & Contacts */}
                    <div className="grid grid-cols-2 gap-6">
                        {data.personal_info?.portfolio && (
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 mb-3">Portfolio</h3>
                                <div className="text-[13px] font-medium text-zinc-800 space-y-1">
                                    <a href={data.personal_info.portfolio} target="_blank" rel="noreferrer" className="block break-all hover:underline">
                                        {data.personal_info.portfolio}
                                    </a>
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 mb-3">Contacts</h3>
                            <div className="space-y-3 text-[13px] font-medium text-zinc-800">
                                {data.personal_info?.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                                            <Phone size={12} className="text-zinc-900" />
                                        </div>
                                        <span>{data.personal_info.phone}</span>
                                    </div>
                                )}
                                {data.personal_info?.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                                            <Mail size={12} className="text-zinc-900" />
                                        </div>
                                        <span className="break-all">{data.personal_info.email}</span>
                                    </div>
                                )}
                                {data.personal_info?.address && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                                            <MapPin size={12} className="text-zinc-900" />
                                        </div>
                                        <span>{data.personal_info.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    {data.professional_summary && (
                        <div>
                            <SectionHeader title="Profile" />
                            <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: cardBgColor }}>
                                <p className="text-[13.5px] text-zinc-800 leading-relaxed font-medium whitespace-pre-line">
                                    {data.professional_summary}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience?.length > 0 && (
                        <div>
                            <SectionHeader title="Professional Experience" />
                            <div className="space-y-5">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: cardBgColor }}>
                                        <div className="flex justify-between items-start mb-3 gap-4">
                                            <div>
                                                <h4 className="font-bold text-[16px] text-zinc-900 leading-snug">{exp.position}</h4>
                                                <p className="text-[14px] text-zinc-700 font-medium mt-0.5">{exp.company}</p>
                                            </div>
                                            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-zinc-900 flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                                                {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                            </div>
                                        </div>
                                        {exp.description && (
                                            <p className="text-[13.5px] text-zinc-800 leading-relaxed font-medium whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {data.project?.length > 0 && (
                        <div>
                            <SectionHeader title="Projects & Expertise" />
                            <div className="space-y-5">
                                {data.project.map((proj, i) => (
                                    <div key={i} className="rounded-2xl p-6 shadow-sm border border-zinc-200 bg-white">
                                        <h4 className="font-bold text-[15px] text-zinc-900">{proj.name}</h4>
                                        {proj.url && (
                                            <a href={proj.url} target="_blank" rel="noreferrer" className="text-[12px] font-bold mt-1 block break-all" style={{ color: primaryColor }}>
                                                {proj.url}
                                            </a>
                                        )}
                                        {proj.description && (
                                            <p className="mt-3 text-[13.5px] text-zinc-700 font-medium leading-relaxed whitespace-pre-line">
                                                {proj.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default VibrantTemplate;
