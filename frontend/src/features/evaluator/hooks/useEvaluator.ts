import { useMutation, useQuery } from "@tanstack/react-query";
import { generateInterviewReport, getAllInterviewReports, getinterviewReportById, generateResumePdf } from "../services/evaluator.api";
import { useEvaluatorStore } from "../store/useEvaluator.store";

export const useGenerateReport = () => {
    const setReport = useEvaluatorStore((state) => state.setReport);
    
    return useMutation({
        mutationFn: (data: any) => {
            console.log("[useGenerateReport] Starting mutation with data:", data);
            return generateInterviewReport(data);
        },
        onSuccess: (data) => {
            console.log("[useGenerateReport] Report generated successfully! Data:", data);
            
            // Just console logging and storing the full response object as requested
            // We can refine this later when the response type is known
            if (data && data.interviewReport) {
                setReport(data.interviewReport);
            } else {
                setReport(data);
            }
        },
        onError: (error) => {
            console.error("[useGenerateReport] Report generation failed:", error);
        }
    });
};

export const useGetAllReports = () => {
    return useQuery({
        queryKey: ["all-interview-reports"],
        queryFn: () => {
            console.log("[useGetAllReports] Fetching all reports...");
            return getAllInterviewReports();
        },
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401 || error?.response?.status === 404) {
                return false;
            }
            return failureCount < 3;
        }
    });
};

export const useGetReportById = (interviewId: string | undefined) => {
    return useQuery({
        queryKey: ["interview-report", interviewId],
        queryFn: () => {
            console.log(`[useGetReportById] Fetching report with ID: ${interviewId}`);
            return getinterviewReportById(interviewId as string);
        },
        enabled: !!interviewId,
        retry: (failureCount, error: any) => {
            console.log(`[useGetReportById] Retry attempt ${failureCount} for ID: ${interviewId}`, error);
            // Don't retry on 401 Unauthorized or 404 Not Found
            if (error?.response?.status === 401 || error?.response?.status === 404) {
                return false;
            }
            return failureCount < 3;
        }
    });
};

export const useGeneratePdf = () => {
    return useMutation({
        mutationFn: (interviewReportId: string) => {
            console.log(`[useGeneratePdf] Starting PDF generation for ID: ${interviewReportId}`);
            return generateResumePdf(interviewReportId);
        },
        onSuccess: (data, variables) => {
            console.log(`[useGeneratePdf] PDF generated successfully for ID: ${variables}`);
            const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `interview_strategy_${variables}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        },
        onError: (error) => {
            console.error("[useGeneratePdf] PDF generation failed:", error);
        }
    });
};