import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setInterview, generateQuestions, submitAnswerApi, finishInterviewApi, getMyInterviewsApi, getInterviewReportApi } from "../services/interview.api";
import { useInterviewStore } from "../store/useInterview.store";
import { useAuthStore } from "../../../store/useAuth.store";


export const useSetInterview = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            console.log("[FRONTEND] useSetInterview called with data:", data);
            return await setInterview(data);
        },
        onSuccess: (data) => {
            console.log("[useSetInterview] mutation success! Response Data:", data);
            
            const payload = data?.data || data;

            const store = useInterviewStore.getState();
            
            // Note: role and experience are passed from the UI into the store earlier, but we can set them here if needed
            store.setProjects(payload.projects || []);
            store.setSkills(payload.skills || []);
            store.setResumeText(payload.experience || "");
            
            console.log("[useSetInterview] Zustand Store successfully updated with:", useInterviewStore.getState().resumeData);
        },
        onError: (error) => {
            console.log("[useSetInterview] mutation failed:", error);
        }
    });
};

export const useGenerateQuestions = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            console.log("[FRONTEND] useGenerateQuestions called");
            return await generateQuestions(data);
        },
        onSuccess: (data) => {
            console.log("[useGenerateQuestions] mutation success! Response Data:", data);
            const payload = data?.data || data;
            
            // Deduct credits from user store if creditsLeft is returned
            if (payload.creditsLeft !== undefined) {
                const authStore = useAuthStore.getState();
                if (authStore.user) {
                    authStore.setUser({
                        ...authStore.user,
                        credits: payload.creditsLeft
                    });
                }
            }
        },
        onError: (error) => {
            console.log("[useGenerateQuestions] mutation failed:", error);
        }
    })
}

export const useSubmitAnswer = () => {
    return useMutation({
        mutationFn: async (data: { interviewId: string; questionIndex: string; answer: string; timeTaken: number }) => {
            console.log("[FRONTEND] useSubmitAnswer called for Question:", data.questionIndex);
            return await submitAnswerApi(data);
        },
        onSuccess: (data) => {
            console.log("[useSubmitAnswer] mutation success! Response Data:", data);
        },
        onError: (error) => {
            console.log("[useSubmitAnswer] mutation failed:", error);
        }
    })
}

export const useFinishInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { interviewId: string }) => {
            console.log("[FRONTEND] useFinishInterview called for Interview ID:", data.interviewId);
            return await finishInterviewApi(data);
        },
        onSuccess: (data) => {
            console.log("[useFinishInterview] mutation success! Response Data:", data);
            queryClient.invalidateQueries({ queryKey: ["interviews"] });
        },
        onError: (error) => {
            console.log("[useFinishInterview] mutation failed:", error);
        }
    })
}

export const useGetMyInterviews = () => {
    return useQuery({
        queryKey: ["interviews"],
        queryFn: getMyInterviewsApi
    });
};

export const useGetInterviewReport = (interviewId: string) => {
    return useQuery({
        queryKey: ["interview-report", interviewId],
        queryFn: () => getInterviewReportApi(interviewId),
        enabled: !!interviewId,
    });
};
