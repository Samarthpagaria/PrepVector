import { create } from "zustand";

interface EvaluatorState {
    report: any | null;
    setReport: (report: any) => void;
    reports: any[];
    setReports: (reports: any[]) => void;
}

export const useEvaluatorStore = create<EvaluatorState>((set) => ({
    report: null,
    setReport: (report) => set({ report }),
    reports: [],
    setReports: (reports) => set({ reports })
}));