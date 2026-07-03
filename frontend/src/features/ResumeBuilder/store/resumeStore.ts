import { create } from 'zustand';

interface ResumeData {
  _id: string;
  title: string;
  personal_info: any;
  skills: string[];
  experience: any[];
  education: any[];
  professional_summary: string;
  project: any[];
  template: string;
  accent_color: string;
  public: boolean;
  [key: string]: any;
}

interface ResumeStore {
  resumeData: ResumeData;
  setResumeData: (data: Partial<ResumeData>) => void;
  updateResumeData: (field: string, value: any) => void;
  updatePersonalInfo: (field: string, value: any) => void;
}

const defaultResumeData: ResumeData = {
  _id: '',
  title: '',
  personal_info: {},
  skills: [],
  experience: [],
  education: [],
  professional_summary: '',
  project: [],
  template: 'classic',
  accent_color: '#10b981',
  public: false
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeData: defaultResumeData,
  
  // Replace the entire resume object (or multiple fields)
  setResumeData: (data) => set((state) => {
    console.log("[ZUSTAND STORE] setResumeData payload:", data);
    return { resumeData: { ...state.resumeData, ...data } };
  }),
  
  // Update a top-level field (e.g., 'professional_summary', 'experience')
  updateResumeData: (field, value) => set((state) => {
    console.log(`[ZUSTAND STORE] updateResumeData | field: ${field}, value:`, value);
    return {
      resumeData: {
        ...state.resumeData,
        [field]: value
      }
    };
  }),
  
  // Specifically update nested personal_info fields
  updatePersonalInfo: (field, value) => set((state) => {
    console.log(`[ZUSTAND STORE] updatePersonalInfo | field: ${field}, value:`, value);
    return {
      resumeData: {
        ...state.resumeData,
        personal_info: {
          ...state.resumeData.personal_info,
          [field]: value
        }
      }
    };
  })
}));
