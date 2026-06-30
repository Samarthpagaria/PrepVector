import { Globe, MapPin, Mail, Phone, Star } from "lucide-react";

const AestheticTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-slate-50 text-slate-800 overflow-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Blurry background blob */}
            <div 
                className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/4 translate-x-1/4"
                style={{ backgroundColor: accentColor }}
            ></div>

            <div className="relative p-10">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-12">
                    <div className="pt-8">
                        <h1 className="text-6xl font-bold tracking-tight text-slate-900 leading-none mb-2">
                            {data.personal_info?.full_name?.split(' ')[0] || "Your"}
                            <br/>
                            {data.personal_info?.full_name?.split(' ').slice(1).join(' ') || "Name"}
                        </h1>
                        <p className="text-xl font-medium tracking-wide mt-4" style={{ color: accentColor }}>
                            {data.personal_info?.profession || "Profession"}
                        </p>
                    </div>

                    <div className="relative">
                        {/* Decorative Sparkles */}
                        <Star className="absolute -top-4 -left-6 w-6 h-6 text-slate-900" />
                        <Star className="absolute bottom-4 -right-4 w-4 h-4 text-slate-900" />
                        
                        {(data.personal_info?.image && typeof data.personal_info.image === 'string') ? (
                            <img src={data.personal_info.image} alt="Profile" className="w-48 h-48 rounded-full object-cover shadow-2xl relative z-10 border-4 border-white" />
                        ) : (data.personal_info?.image && typeof data.personal_info.image === 'object') ? (
                            <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-48 h-48 rounded-full object-cover shadow-2xl relative z-10 border-4 border-white" />
                        ) : (
                            <div className="w-48 h-48 rounded-full bg-slate-200 shadow-2xl relative z-10 border-4 border-white flex items-center justify-center text-slate-400">
                                Photo
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content 2-Col Grid */}
                <div className="grid grid-cols-12 gap-10">
                    
                    {/* LEFT COLUMN */}
                    <div className="col-span-5 space-y-10">
                        {/* About Me */}
                        {data.professional_summary && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-wide">About me</h2>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    {data.professional_summary}
                                </p>
                            </section>
                        )}

                        {/* Education */}
                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-wide">Education</h2>
                                <div className="space-y-4">
                                    {data.education.map((edu, index) => (
                                        <div key={index}>
                                            <h3 className="font-semibold text-slate-800 text-sm">{edu.degree}</h3>
                                            <p className="text-sm text-slate-500">{edu.institution}</p>
                                            <p className="text-xs font-medium mt-1" style={{ color: accentColor }}>
                                                {formatDate(edu.start_date)} - {formatDate(edu.graduation_date)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        {data.skills && data.skills.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-wide">Skills</h2>
                                <div className="space-y-3">
                                    {data.skills.map((skill, index) => (
                                        <div key={index}>
                                            <p className="text-sm font-medium text-slate-700 mb-1">{skill}</p>
                                            {/* decorative progress bar */}
                                            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full" 
                                                    style={{ width: `${Math.random() * 40 + 60}%`, backgroundColor: accentColor }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-span-7 space-y-10">
                        {/* Contacts */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-wide">Contacts</h2>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-slate-600">
                                {data.personal_info?.phone && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold" style={{ color: accentColor }}>phone</span>
                                        <span>{data.personal_info.phone}</span>
                                    </div>
                                )}
                                {data.personal_info?.email && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold" style={{ color: accentColor }}>email</span>
                                        <span className="break-all">{data.personal_info.email}</span>
                                    </div>
                                )}
                                {data.personal_info?.location && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold" style={{ color: accentColor }}>address</span>
                                        <span>{data.personal_info.location}</span>
                                    </div>
                                )}
                                {data.personal_info?.customLinks?.map((link, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="font-semibold" style={{ color: accentColor }}>{link.name.toLowerCase() || "link"}</span>
                                        <a href={link.url} target="_blank" className="break-all hover:underline">{link.url.replace(/^https?:\/\/(www\.)?/, '')}</a>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Work Experience */}
                        {data.experience && data.experience.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-wide">Work Experience</h2>
                                <div className="space-y-6 relative border-l-2 ml-2" style={{ borderColor: accentColor + '40' }}>
                                    {data.experience.map((exp, index) => (
                                        <div key={index} className="relative pl-6">
                                            {/* Timeline dot */}
                                            <div 
                                                className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                                                style={{ backgroundColor: accentColor, boxShadow: `0 0 0 4px ${accentColor}20` }}
                                            ></div>
                                            
                                            <p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>
                                                {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </p>
                                            <h3 className="text-base font-bold text-slate-800">{exp.position}</h3>
                                            <p className="text-sm font-medium text-slate-500 mb-2">{exp.company}</p>
                                            
                                            {exp.description && (
                                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        
                        {/* Projects */}
                        {data.project && data.project.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-wide">Projects</h2>
                                <div className="space-y-6 relative border-l-2 ml-2" style={{ borderColor: accentColor + '40' }}>
                                    {data.project.map((proj, index) => (
                                        <div key={index} className="relative pl-6">
                                            <div 
                                                className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                                                style={{ backgroundColor: accentColor, boxShadow: `0 0 0 4px ${accentColor}20` }}
                                            ></div>
                                            <h3 className="text-base font-bold text-slate-800">{proj.name}</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                                {proj.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                </div>
            </div>
            
            {/* Bottom left blob */}
            <div 
                className="absolute bottom-0 left-0 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/4 pointer-events-none"
                style={{ backgroundColor: accentColor }}
            ></div>
        </div>
    );
};

export default AestheticTemplate;
