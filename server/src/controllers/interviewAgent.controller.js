import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { extractTextFromPdf } from "../utils/pdf.utils.js";
import { askAI } from "../services/ai.interview.services.js";

/**
 * @description: This is a controller that will analyze the resume and return the structured data.
 * @access : Private
 * @method : POST
 * @path : /api/v1/interview/analyze-resume
 */
export const analyzeResume = asyncHandler(async (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({
            success: false,
            message: "Resume PDF file is required"
        });
    }

    const resumeText = await extractTextFromPdf(req.file.buffer);
    const messages = [{
        role: "system", content: `
        Extract structured data from the resume.
        Return strictly JSON:
        {
        "role":"string",
        "experience":"string",
        "projects":["project1","project2"],
        "skills":["skill1","skill2"]
        }
        `}, {
            role: "user", content: `Resume Text:
        ${resumeText}`}
    ]
    const airesponse = await askAI(messages)
    const parsed = JSON.parse(airesponse);

});