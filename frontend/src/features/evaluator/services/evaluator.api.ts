import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
});

export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}: {
    jobDescription: string,
    selfDescription: string,
    resumeFile: File | null
}) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    if (resumeFile) {
        formData.append("resume", resumeFile);
    }
    
    const response = await api.post("/api/v1/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }); 
    return response.data;
};

export const getinterviewReportById = async (interviewId: string) => {
    const response = await api.get(`/api/v1/interview/evaluator-report/${interviewId}`);
    return response.data;
};

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/v1/interview/");
    return response.data;
};