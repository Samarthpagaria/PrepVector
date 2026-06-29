import { useMutation, useQuery } from "@tanstack/react-query";
import { generateInterviewReport, getAllInterviewReports, getinterviewReportById } from "../services/evaluator.api";
import { useEvaluatorStore } from "../store/useEvaluator.store";

export const useGenerateReport = () => {
    const setReport = useEvaluatorStore((state) => state.setReport);
    
    return useMutation({
        mutationFn: generateInterviewReport,
        onSuccess: (data) => {
            console.log("Report generated successfully!", data);
            
            // Just console logging and storing the full response object as requested
            // We can refine this later when the response type is known
            if (data && data.interviewReport) {
                setReport(data.interviewReport);
            } else {
                setReport(data);
            }
        },
        onError: (error) => {
            console.error("Report generation failed:", error);
        }
    });
};