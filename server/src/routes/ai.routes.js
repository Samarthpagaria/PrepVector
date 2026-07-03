import express from "express"
import { enhanceProfessionalSummary, enhanceJobDescription, enhanceProjectDescription, uploadResume } from "../controllers/aiController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

/**
 * @name enhanceProfessionalSummary
 * @description Controller for using AI to enhance a user's professional summary
 * @access Private
 * @path /api/v1/ai/enhance-pro-sum
 * @method POST
 */
router.post('/enhance-pro-sum', verifyJWT, enhanceProfessionalSummary)

/**
 * @name enhanceJobDescription
 * @description Controller for using AI to enhance a specific job description/experience
 * @access Private
 * @path /api/v1/ai/enhance-job-desc
 * @method POST
 */
router.post('/enhance-job-desc', verifyJWT, enhanceJobDescription)

/**
 * @name enhanceProjectDescription
 * @description Controller for using AI to enhance a specific project description
 * @access Private
 * @path /api/v1/ai/enhance-project-desc
 * @method POST
 */
router.post('/enhance-project-desc', verifyJWT, enhanceProjectDescription)

/**
 * @name uploadResume
 * @description Controller for parsing and processing an uploaded resume using AI
 * @access Private
 * @path /api/v1/ai/upload-resume
 * @method POST
 */
router.post('/upload-resume', verifyJWT, uploadResume)

export default router