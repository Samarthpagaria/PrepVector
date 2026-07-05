// Understand the code
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

export const updateResume = async (resumeId: string, resumeData: any, removeBackground: boolean = false) => {
    try {
        let updatedResumeData = structuredClone(resumeData);
        
        // Remove image from the JSON payload as it will be sent as a separate file field if it exists
        if (typeof resumeData.personal_info?.image === 'object') {
            delete updatedResumeData.personal_info.image;
        }

        const formData = new FormData();
        formData.append("resumeId", resumeId);
        
        // Ensure title is passed in body as expected by the controller
        if (updatedResumeData.title) {
            formData.append("title", updatedResumeData.title);
        }
        
        formData.append("resumeData", JSON.stringify(updatedResumeData));
        
        if (removeBackground) {
            formData.append("removebackground", "yes");
        }
        
        if (typeof resumeData.personal_info?.image === 'object') {
            formData.append("image", resumeData.personal_info.image);
        }

        console.log("[FRONTEND API] updateResume payload:", updatedResumeData);
        
        const response = await api.put("/api/v1/resumes/update", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log("[FRONTEND API] updateResume success response:", response.data);
        return response.data;
    } catch (error) {
        console.error("[FRONTEND API] updateResume error:", error);
        throw error;
    }
};

export const enhanceProfessionalSummary = async (prompt: string) => {
    const response = await api.post('/api/v1/ai/enhance-pro-sum', { userContent: prompt });
    return response.data;
};

export const enhanceJobDescription = async (prompt: string) => {
    const response = await api.post('/api/v1/ai/enhance-job-desc', { userContent: prompt });
    return response.data;
};

export const enhanceProjectDescription = async (prompt: string) => {
    const response = await api.post('/api/v1/ai/enhance-project-desc', { userContent: prompt });
    return response.data;
};

export const getPublicResumeById = async (resumeId: string) => {
    const response = await api.get(`/api/v1/resumes/public/${resumeId}`);
    return response.data;
};
