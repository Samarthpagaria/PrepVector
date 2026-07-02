import { useMutation, useQuery } from "@tanstack/react-query";
import { setInterview, generateQuestions } from "../services/interview.api";
import { useInterviewStore } from "../store/useInterview.store";
import { useAuthStore } from "../../../store/useAuth.store";

export const useSetInterview = () => {
    return useMutation({
        mutationFn: (data: any) => {
            console.log("[useSetInterview] Starting mutation with data:", data);
            return setInterview(data);
        },
        onSuccess: (data) => {
            console.log("[useSetInterview] mutation success! Response Data:", data);
            
            const payload = data?.data || data;

            const store = useInterviewStore.getState();
            
            store.setRole(payload.role || "");
            store.setExperience(payload.experience || []);
            store.setProjects(payload.projects || []);
            store.setSkills(payload.skills || []);
            store.setResumeText(payload.resumeText || "");
            
            console.log("[useSetInterview] Zustand Store successfully updated with:", useInterviewStore.getState().resumeData);
        },
        onError: (error) => {
            console.log("[useSetInterview] mutation failed:", error);
        }
    })
}

export const useGenerateQuestions = () => {
    return useMutation({
        mutationFn: (data: any) => {
            console.log("[useGenerateQuestions] Starting mutation with data:", data);
            return generateQuestions(data);
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
