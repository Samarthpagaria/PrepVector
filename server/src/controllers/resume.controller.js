import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { User } from "../models/user.models.js";
import { Resume } from "../models/resume.models.js";

/**
 * @name createResume
 * @description controller for creating a new resume
 * @access Private
 * @path /api/v1/resumes/create
 * @method POST
 */
const createResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { title } = req.body;
  // create resume
  const newResume = await Resume.create({
    userId,
    title,
  });
  return res.status(201).json({
    message: "Resume created successfully",
    resume: newResume,
  });
});

/**
 * @name deleteResume
 * @description controller for deleting a  resume
 * @access Private
 * @path /api/v1/resumes/delete/:id
 * @method DELETE
 */
const deleteResume = asyncHandler(async (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user._id;

  const deletedResume = await Resume.findOneAndDelete({
    userId,
    _id: resumeId,
  });

  if (!deletedResume) {
    return res.status(404).json({
      message: "Resume not found",
    });
  }

  return res.status(200).json({
    message: "Resume deleted successfully",
  });
});

/**
 * @name getResumeById
 * @description controller to get user resume by id
 * @access Private
 * @path /api/v1/resumes/get/:id
 * @method GET
 */
const getResumeById = asyncHandler(async (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  if (!resumeId) {
    return res.status(400).json({
      message: "Resume id is required",
    });
  }
  const resume = await Resume.findOne({
    userId,
    _id: resumeId,
  }).select(" -__v -createdAt -updatedAt");
  if (!resume) {
    return res.status(404).json({
      message: "Resume not found",
    });
  }
  return res.status(200).json({
    message: "Resume fetched successfully",
    resume,
  });
});

/**
 * @name getPublicResumeById
 * @description controller to get resume by using id but for public users
 * @access Public
 * @path /api/v1/resumes/public/:id
 * @method GET
 */
const getPublicResumeById = asyncHandler(async (req, res) => {
  const resumeId = req.params.id;
  if (!resumeId)
    return res.status(400).json({ message: "Resume id is required" });
  const resume = await Resume.findOne({
    _id: resumeId,
    isPublic: true,
  }).select(" -__v -createdAt -updatedAt");
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  return res
    .status(200)
    .json({ message: "Resume fetched successfully", resume });
});

/**
 * @name updateResumeById
 * @description controller for updating a resume.
 * @access Private
 * @path /api/v1/resumes/update/:id
 * @method PUT
 */
const updateResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { title, resumeId, resumeData, removebackground } = req.body;
  const image = req.file;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  if (!resumeId || !resumeData || title) {
    return res.status(400).json({
      message: "Please provide resume id , data and title.",
    });
  }
  let resumeDataCopy = JSON.parse(resumeData);
  const resume = await Resume.findByIdAndUpdate(
    { userId, _id: resumeId },
    resumeDataCopy,
    {
      new: true,
    }
  );
  if (!resume) {
    return res.status(404).json({
      message: "Resume not found",
    });
  }
  return res.status(200).json({
    message: "Resume updated successfully",
    resume,
  });
});
export { createResume, deleteResume, getResumeById, getPublicResumeById };
