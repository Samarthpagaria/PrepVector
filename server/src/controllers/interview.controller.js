import { generateInterviewReport, generateResumePdf } from "../services/ai.services.js";
import { InterviewReport } from "../models/interviewReport.model.js";
import { extractTextFromPdf } from "../utils/pdf.utils.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";

const getInterviewReportController = asyncHandler(async (req, res) => {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        message: "Resume PDF file is required",
      });
    }

    const resumeContent = await extractTextFromPdf(req.file.buffer);

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
});

/**
 * @description Controller to generate resume PDF based on user self description, resume and jobDescription. 
 */
const generateResumePdfController = asyncHandler(async (req, res) => {
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
});
export { getInterviewReportController,generateResumePdfController };
