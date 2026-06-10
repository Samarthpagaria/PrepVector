import pdfParse from "pdf-parse";
import { generateInterviewReport, generateResumePdf } from "../services/ai.services.js";
import { InterviewReport } from "../models/interviewReport.model.js";

function cleanPdfText(text = "") {
  return text
    .replace(/\u0000/g, " ")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}
const getInterviewReportController = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        message: "Resume PDF file is required",
      });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeContent = cleanPdfText(pdfData.text);

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await InterviewReport.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(201).json({
      message: "Interview report generated successfully!!",
      interviewReport,
    });
  } catch (error) {
    console.error("Error generating interview report:", error);

    return res.status(500).json({
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
};

/**
 * @description Controller to generate resume PDF based on user self description, resume and jobDescription. 
 */
const generateResumePdfController = async (req, res) => {
    const { interviewReportId } = req.params;
    const report = await InterviewReport.findById(interviewReportId);
    
    if (!report) {
        return res.status(404).json({
            message: "Interview report not found",
        });
    }
    
    const { resume, jobDescription, selfDescription } = report;
    const pdfBuffer = await generateResumePdf({resume,jobDescription,selfDescription})

    if(!pdfBuffer){
        return res.status(500).json({
            message: "Failed to generate resume PDF",
        });
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="resume.pdf"`);
    res.send(pdfBuffer);
    
    
}
export { getInterviewReportController,generateResumePdfController };
