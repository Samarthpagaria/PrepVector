import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials:true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const generateResume = async ({ title }: { title: string }) => {
    const response = await api.post("/api/v1/resumes/create", { title })
    return response.data
}
export const uploadExistingResume = async({title,resumeText}:{title:string,resumeText:string})=>{
const response = await api.post("/api/v1/ai/upload-resume",{title,resumeText})
return response.data
}

export const getAllResumes = async () => {
    const response = await api.get("/api/v1/resumes/get-all")
    return response.data
}

export const deleteResume = async (resumeId: string) => {
    const response = await api.delete(`/api/v1/resumes/delete/${resumeId}`)
    return response.data
}

export const updateResumeTitle = async ({ resumeId, title }: { resumeId: string, title: string }) => {
    const response = await api.patch(`/api/v1/resumes/update-title/${resumeId}`, { title })
    return response.data
}

export const getResumeById = async (resumeId: string) => {
    const response = await api.get(`/api/v1/resumes/get/${resumeId}`)
    return response.data
}