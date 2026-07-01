import { ArrowLeft, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import BasicColorPicker from '../components/BasicColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useGetResumeById } from '../../dashboard/hooks/useDashbaord'
import { useResumeStore } from '../store/resumeStore'
import { useSaveResume } from '../hooks/useResumeBuilder';
import { useToastStore } from '../../../store/toastStore';

export const dummyResumeData: any[] = [
    { _id: '1', id: '1', title: 'Software Engineer Resume', personal_info: {} },
    { _id: '2', id: '2', title: 'Product Manager Resume', personal_info: {} }
]

const Resumebuilder = () => {
    const {resumeId}= useParams()
    const { resumeData, setResumeData, updateResumeData, updatePersonalInfo } = useResumeStore();
    const { mutate: saveResume } = useSaveResume();
    const { openToast } = useToastStore();

    const sections = [
        { id:"personal",name:"Personal Info",icon:User }, 
        { id:"summary",name:" Summary",icon:FileText }, 
        { id:"skills",name:"Skills",icon:Sparkles }, 
        { id:"experiences",name:"Experiences",icon:Briefcase }, 
        { id:"projects",name:"Projects",icon:FolderIcon },
        { id:"educations",name:"Educations",icon:GraduationCap }
    ]
    
    const [activeSectionIndex, setActiveSectionIndex] = useState(0)
    const activeSection = sections[activeSectionIndex]

    const { data: resumeResponse, isLoading } = useGetResumeById(resumeId || "");

    useEffect(() => {
        if (resumeResponse?.resume) {
            const fetchedData = { ...resumeResponse.resume };
            
            // Map professional_info (from backend AI schema) to personal_info (frontend form state)
            if (fetchedData.professional_info && !fetchedData.personal_info) {
                fetchedData.personal_info = fetchedData.professional_info;
            }
            
            setResumeData(fetchedData);
            document.title = fetchedData.title || "Resume Builder";
        }
    }, [resumeResponse]);

    const handlePersonalInfoChange = (field: string, value: any) => {
        updatePersonalInfo(field, value);
    }
    
    const changeResumeVisibility = () => {
        const newVisibility = !resumeData.isPublic;
        updateResumeData('isPublic', newVisibility);
        
        saveResume({ 
            resumeId: resumeData._id, 
            resumeData: { ...resumeData, isPublic: newVisibility } 
        }, {
            onSuccess: () => {
                openToast(`Resume is now ${newVisibility ? 'Public' : 'Private'}!`, 'success');
            },
            onError: () => {
                openToast('Failed to update visibility', 'error');
                updateResumeData('isPublic', !newVisibility); // Revert on error
            }
        });
    };

    const handleShare = async () => {
        const resumeUrl = `${window.location.origin}/view/${resumeId}`;
        if (navigator.share) {
            try {
                await navigator.share({ url: resumeUrl, title: "My Resume" });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            navigator.clipboard.writeText(resumeUrl);
            openToast('Link copied to clipboard!', 'success');
        }
    };

    const downloadResume = () => {
        window.print();
    };
  return (
      <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans print:bg-white">
          <style type="text/css" media="print">
            {`
              @page { size: auto; margin: 0mm; }
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background-color: white !important;
              }
            `}
          </style>
          <div className='w-full max-w-[1800px] mx-auto px-4 lg:px-8 py-6 flex justify-between items-center print:hidden'>
              <Link to={'/app'} className='inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors'>
                <ArrowLeft className="w-5 h-5" />
                <span className='font-medium max-sm:hidden'>
                    Back to Dashboard
                </span>
              </Link>

              <div className="flex items-center gap-3">
                  <button onClick={handleShare} className='flex items-center p-2 px-3 gap-2 text-sm font-medium bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer'>
                      <Share2Icon className='w-4 h-4'/>
                      <span className="max-sm:hidden">Share</span>
                  </button>
                  <button onClick={changeResumeVisibility} className='flex items-center p-2 px-3 gap-2 text-sm font-medium bg-zinc-800/50 text-zinc-300 rounded-lg border border-zinc-700/50 hover:bg-zinc-800 transition-all cursor-pointer'>
                      {resumeData.isPublic ? <EyeIcon className='w-4 h-4' /> : <EyeOffIcon className='w-4 h-4' />}
                      <span className="max-sm:hidden">{resumeData.isPublic ? 'Public' : 'Private'}</span>
                  </button>
                  <button onClick={downloadResume} className='flex items-center p-2 px-4 gap-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-lg shadow-lg shadow-emerald-500/20 transition-all cursor-pointer'>
                      <DownloadIcon className='w-4 h-4'/>
                      <span className="max-sm:hidden">Download</span>
                  </button>
              </div>
          </div>
          <div className='w-full max-w-[1800px] mx-auto px-4 lg:px-8 pb-8'>
              <div className='grid lg:grid-cols-12 gap-8 lg:gap-12'>
                  {/* Left panel- Form */}
                  <div className='relative lg:col-span-5 rounded-xl overflow-hidden print:hidden'>
                      <div className='bg-[#121214] rounded-xl shadow-xl border border-zinc-800/60 p-4 pt-0 flex flex-col min-h-[600px]'>
                          {/* Progress bar */}
                          <div className="pt-1 -mx-6 mb-6">
                            <div className="h-1 bg-zinc-800 w-full">
                                <div className='h-1 bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                                  style={{ width: `${(activeSectionIndex + 1) / sections.length * 100}%` }} />
                            </div>
                          </div>
                          
                          {/* Section navigations */}
                          <div className='flex justify-between items-center mb-4 pb-2 border-b border-zinc-800/60'>
                              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                                  <activeSection.icon className="w-5 h-5 text-emerald-500" />
                                  {activeSection.name}
                              </div>
                              <div className='flex items-center gap-2 sm:gap-4'>
                                  <div className="hidden sm:block">
                                      <BasicColorPicker 
                                          color={resumeData.accent_color || "#10b981"} 
                                          onChange={(color) => updateResumeData('accent_color', color)} 
                                      />
                                  </div>
                                  <TemplateSelector 
                                      selectedTemplate={resumeData.template || "classic"} 
                                      onChange={(id) => updateResumeData('template', id)} 
                                  />
                                  <div className='flex items-center gap-2'>
                                      <button 
                                    className='flex items-center gap-1 p-2 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed' 
                                    disabled={activeSectionIndex === 0} 
                                    onClick={() => setActiveSectionIndex((prev) => Math.max(prev-1, 0))}
                                  >
                                      <ChevronLeft className='w-4 h-4'/> Prev
                                  </button>
                                  <button 
                                    className='flex items-center gap-1 p-2 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed' 
                                    disabled={activeSectionIndex === sections.length - 1} 
                                    onClick={() => setActiveSectionIndex((prev) => Math.min(prev+1, sections.length-1))}
                                  >
                                      Next <ChevronRight className='w-4 h-4'/>
                                  </button>
                              </div>
                              </div>
                          </div>
                          
                          {/* Form Content */}
                          <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
                              {activeSection.id === 'personal' && (
                                  <PersonalInfoForm 
                                      data={resumeData.personal_info || {}} 
                                      onChange={handlePersonalInfoChange} 
                                  />
                              )}
                              
                              {activeSection.id === 'summary' && (
                                  <ProfessionalSummaryForm 
                                      summary={resumeData.professional_summary || ''} 
                                      onChange={(value) => updateResumeData('professional_summary', value)} 
                                  />
                              )}

                              {activeSection.id === 'experiences' && (
                                  <ExperienceForm 
                                      experiences={resumeData.experience || []} 
                                      onChange={(exp) => updateResumeData('experience', exp)} 
                                  />
                              )}

                              {activeSection.id === 'educations' && (
                                  <EducationForm 
                                      education={resumeData.education || []} 
                                      onChange={(edu) => updateResumeData('education', edu)} 
                                  />
                              )}

                              {activeSection.id === 'skills' && (
                                  <SkillsForm 
                                      skills={resumeData.skills || []} 
                                      onChange={(skills) => updateResumeData('skills', skills)} 
                                  />
                              )}

                              {activeSection.id === 'projects' && (
                                  <ProjectForm 
                                      projects={resumeData.project || []} 
                                      onChange={(proj) => updateResumeData('project', proj)} 
                                  />
                              )}
                              
                              {activeSection.id !== 'personal' && activeSection.id !== 'summary' && activeSection.id !== 'experiences' && activeSection.id !== 'educations' && activeSection.id !== 'skills' && activeSection.id !== 'projects' && (
                                  <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                                      <activeSection.icon className="w-12 h-12 mb-3 opacity-20" />
                                      <p>This section is under construction.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                    </div>
                    {/* Right panel- Preview */}
                    <div className='lg:col-span-7 max-lg:mt-6 print:col-span-12 print:m-0 print:w-full'>
                             <div 
                        className="bg-[#121214] border border-zinc-800/60 rounded-4xl overflow-hidden shadow-xl p-1 sm:p-3 flex justify-center h-[calc(100vh-140px)] sticky top-6 print:bg-transparent print:border-none print:shadow-none print:h-auto print:static print:overflow-visible print:!bg-none print:p-0"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08) 1px, transparent 1px, transparent 12px)'
                        }}
                      >
                        <ResumePreview 
                          data={resumeData} 
                          template={resumeData.template || "classic"} 
                          accentColor={resumeData.accent_color || "#10b981"} 
                        />
                      </div>
                    </div>
              </div>
          </div>
   </div>
  )
}

export default Resumebuilder