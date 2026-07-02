import axios from "axios"

const api = axios.create({ baseURL: "http://localhost:8000", withCredentials: true });

export const setInterview = async({
    role,experience,interviewType,resumeFile
}:{
    role:string,
    experience:string,
    interviewType:string,
    resumeFile?:File
}) => {
    const formData = new FormData();
    formData.append("role",role);
    formData.append("experience",experience);
    formData.append("interviewType",interviewType);
    if(resumeFile){
        formData.append("resume",resumeFile);
    }
    const response = await api.post("/api/v1/interview/resume/analyze",formData,{
        headers:{
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const generateQuestions = async (data: {
    role: string;
    experience: string;
    mode: string;
    resumeText: string;
    projects: string[];
    skills: string[];
}) => {
    const response = await api.post("/api/v1/interview/generate-questions", data);
    return response.data;
}

export const submitAnswerApi = async (data: {
    interviewId: string;
    questionIndex: number;
    answer: string;
    timeTaken: number;
}) => {
    const response = await api.post("/api/v1/interview/submit-answer", data);
    return response.data;
}

export const finishInterviewApi = async (data: {
    interviewId: string;
}) => {
    const response = await api.post("/api/v1/interview/finish-interview", data);
    return response.data;
}