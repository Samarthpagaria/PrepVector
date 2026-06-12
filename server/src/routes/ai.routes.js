import express from "express"
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume } from "../controllers/aiController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/enhance-pro-sum', verifyJWT, enhanceProfessionalSummary)
router.post('/enhance-job-desc', verifyJWT, enhanceJobDescription)
router.post('/upload-resume', verifyJWT, uploadResume)
export default router