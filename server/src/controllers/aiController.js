import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { User } from "../models/user.models.js";
import Resume from "../models/resume.models.js";
import ai_model from "../utils/ai.js";

/**
 * @name enhanceProfessionalSummary
 * @description controller for enhancing a resume's professional summary.
 * @access Private
 * @path /api/v1/ai/enhance-pro-sum
 * @method POST
 */
const enhanceProfessionalSummary = asyncHandler(async (req, res) => {
  const { userContent } = req.body;

  if (!userContent) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const response = await ai_model.invoke([
    {
      role: "system",
      content: `You are an expert in resume writing.
                Your task is to enhance the professional summary of a resume.
                The summary should be 1-2 sentences also highlighting key skills,
                experience, and career objectives. Make it compelling and
                ATS-friend1y. and only return text(final response text) no options or anything else.`,
    },
    {
      role: "user",
      content: userContent,
    },
  ]);
  if (!response) {
    return res.status(500).json({
      success: false,
      message: "Failed to enhance professional summary",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Professional summary enhanced successfully",
    data: response.content,
  });
});

/**
 * @name enhanceJobDescription
 * @description controller for enhancing a resume's Job Description 
 * @access Private
 * @path /api/v1/ai/enhance-job-desc
 * @method POST
 */
const enhanceJobDescription = asyncHandler(async (req, res) => {
    const { userContent } = req.body;
    if(!userContent){
        return res.status(400).json({
            success:false,
            message:"Missing required fields"
        })
    }
    const response = await ai_model.invoke([
        {
            role:"system",
            content:`You are an expert in resume writing. Your task is to
            enhance the job description of a resume. The job description
            should be only in 1-2 sentence also highlighting key
            responsibilities and achievements. Use action verbs and
            quantifiable results where possible. Make it ATS-friend1y. and
            only return text no options or anything else.   `,
        },
        {
            role:"user",
            content:userContent,
        },
    ]);
    if(!response){
        return res.status(500).json({
            success:false,
            message:"Failed to enhance job description"
        })
    }
    return res.status(200).json({
        success:true,
        message:"job description enhanced successfully",
        data:response.content,
    })
})

/**
 * @name uploadResume
 * @description controller for uploading a resume to the database
 * @access Private
 * @path /api/v1/ai/upload-resume
 * @method POST
 */
const uploadResume = asyncHandler(async (req, res) => {
  const { resumeText, title } = req.body;
  const userId = req.user?._id;
  
  console.log(`[Backend - uploadResume] Received request from userId: ${userId}`);
  console.log(`[Backend - uploadResume] Title: "${title}", Text Length: ${resumeText?.length}`);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!resumeText || !title) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const systemPrompt =
    "You are an expert AI agent to extract data from resumes. Return only valid JSON. Do not include markdown, explanations, notes, or extra text before or after the JSON.";

  const userPrompt = `extract data from this resume: ${resumeText}
    
Provide the data in the following JSON format with no additional text before or after.
The meaning of "type" in the schema below is only to describe the expected data type for each field.
Your actual output must be a plain JSON object with real values, arrays, booleans, and strings matching this schema shape.

{
  "professional_summary": "",
  "skills": [],
  "professional_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "email": "",
    "portfolio": "",
    "github": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "url": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "start_date": "",
      "graduation_date": "",
      "field": "",
      "gpa": ""
    }
  ]
}

Schema type reference:
{
  professional_summary: {
    type: String,
    default: "",
  },
  skills: {
    type: [{ type: String }],
  },
  professional_info: {
    image: {
      type: String,
      default: "",
    },
    full_name: {
      type: String,
      default: "",
    },
    profession: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    portfolio: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
  },
  experience: {
    type: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        is_current: { type: Boolean },
      },
    ],
  },
  project: {
    type: [
      {
        name: { type: String },
        type: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        url: { type: String },
      },
    ],
  },
  education: {
    type: [
      {
        institution: { type: String },
        degree: { type: String },
        start_date: { type: String },
        graduation_date: { type: String },
        field: { type: String },
        gpa: { type: String },
      },
    ],
  }
}

Rules:
- Return only raw JSON.
- Do not return the schema itself.
- Use empty string for missing string values.
- Use empty array for missing list sections.
- Use true or false for boolean fields.
- Do not invent an image URL.
- CRITICAL: All dates (start_date, end_date, graduation_date) MUST be formatted strictly as "YYYY-MM" (e.g., "2023-08", "2024-01"). Do not use "Jan 2023" or any other format.
`;

  const response = await ai_model.invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ]);

  console.log("[Backend - uploadResume] AI Model successfully responded.");
  console.log("[Backend - uploadResume] Raw AI Response Content:", response?.content);

  if (!response || !response.content) {
    return res.status(500).json({
      success: false,
      message: "Failed to extract resume data",
    });
  }

  let parsedData;

  try {
    parsedData =
      typeof response.content === "string"
        ? JSON.parse(response.content)
        : response.content;
  } catch (error) {
    console.error("[Backend - uploadResume] Failed to parse JSON from AI response:", error);
    return res.status(500).json({
      success: false,
      message: "Model returned invalid JSON",
    });
  }

  console.log("[Backend - uploadResume] Successfully parsed JSON data:", JSON.stringify(parsedData, null, 2));

  const newResume = await Resume.create({
    userId,
    title,
    ...parsedData,
  });
  
  console.log(`[Backend - uploadResume] New Resume created in DB with ID: ${newResume._id}`);

  return res.status(201).json({
    success: true,
    message: "Resume uploaded successfully",
    resumeId: newResume._id,
    resume: newResume,
  });
});

export { enhanceProfessionalSummary, enhanceJobDescription, uploadResume }; 