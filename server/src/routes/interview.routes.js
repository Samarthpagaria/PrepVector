import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadFile } from "../middlewares/multer.middleware.js";
import { 
  getInterviewReportController, 
  generateResumePdfController,
  getInterviewReportById,
  getAllInterviewReports
} from "../controllers/interview.controller.js";
import { analyzeResume, generateQuestion, submitAnswer, finishInterview, getMyInterviews, getInterviewReport } from "../controllers/interviewAgent.controller.js";
const router = express.Router();

router.use(verifyJWT);

/**
 * @route POST /api/interview/
 * @desc Generates an interview report based on resume, job description, and self-description.
 * @access Private
 */
router.post("/", uploadFile.single("resume"), getInterviewReportController);

/**
 * @route GET /api/interview/
 * @desc Retrieves all evaluator interview reports for the user
 * @access Private
 */
router.get("/", getAllInterviewReports);

/**
 * @route GET /api/interview/evaluator-report/:interviewId
 * @desc Retrieves a specific evaluator interview report
 * @access Private
 */
router.get("/evaluator-report/:interviewId", getInterviewReportById);

/**
 * @route POST /api/interview/report/:interviewReportId/pdf
 * @desc Generates a PDF of the interview report.
 * @access Private
 */
router.post("/resume/pdf/:interviewReportId", generateResumePdfController);

// video 3 routes of Ai agent interview 
/**
 * @route POST /api/v1/interview/resume/analyze
 * @desc Analyzes the resume and returns structured data.
 * @access Private
 */
router.post("/resume/analyze", uploadFile.single("resume"), analyzeResume);

/**
 * @route POST /api/v1/interview/generate-questions
 * @desc Generates questions based on the resume text and interview mode.
 * @access Private
 */
router.post("/generate-questions", generateQuestion);

/**
 * @route POST /api/v1/interview/submit-answer
 * @desc Evaluates the candidate's answer and provides a score and feedback.
 * @access Private
 */
router.post("/submit-answer", submitAnswer);

/**
 * @route POST /api/v1/interview/finish-interview
 * @desc Calculates final scores and completes the interview.
 * @access Private
 */
router.post("/finish-interview", finishInterview);

/**
 * @route GET /api/v1/interview/get-interview
 * @desc Retrieves all interviews for the currently authenticated user.
 * @access Private
 */
router.get("/get-interview", getMyInterviews);

/**
 * @route GET /api/v1/interview/report/:interviewId
 * @desc Retrieves the detailed report for a specific interview.
 * @access Private
 */
router.get("/report/:interviewId", getInterviewReport);
export default router;
