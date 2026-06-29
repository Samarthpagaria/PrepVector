import { generateInterviewReport, generateResumePdf } from "../services/ai.services.js";
import { InterviewReport } from "../models/interviewReport.model.js";
import { User } from "../models/user.models.js";
import { extractTextFromPdf } from "../utils/pdf.utils.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";

const getInterviewReportController = asyncHandler(async (req, res) => {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        message: "Resume PDF file is required",
      });
    }

    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.reportGenerationCount >= 20) {
      return res.status(403).json({
        message: "You have reached your limit of 20 free report generations.",
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
      user: user._id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    user.reportGenerationCount = (user.reportGenerationCount || 0) + 1;
    await user.save();

    return res.status(201).json({
      message: "Interview report generated successfully!!",
      interviewReport,
    });
});

const getInterviewReportById = asyncHandler(async (req, res) => {
  const { interviewId } = req.params;
  const userId = req.user._id || req.user.id;

  const report = await InterviewReport.findOne({ _id: interviewId, user: userId });
  if (!report) {
    return res.status(404).json({ message: "Report not found or unauthorized" });
  }

  return res.status(200).json(report);
});

const getAllInterviewReports = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const reports = await InterviewReport.find({ user: userId }).sort({ createdAt: -1 });
  
  return res.status(200).json(reports);
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

export { 
  getInterviewReportController, 
  generateResumePdfController,
  getInterviewReportById,
  getAllInterviewReports
};
