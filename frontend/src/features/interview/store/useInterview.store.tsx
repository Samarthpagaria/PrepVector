import { create } from "zustand";

export interface ResumeData {
    role: string;
    experience: string[];
    mode: string;
    resumeFile: File | null;
    projects: string[];
    skills: string[];
    resumeText: string;
}

interface InterviewStore {
    resumeData: ResumeData;
    setRole: (role: string) => void;
    setExperience: (experience: string[]) => void;
    setMode: (mode: string) => void;
    setResumeFile: (resumeFile: File | null) => void;
    setProjects: (projects: string[]) => void;
    setSkills: (skills: string[]) => void;
    setResumeText: (resumeText: string) => void;
    clearResumeData: () => void;
}

export const useInterviewStore = create<InterviewStore>((set) => ({
    resumeData: {
        role: "",
        experience: [],
        mode: "",
        resumeFile: null,
        projects: [],
        skills: [],
        resumeText: "",
    },
    setRole: (role) => set((state) => ({
        resumeData: { ...state.resumeData, role }
    })),
    setExperience: (experience) => set((state) => ({
        resumeData: { ...state.resumeData, experience }
    })),
    setMode: (mode) => set((state) => ({
        resumeData: { ...state.resumeData, mode }
    })),
    setResumeFile: (resumeFile) => set((state) => ({
        resumeData: { ...state.resumeData, resumeFile }
    })),
    setProjects: (projects) => set((state) => ({
        resumeData: { ...state.resumeData, projects }
    })),
    setSkills: (skills) => set((state) => ({
        resumeData: { ...state.resumeData, skills }
    })),
    setResumeText: (resumeText) => set((state) => ({
        resumeData: { ...state.resumeData, resumeText }
    })),
    clearResumeData: () => set((state) => ({
        resumeData: { 
            role: "",
            experience: [],
            mode: "",
            resumeFile: null,
            projects: [],
            skills: [],
            resumeText: "",
        }
    })),
}));