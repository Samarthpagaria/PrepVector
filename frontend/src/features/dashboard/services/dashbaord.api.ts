import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials:true
})

export const generateResume = async ({ title }: { title: string }) => {
    const response = await api.post("/api/v1/resumes/create", { title })
    return response.data
}
export const uploadResume = async({title,resumeText}:{title:string,resumeText:string})=>{
const response = await api.post("/api/v1/resumes/upload",{title,resumeText})
return response.data
}