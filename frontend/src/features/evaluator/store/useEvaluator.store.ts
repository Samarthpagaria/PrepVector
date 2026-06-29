import { create } from "zustand";

export interface TechnicalQuestion {
    question: string;
    intention: string;
    answer: string;
}

export interface BehavioralQuestion {
    question: string;
    intention: string;
    answer: string;
}

export interface SkillGap {
    skill: string;
    severity: "Minor" | "Moderate" | "Critical";
}

export interface PreparationTask {
    day: string;
    focus: string;
    tasks: string[];
}

export interface InterviewReport {
    _id?: string;
    jobDescription: string;
    resume: string;
    selfDescription: string;
    matchScore: number;
    title: string;
    technicalQuestions: TechnicalQuestion[];
    behavioralQuestions: BehavioralQuestion[];
    skillGaps: SkillGap[];
    preparationPlan: PreparationTask[];
    user?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface EvaluatorState {
    report: InterviewReport | null;
    setReport: (report: InterviewReport | null) => void;
    reports: InterviewReport[];
    setReports: (reports: InterviewReport[]) => void;
}

export const useEvaluatorStore = create<EvaluatorState>((set) => ({
    report: null,
    setReport: (report) => set({ report }),
    reports: [],
    setReports: (reports) => set({ reports }),
}));