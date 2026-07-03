import React from 'react';

const StudioTemplate = ({ data, accentColor }) => {
    // Strictly adhering to the prompt colors
    const bgColor = "#F7F6F2";
    const darkColor = "#2C2C2C";
    const primaryText = "#1A1A1A";
    const secondaryText = "#666666";
    const lightText = "#E8E8E8";
    const accentOrange = accentColor || "#D4A259";
    const borderColor = "#E8E8E8";
    const emptyDot = "#D1D1D1";

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.toLowerCase() === 'present') return 'Present';
        const parts = dateStr.split("-");
        if (parts.length === 1) return parts[0];
        const [year, month] = parts;
        if (!month) return year;
        return year; // Format prefers just the year "2030" or "2028 - 2030"
    };

    const fullName = data.personal_info?.full_name || "Your Name";
    const nameParts = fullName.split(' ');
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

    const QuoteIcon = ({ className }) => (
        <svg viewBox="0 0 24 24" fill={accentOrange} className={className}>
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
    );

    const SectionTitle = ({ children }) => (
        <div className="mb-[12px]">
            <h2 className="text-[10px] font-semibold tracking-[2px] uppercase" style={{ color: primaryText }}>
                {children}
            </h2>
            <div className="h-[1px] w-full mt-1.5" style={{ backgroundColor: borderColor }}></div>
        </div>
    );

    return (
        <div className="w-full min-h-full font-sans pb-16 bg-[#E5E5E5] flex justify-center relative">
            {/* PAPER CONTAINER (US Letter aspect) */}
            <div className="w-[8.5in] min-h-[11in] relative shadow-2xl overflow-hidden" style={{ backgroundColor: bgColor }}>
                
                {/* VERTICAL "RESUME" TEXT (Huge & half cut) */}
                <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center z-0 pointer-events-none opacity-[0.04]">
                    <div className="-rotate-90 whitespace-nowrap">
                        <span className="text-[160px] font-[900] tracking-[12px] uppercase" style={{ color: darkColor, lineHeight: 1 }}>
                            RESUME
                        </span>
                    </div>
                </div>

                {/* CONTENT CONTAINER (~80% width, centered) */}
                <div className="w-full px-[10%] mx-auto relative z-10 flex">
                    
                    {/* ================= LEFT MASTER COLUMN ================= */}
                    <div className="w-[185px] shrink-0 relative flex flex-col pb-[60px]">
                        
                        {/* Absolute Photo Frame (Overlaps the dark block) */}
                        <div className="absolute top-[40px] left-0 z-30 w-[140px] h-[170px] rounded-[20px] overflow-hidden bg-gray-300 shadow-xl">
                            {data.personal_info?.image ? (
                                <img 
                                    src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover grayscale contrast-125 brightness-90"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-500 font-medium text-[12px]">No Image</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Left Vertical Dark Card (Summary) */}
                        <div className="w-full bg-[#2C2C2C] rounded-[20px] pt-[140px] p-[20px] pb-[30px] mt-[80px] relative z-20 min-h-[260px]">
                            {/* Quote Icon - Negative margin to sit OVER the photo */}
                            <div className="relative z-40 mt-[-50px] mb-[10px] ml-[-10px]">
                                <QuoteIcon className="w-[42px] h-[42px]" />
                            </div>
                            
                            {data.professional_summary ? (
                                <p className="text-[11px] italic font-light leading-[1.6] relative z-20" style={{ color: lightText }}>
                                    {data.professional_summary}
                                </p>
                            ) : (
                                <p className="text-[11px] italic font-light leading-[1.6] relative z-20" style={{ color: lightText }}>
                                    Dedicated professional seeking new opportunities to leverage skills and expertise.
                                </p>
                            )}
                        </div>

                        {/* Skills Section */}
                        <div className="mt-[40px]">
                            {data.skills?.length > 0 && (
                                <div>
                                    <SectionTitle>Skills</SectionTitle>
                                    <div className="flex flex-wrap gap-[8px] mt-[16px]">
                                        {data.skills.map((skill, i) => (
                                            <div 
                                                key={i} 
                                                className="px-[12px] py-[6px] rounded-md text-[10px] font-bold border"
                                                style={{ borderColor: borderColor, color: primaryText, backgroundColor: "#ffffff" }}
                                            >
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* ================= RIGHT MASTER COLUMN ================= */}
                    <div className="flex-1 pl-[30px] flex flex-col pb-[60px]">
                        
                        {/* Name & Title */}
                        <div className="pt-[50px] min-h-[140px] relative z-20">
                            <h1 className="text-[48px] font-[800] leading-[0.95] tracking-[-0.03em]" style={{ color: primaryText }}>
                                {firstName} <br/>
                                {lastName}
                            </h1>
                            {data.personal_info?.profession && (
                                <p className="text-[12px] font-normal tracking-[1.5px] mt-3" style={{ color: primaryText }}>
                                    {data.personal_info.profession}
                                </p>
                            )}
                        </div>

                        {/* Right Horizontal Contact Bar */}
                        {/* ml-[-30px] perfectly bridges the gap back to the Left Dark Card */}
                        <div className="ml-[-30px] rounded-[20px] rounded-l-none mt-[10px] p-[24px] relative z-10 flex flex-col justify-center min-h-[80px]" style={{ backgroundColor: darkColor }}>
                            
                            {/* Concave Curve Masks */}
                            <div className="absolute top-[-20px] left-0 w-[20px] h-[20px]" style={{ backgroundColor: darkColor }}>
                                <div className="absolute top-0 right-0 w-[20px] h-[20px] rounded-bl-[20px]" style={{ backgroundColor: bgColor }}></div>
                            </div>
                            <div className="absolute bottom-[-20px] left-0 w-[20px] h-[20px]" style={{ backgroundColor: darkColor }}>
                                <div className="absolute bottom-0 right-0 w-[20px] h-[20px] rounded-tl-[20px]" style={{ backgroundColor: bgColor }}></div>
                            </div>

                            {/* Contact Information */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[24px]">
                                {/* Accent Button */}
                                <div className="flex items-center gap-2 shrink-0 border rounded-full px-3 py-1" style={{ borderColor: accentOrange }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke={accentOrange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                    <span className="text-[11px] font-semibold" style={{ color: accentOrange }}>Contact</span>
                                </div>
                                
                                <div className="text-[10px] leading-[1.7] tracking-[0.3px] w-full" style={{ color: lightText }}>
                                    {data.personal_info?.email && (
                                        <div className="truncate">{data.personal_info.email}</div>
                                    )}
                                    {data.personal_info?.phone && (
                                        <div>Tel. {data.personal_info.phone}</div>
                                    )}
                                    {data.personal_info?.address && (
                                        <div className="truncate">Address: {data.personal_info.address}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Projects & Experience (Flows naturally UP underneath the contact bar!) */}
                        <div className="flex gap-[25px] mt-[40px]">
                            
                            {/* Column A (45% width - Projects, Education) */}
                            <div className="w-[45%] flex flex-col gap-[32px] border-r pr-[25px]" style={{ borderColor: borderColor }}>
                                
                                {/* Projects */}
                                {data.project?.length > 0 && (
                                    <div>
                                        <SectionTitle>Projects</SectionTitle>
                                        <div className="flex flex-col gap-[20px] mt-[16px]">
                                            {data.project.map((proj, i) => (
                                                <div key={i}>
                                                    <div className="text-[20px] font-[800] leading-none mb-1.5" style={{ color: accentOrange }}>
                                                        202{5 - (i % 3)}
                                                    </div>
                                                    <div className="text-[12px] font-bold mb-1.5" style={{ color: primaryText }}>
                                                        {proj.name}
                                                    </div>
                                                    <p className="text-[10px] leading-[1.6]" style={{ color: secondaryText }}>
                                                        {proj.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {data.education?.length > 0 && (
                                    <div>
                                        <SectionTitle>Education</SectionTitle>
                                        <div className="flex flex-col gap-[20px] mt-[16px]">
                                            {data.education.map((edu, i) => (
                                                <div key={i}>
                                                    <div className="text-[20px] font-[800] leading-none mb-1.5" style={{ color: accentOrange }}>
                                                        {formatDate(edu.graduation_date) || formatDate(edu.end_date) || "2020"}
                                                    </div>
                                                    <div className="text-[12px] font-bold mb-1" style={{ color: primaryText }}>
                                                        {edu.degree}
                                                    </div>
                                                    <div className="text-[10px]" style={{ color: secondaryText }}>
                                                        {edu.institution}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Column B (55% width - Experience) */}
                            <div className="w-[55%] flex flex-col gap-[32px]">
                                {data.experience?.length > 0 && (
                                    <div>
                                        <SectionTitle>Experience</SectionTitle>
                                        <div className="flex flex-col gap-[20px] mt-[16px]">
                                            {data.experience.map((exp, i) => (
                                                <React.Fragment key={i}>
                                                    <div>
                                                        <div className="text-[10px] font-bold mb-1" style={{ color: accentOrange }}>
                                                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                                        </div>
                                                        <div className="text-[12px] font-[600] mb-1" style={{ color: primaryText }}>
                                                            {exp.position}
                                                        </div>
                                                        <div className="text-[11px] font-normal mb-3" style={{ color: secondaryText }}>
                                                            {exp.company}
                                                        </div>
                                                        
                                                        {/* Description Bullets */}
                                                        <ul className="text-[10px] leading-[1.6] space-y-1.5 pl-3" style={{ color: secondaryText }}>
                                                            {exp.description ? exp.description.split('\n').filter(p => p.trim()).map((point, idx) => (
                                                                <li key={idx} className="relative before:absolute before:left-[-12px] before:top-[5px] before:w-[3px] before:h-[3px] before:rounded-full before:bg-[#D4A259]">
                                                                    {point}
                                                                </li>
                                                            )) : (
                                                                <li className="relative before:absolute before:left-[-12px] before:top-[5px] before:w-[3px] before:h-[3px] before:rounded-full before:bg-[#D4A259]">
                                                                    Responsibility and achievement details.
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                    
                                                    {/* Dashed Separator */}
                                                    {i < data.experience.length - 1 && (
                                                        <div className="w-full border-t border-dashed" style={{ borderColor: "#E0E0E0" }}></div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudioTemplate;
