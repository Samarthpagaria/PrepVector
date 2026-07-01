import {useMutation,useQuery} from "@tanstack/react-query";
import {generateResume} from "../services/dashbaord.api.ts";

export const useGenerateResume = () => {
    return useMutation({
        mutationFn: (data: any) => {
            console.log("[useGenerateResume] Starting mutation with data:", data);
            return generateResume(data);
        },
        onSuccess: (data) => {
            console.log("[useGenerateResume] Mutation successful! Data:", data);
        },
        onError: (error) => {
            console.error("[useGenerateResume] Mutation failed:", error);
        }
    })
}