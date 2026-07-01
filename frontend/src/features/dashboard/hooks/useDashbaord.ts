import {useMutation,useQuery} from "@tanstack/react-query";
import {generateResume,uploadExistingResume,getAllResumes,deleteResume,updateResumeTitle,getResumeById} from "../services/dashbaord.api.ts";

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

export const useUploadExistingResume = () => {
    return useMutation({
        mutationFn: (data: any) => {
            console.log("[useUploadExistingResume] Starting mutation with data:", data);
            return uploadExistingResume(data);
        },
        onSuccess: (data) => {
            console.log("[useUploadExistingResume] Mutation successful! Data:", data);
        },
        onError: (error) => {
            console.error("[useUploadExistingResume] Mutation failed:", error);
        }
    })
}

export const useGetAllResumes = () => {
    return useQuery({
        queryKey: ["allResumes"],
        queryFn: getAllResumes,
        retry: false,
    })
}

export const useDeleteResume = () => {
    return useMutation({
        mutationFn: (resumeId: string) => {
            return deleteResume(resumeId);
        }
    })
}

export const useUpdateResumeTitle = () => {
    return useMutation({
        mutationFn: (data: { resumeId: string, title: string }) => {
            return updateResumeTitle(data);
        }
    })
}

export const useGetResumeById = (resumeId: string) => {
    return useQuery({
        queryKey: ["resume", resumeId],
        queryFn: () => getResumeById(resumeId),
        enabled: !!resumeId
    })
}