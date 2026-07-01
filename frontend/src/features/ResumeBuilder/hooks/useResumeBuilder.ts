import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateResume } from "../services/resumeBuilder.api";
import { useToastStore } from "../../../store/toastStore";

export const useSaveResume = () => {
    const openToast = useToastStore(state => state.openToast);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ resumeId, resumeData, removeBackground }: { resumeId: string, resumeData: any, removeBackground?: boolean }) => {
            return updateResume(resumeId, resumeData, removeBackground);
        },
        onSuccess: (data) => {
            openToast("Resume saved successfully!");
            queryClient.invalidateQueries({ queryKey: ["resume", data.resume?._id] });
            queryClient.invalidateQueries({ queryKey: ["allResumes"] });
        },
        onError: (error: any) => {
            console.error("[useSaveResume] Error:", error);
            const errMsg = error?.response?.data?.message || error.message || "Failed to save resume";
            openToast(errMsg, 'error');
        }
    });
};
