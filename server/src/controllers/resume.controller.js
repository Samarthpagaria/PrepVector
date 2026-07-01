import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { User } from "../models/user.models.js";
import Resume from "../models/resume.models.js";
import imagekit from "../utils/imagekit.js";

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
 * @path /api/v1/resumes/delete/:resumeId
 * @method DELETE
 */
const deleteResume = asyncHandler(async (req, res) => {
  const resumeId = req.params.resumeId;
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
  const resumeId = req.params.resumeId;
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
 * @path /api/v1/resumes/public/:resumeId
 * @method GET
 */
const getPublicResumeById = asyncHandler(async (req, res) => {
  const resumeId = req.params.resumeId;
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
 * @path /api/v1/resumes/update
 * @method PUT
 */
const updateResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { resumeId, title, resumeData, removebackground } = req.body;
  const image = req.file;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  if (!resumeId || !resumeData || !title) {
    return res.status(400).json({
      message: "Please provide resume id , data and title.",
    });
  }
  let resumeDataCopy;
  if (typeof resumeData === 'string') {
    resumeDataCopy = await JSON.parse(resumeData);
  } else {
    resumeDataCopy = structuredClone(resumeData);
  }
  if (image) {
    const response = await imagekit.files.upload({
      file: image.buffer,
      fileName: image.originalname,
      folder:"user-resume",
      transformation: {
        pre:
          "w-300,h-300,fo-face,z-0.75" +
          (removebackground ? ",e-bgremove" : ""),
      },
    });
    resumeDataCopy.professional_info.image = response.url;
  }
  const resume = await Resume.findOneAndUpdate(
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
/**
 * @name getAllResumes
 * @description controller to get all resumes for a specific user
 * @access Private
 * @path /api/v1/resumes/get-all
 * @method GET
 */
const getAllResumes = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const resumes = await Resume.find({ userId })
    .select("-__v")
    .sort({ createdAt: -1 }); // sort by newest first

  return res.status(200).json({
    message: "Resumes fetched successfully",
    resumes,
  });
});

/**
 * @name updateResumeTitle
 * @description controller to update only the title of a resume
 * @access Private
 * @path /api/v1/resumes/update-title/:resumeId
 * @method PATCH
 */
const updateResumeTitle = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const resumeId = req.params.resumeId;
  const { title } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!resumeId || !title) return res.status(400).json({ message: "Resume ID and title are required" });

  const resume = await Resume.findOneAndUpdate(
    { userId, _id: resumeId },
    { title },
    { new: true }
  );

  if (!resume) return res.status(404).json({ message: "Resume not found" });

  return res.status(200).json({
    message: "Resume title updated successfully",
    resume,
  });
});

export { createResume, deleteResume, getResumeById, getPublicResumeById, updateResume, getAllResumes, updateResumeTitle };
