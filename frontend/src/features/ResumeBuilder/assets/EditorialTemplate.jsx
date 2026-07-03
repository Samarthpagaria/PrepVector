import React from 'react';
import { Mail, Phone, MapPin, Globe, Plus } from "lucide-react";

const EditorialTemplate = ({ data, accentColor }) => {
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
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(' ') || "";

    const SectionHeader = ({ title }) => (
        <div className="mt-10 mb-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[17px] font-bold tracking-[0.3em] uppercase text-zinc-900">{title}</h3>
                <Plus size={20} className="text-zinc-400 stroke-[3px]" style={{ color: accentColor }} />
            </div>
            <hr className="border-t-[1.5px] border-zinc-900" />
        </div>
    );

    const SidebarHeader = ({ title }) => (
        <div className="mt-12 mb-6">
            <h3 className="text-[17px] font-bold tracking-[0.3em] uppercase text-zinc-900 mb-2">{title}</h3>
            <hr className="border-t-[1.5px] border-zinc-900" />
        </div>
    );

    return (
        <div className="bg-[#e6e8eb] w-full min-h-full">
            <div className="w-full mx-auto p-8 sm:p-10 text-zinc-900 grid grid-cols-12 gap-8 sm:gap-12">
                {/* LEFT COLUMN */}
                <div className="col-span-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-[2.5rem] font-light tracking-[0.15em] uppercase text-zinc-800 leading-none">
                            {firstName}
                        </h1>
                        <h1 className="text-[3.5rem] font-black tracking-tighter uppercase text-zinc-900 leading-[0.9] mt-2 break-words">
                            {lastName}
                        </h1>
                    </div>

                    {/* Job Title & Summary */}
                    {(data?.personal_info?.profession || data.professional_summary) && (
                        <div className="mt-12">
                            {data?.personal_info?.profession && (
                                <h2 className="text-[1.1rem] font-bold tracking-[0.25em] uppercase text-zinc-900 mb-4">
                                    {data.personal_info.profession}
                                </h2>
                            )}
                            {data.professional_summary && (
                                <p className="text-[13px] text-zinc-800 leading-relaxed font-medium whitespace-pre-line">
                                    {data.professional_summary}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience?.length > 0 && (
                        <section>
                            <SectionHeader title="Experience" />
                            <div className="space-y-6">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <h4 className="font-bold text-[14px] text-zinc-900">{exp.position}</h4>
                                        <div className="flex justify-between items-baseline mt-0.5">
                                            <p className="text-[14px] text-zinc-800">{exp.company}</p>
                                            <span className="text-[13px] text-zinc-700 font-medium whitespace-nowrap">
                                                {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <div className="mt-3 pl-4">
                                                <p className="text-[13px] text-zinc-800 leading-relaxed whitespace-pre-line relative before:content-['•'] before:absolute before:-left-4 before:text-zinc-600">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {data.education?.length > 0 && (
                        <section>
                            <SectionHeader title="Education" />
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h4 className="font-bold text-[14px] text-zinc-900">{edu.degree}</h4>
                                        <div className="flex justify-between text-zinc-800 text-[14px] mt-1">
                                            <span>{edu.institution}, Graduated {formatDate(edu.graduation_date)}</span>
                                            {(edu.gpa || edu.percentage) && (
                                                <span className="text-zinc-700 font-medium">
                                                    {edu.gpa && `GPA: ${edu.gpa}`} 
                                                    {edu.gpa && edu.percentage && ' | '}
                                                    {edu.percentage && `${edu.percentage}`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="col-span-4 pt-2">
                    {/* Contact Info */}
                    <div className="space-y-4 text-[12px] text-zinc-800 font-semibold mb-10">
                        {data.personal_info?.phone && (
                            <div className="flex items-center gap-3">
                                <Phone size={14} className="text-zinc-500 fill-zinc-500" />
                                <span>{data.personal_info.phone}</span>
                            </div>
                        )}
                        {data.personal_info?.email && (
                            <div className="flex items-center gap-3">
                                <Mail size={14} className="text-zinc-500 fill-zinc-500 flex-shrink-0" />
                                <span className="break-all">{data.personal_info.email}</span>
                            </div>
                        )}
                        {data.personal_info?.address && (
                            <div className="flex items-center gap-3">
                                <MapPin size={14} className="text-zinc-500 fill-zinc-500 flex-shrink-0" />
                                <span>{data.personal_info.address}</span>
                            </div>
                        )}
                        {data.personal_info?.portfolio && (
                            <div className="flex items-center gap-3">
                                <Globe size={14} className="text-zinc-500 fill-zinc-500 flex-shrink-0" />
                                <a href={data.personal_info.portfolio} target="_blank" rel="noreferrer" className="break-all">{data.personal_info.portfolio}</a>
                            </div>
                        )}
                    </div>

                    {/* Profile Image */}
                    {data.personal_info?.image && (
                        <div className="mb-10 w-full aspect-[4/5] overflow-hidden">
                            <img 
                                src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)} 
                                alt="Profile" 
                                className="w-full h-full object-cover bg-zinc-300"
                                style={{ filter: "grayscale(100%)" }}
                            />
                        </div>
                    )}

                    {/* Skills */}
                    {data.skills?.length > 0 && (
                        <section>
                            <SidebarHeader title="Skills" />
                            <ul className="space-y-2.5 text-[13px] text-zinc-800 font-medium pl-1">
                                {data.skills.map((skill, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-[10px] mt-[4px] leading-none text-zinc-500">●</span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Projects */}
                    {data.project?.length > 0 && (
                        <section>
                            <SidebarHeader title="Projects" />
                            <div className="space-y-5">
                                {data.project.map((proj, i) => (
                                    <div key={i}>
                                        <h4 className="font-bold text-zinc-900 text-[13px]">{proj.name}</h4>
                                        {proj.url && (
                                            <a href={proj.url} target="_blank" rel="noreferrer" className="text-[11px] font-bold mt-1 block break-all" style={{ color: accentColor }}>
                                                {proj.url}
                                            </a>
                                        )}
                                        {proj.description && (
                                            <p className="mt-2 text-[12px] text-zinc-700 font-medium leading-relaxed whitespace-pre-line">
                                                {proj.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditorialTemplate;
