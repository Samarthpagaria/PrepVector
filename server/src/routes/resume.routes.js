import express from "express";
const router = express.Router();
import {
  createResume,
  deleteResume,
  getResumeById,
  getPublicResumeById,
  updateResume,
  getAllResumes,
  updateResumeTitle,
} from "../controllers/resume.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {uploadImage } from "../middlewares/multer.middleware.js";
/**
 * @name createResume
 * @description controller for creating a new resume
 * @access Private
 * @path /api/v1/resumes/create
 * @method POST
 */
router.route("/create").post(verifyJWT, createResume);

/**
 * @name getAllResumes
 * @description controller to get all resumes
 * @access Private
 * @path /api/v1/resumes/get-all
 * @method GET
 */
router.route("/get-all").get(verifyJWT, getAllResumes);

/**
 * @name deleteResume
 * @description controller for deleting a  resume
 * @access Private
 * @path /api/v1/resumes/delete/:resumeId
 * @method DELETE
 */
router.route("/delete/:resumeId").delete(verifyJWT, deleteResume);

/**
 * @name getResumeById
 * @description controller to get user resume by id
 * @access Private
 * @path /api/v1/resumes/get/:resumeId
 * @method GET
 */
router.route("/get/:resumeId").get(verifyJWT,getResumeById);

/**
 * @name getPublicResumeById
 * @description controller to get resume by using id but for public users
 * @access Public
 * @path /api/v1/resumes/public/:resumeId
 * @method GET
 */
router.route("/public/:resumeId").get(getPublicResumeById);

/**
 * @name updateResumeById
 * @description controller for updating a resume.
 * @access Private
 * @path /api/v1/resumes/update
 * @method PUT
 */
router
  .route("/update")
  .put(verifyJWT, uploadImage.single("image"), updateResume);

/**
 * @name updateResumeTitle
 * @description controller for updating a resume title inline.
 * @access Private
 * @path /api/v1/resumes/update-title/:resumeId
 * @method PATCH
 */
router.route("/update-title/:resumeId").patch(verifyJWT, updateResumeTitle);

export default router;
