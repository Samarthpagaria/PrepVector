import { ArrowLeft, Briefcase, ChevronLeft, ChevronRight, FileText, FolderIcon, GraduationCap, Sparkles, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import BasicColorPicker from '../components/BasicColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'

const dummyResumeData: any[] = [
    { _id: '1', id: '1', title: 'Software Engineer Resume', personal_info: {} },
    { _id: '2', id: '2', title: 'Product Manager Resume', personal_info: {} }
]

const Resumebuilder = () => {
    const {resumeId}= useParams()
    const [resumeData,setResumeData] = useState<any>({
        _id: '',
        title: '',
        personal_info: {},
        skills: [],
        experience: [],
        education: [],
        professional_summary:'',
        projects: [],
        template: 'classic',
        accent_color: '#10b981', // emerald-500
        public:false
    })

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

    const loadExistingResume = async () => {
        const resume = dummyResumeData.find(resume=>resume._id  === resumeId || resume.id === resumeId)
        if (resume) {
            setResumeData(resume)
            document.title = resume.title
        }
    }

    useEffect(() => {
        loadExistingResume()
    }, [resumeId])

    const handlePersonalInfoChange = (field: string, value: any) => {
        setResumeData((prev: any) => ({
            ...prev,
            personal_info: {
                ...prev.personal_info,
                [field]: value
            }
        }))
    }
    
  return (
      <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans">
          <div className='w-full max-w-[1800px] mx-auto px-4 lg:px-8 py-6'>
              <Link to={'/app'} className='inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors'>
                <ArrowLeft className="w-5 h-5" />
                <span className='font-medium'>
                    Back to Dashboard
                </span>
              </Link>
          </div>
          <div className='w-full max-w-[1800px] mx-auto px-4 lg:px-8 pb-8'>
              <div className='grid lg:grid-cols-12 gap-8 lg:gap-12'>
                  {/* Left panel- Form */}
                  <div className='relative lg:col-span-5 rounded-xl overflow-hidden'>
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
                                          onChange={(color) => setResumeData((prev: any) => ({ ...prev, accent_color: color }))} 
                                      />
                                  </div>
                                  <TemplateSelector 
                                      selectedTemplate={resumeData.template || "classic"} 
                                      onChange={(id) => setResumeData((prev: any) => ({ ...prev, template: id }))} 
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
                                      onChange={(value) => setResumeData((prev: any) => ({ ...prev, professional_summary: value }))} 
                                  />
                              )}

                              {activeSection.id === 'experiences' && (
                                  <ExperienceForm 
                                      experiences={resumeData.experience || []} 
                                      onChange={(exp) => setResumeData((prev: any) => ({ ...prev, experience: exp }))} 
                                  />
                              )}
                              
                              {activeSection.id !== 'personal' && activeSection.id !== 'summary' && activeSection.id !== 'experiences' && (
                                  <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                                      <activeSection.icon className="w-12 h-12 mb-3 opacity-20" />
                                      <p>This section is under construction.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                    </div>
                    {/* Right panel- Preview */}
                    <div className='lg:col-span-7 max-lg:mt-6'>
                      <div className="mb-2">
                          {/* buttons (e.g. Download PDF, Change Template) will go here */}
                      </div>
                      <div 
                        className="bg-[#121214] border border-zinc-800/60 rounded-4xl overflow-hidden shadow-xl p-1 sm:p-3 flex justify-center h-[calc(100vh-140px)] sticky top-6"
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