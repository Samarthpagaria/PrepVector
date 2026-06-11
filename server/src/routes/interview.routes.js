import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadFile } from "../middlewares/multer.middleware.js";
import { getInterviewReportController, generateResumePdfController } from "../controllers/interview.controller.js";

const router = express.Router();

router.use(authMiddleware);
/**
 * @route POST /api/interview/report
 * @desc Generates an interview report based on resume, job description, and self-description.
 * @access Private
 */
router.post("/", uploadFile.single("resume"), getInterviewReportController);
/**
 * @route POST /api/interview/report/:interviewReportId/pdf
 * @desc Generates a PDF of the interview report.
 * @access Private
 */
router.post("/resume/pdf/:interviewReportId", generateResumePdfController);

export default router;
