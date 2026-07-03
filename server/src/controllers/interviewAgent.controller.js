import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { extractTextFromPdf } from "../utils/pdf.utils.js";
import { askAI } from "../services/ai.interview.services.js";
import { User } from "../models/user.models.js";
import InterviewAgent from "../models/interview.model.js";
/**
 * @description: This is a controller that will analyze the resume and return the structured data.
 * @access : Private
 * @method : POST
 * @path : /api/v1/interview/analyze-resume
 */
export const analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({
      success: false,
      message: "Resume PDF file is required",
    });
  }

  const resumeText = await extractTextFromPdf(req.file.buffer);
  const messages = [
    {
      role: "system",
      content: `
        Extract structured data from the resume.
        Return strictly JSON:
        {
        "role":"string",
        "experience":"string",
        "projects":["project1","project2"],
        "skills":["skill1","skill2"]
        }
        `,
    },
    {
      role: "user",
      content: `Resume Text:
        ${resumeText}`,
    },
  ];
  const airesponse = await askAI(messages);
  
  let parsed;
  try {
    const cleanResponse = airesponse.replace(/```json/gi, "").replace(/```/g, "").trim();
    parsed = JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Failed to parse AI response:", airesponse);
    return res.status(500).json({ 
      success: false, 
      message: "AI failed to analyze the resume properly. Please ensure the PDF is valid." 
    });
  }

  console.log("================= [BACKEND API] analyzeResume DONE ==================");
  return res.status(200).json({
    success: true,
    data: parsed
  });
});

/**
 * @description: This is a controller that will generate questions based on the resume text and interview mode.
 * @access : Private
 * @method : POST
 * @path : /api/v1/interview/generate-questions
 */
export const generateQuestion = asyncHandler(async (req, res) => {
  console.log("================= [BACKEND API] generateQuestion ==================");
  let{ role, experience, mode, resumeText, projects, skills } = req.body;
  role = role?.trim();
  experience = experience?.trim();
  mode = mode?.trim();
  if (!role || !experience || !mode) {
    return res.status(400).json({
      success: false,
      message: "Role, experience and mode are required",
    });
  }
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  if (user.credits < 50) {
    return res.status(400).json({
      success: false,
      message: "Insufficient credits.Minimum 50 required. ",
    });
  }
  const projectText =
    Array.isArray(projects) && projects.length ? projects.join(",") : "None";
  const skillText =
    Array.isArray(skills) && skills.length ? skills.join(",") : "None";

  const safeResume = resumeText?.trim() || "None";

  //prepare messages
  const userPrompt = `
    I want you to prepare me for an interview based on the following details:
    
    Role: ${role}.
    Experience: ${experience}.
    Interview Mode: ${mode}.
    
    Resume Text:
    ${safeResume}.
    
    Projects:
    ${projectText}.

    Skills to focus on:
    ${skillText}.
    `;
  if (!userPrompt.trim()) {
    return res.status(400).json({
      success: false,
      message: "Prompt content is empty.",
    });
  }
  const messages = [
    {
      role: "system",
      content: `
            You are a real human job interviewer,conducting a professional interview.
            Speak in professional tine and English,natural as if you are directly talking to the candidate.

            Generate exactly 7 interview questions based on the role,experience,projects,skills and other informations.

            Strict Rules:
            -each question must contain between 15 to 30 words.
            -do not use bullet points
            -do not use emojis
            -Do not add explanations
            -Do not number them
            -Each question should a single complete sentence.
            -Do not add extra text before or after.
            -Do not ask questions that are irrelevant to the role and experience
            -One question per line only
            -Keep language simple and conversational
            -Questions must feel practical and realistic
            -Keep in mind the interview mode and generate question accordingly.
            Difficulty progression:
            Question1 -> easy,
            Question2 -> easy-medium
            Question3 -> project-based-hard
            Question4 -> easy-hard
            Question5 -> project-based medium
            Question6 -> very hard
            Question7 -> very hard
            Make questions based on the given data of the candidate,roles,experince,projects,skills,inteview mode and other candidate information.
            `,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];
  const aiResponse = await askAI(messages);
  if (!aiResponse || !aiResponse.trim()) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate questions.",
    });
  }
  const questionsArray = aiResponse
    ?.split("\n")
    .map((q) => q.trim())
    .filter((q) => q.length > 0)
    .slice(0, 7);
  if (!questionsArray || questionsArray.length === 0) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate questions.",
    });
  }
  user.credits -= 50;
  await user.save({ validateBeforeSave: true });
  const interview = await InterviewAgent.create({
    userId: user._id,
    role,
    experience,
    mode,
    resumeText: safeResume,
    projects: projectText,
    skills: skillText,
    question: questionsArray.map((q, index) => {
      const difficulties = [
        "easy",
        "easy-medium",
        "project-based-hard",
        "easy-hard",
        "project-based medium",
        "very hard",
        "very hard",
      ];
      return {
        question: q,
        difficulty: difficulties[index] || "medium",
        timeLimit: 300
      };
    }),
    finalScore: 0,
    status: "Incomplete",
  });
  console.log("================= [BACKEND API] generateQuestion DONE ==================");
  return res.status(200).json({
    success: true,
    message: "Questions generated successfully",
    data: {
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.username,
      questions: interview.question,
    },
  });
});

/**
 * @description: This is a controller that evaluates the candidate's answer and provides a score and feedback.
 * @access : Private
 * @method : POST
 * @path : /api/v1/interview/submit-answer
 */
export const submitAnswer = asyncHandler(async (req, res) => {
  console.log("================= [BACKEND API] submitAnswer ==================");
  console.log("Req Body:", req.body);
  const { interviewId, questionIndex, answer, timeTaken } = req.body || {};
  const user = req.user._id;
  
  if (!interviewId || questionIndex === undefined || timeTaken === undefined) {
    console.error("Missing fields in submitAnswer:", { interviewId, questionIndex, answer, timeTaken, body: req.body });
    return res.status(400).json({
      success: false,
      message: "Interview ID, questionIndex, and timeTaken are required",
      received: { interviewId, questionIndex, answer, timeTaken }
    });
  }
  const interview = await InterviewAgent.findById(interviewId);
  if (!interview) {
    return res.status(404).json({
      success: false,
      message: "Interview not found",
    });
  }
  const question = interview.question[questionIndex];
  if (!answer) {
    question.score = 0;
    question.feedback = "Answer not provided";
    question.answer = "";
    await interview.save();
    return res.json({
      feedback: question.feedback,
    });
  }
  if (timeTaken > question.timeLimit) {
    question.score = 0;
    question.feedback = "Time limit exceeded. Answer not evaluated";
    question.answer = answer;
    await interview.save();
    return res.json({
      feedback: question.feedback,
    });
  }
  const messages = [
    {
      role: "system",
      content: `
          You are a professional human interviewer evaluating a candidate's answer in a real interview.
Evaluate naturally and fairly, like a real person would.
Score the answer in these areas (0 to 10) :

1. Correctness-Does the answer accurately address the question?
2. Communication-Does the candidate explain clearly without unnecessary words?
3. Confidence-Does the candidate seem confident and clear while answering

Rules :
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence,communitcaiton and correctness(round of to the nearest whole number)

Feedback Rules :
-- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:
{"confidence":number,
"communication": number,
"correctness": number,
"finalScore" : number,
"feedback": "short human feedback"
}
`,
    },
    {
      role: "user",
      content: `
          Question :${question.question},
          Answer:${answer}
          `,
    },
  ];
  const evaluation = await askAI(messages);
  
  let parsed;
  try {
    const cleanResponse = evaluation.replace(/```json/gi, "").replace(/```/g, "").trim();
    parsed = JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Failed to parse evaluation JSON:", evaluation);
    return res.status(500).json({ 
      success: false, 
      message: "AI evaluation parsing failed" 
    });
  }
  question.answer = answer;
  question.feedback = parsed.feedback;
  question.score = parsed.finalScore;
  question.confidence = parsed.confidence;
  question.communication = parsed.communication;
  question.correctness = parsed.correctness;
  await interview.save();
  console.log("================= [BACKEND API] submitAnswer DONE ==================");
  return res.json({
    feedback: question.feedback,
    score: question.score,
  });
});

/**
 * @description: This is a controller that calculates the final scores and completes the interview.
 * @access : Private
 * @method : POST
 * @path : /api/v1/interview/finish-interview
 */
export const finishInterview = asyncHandler(async (req, res) => {
  console.log("================= [BACKEND API] finishInterview ==================");
  const { interviewId } = req.body;
  if (!interviewId) {
    return res.status(400).json({
      success: false,
      message: "InterviewId is required",
    });
  }
  const interview = await InterviewAgent.findById(interviewId);
  if (!interview) {
    return res.status(404).json({
      success: false,
      message: "Interview not found",
    });
  }
  const totalQuestion = interview.question.length;
  let totalScore = 0;
  let totalConfidence = 0;
  let totalCorrectness = 0;
  let totalCommunication = 0;

  interview.question.forEach((q) => {
    totalScore += q.score || 0;
    totalConfidence += q.confidence || 0;
    totalCorrectness += q.correctness || 0;
    totalCommunication += q.communication || 0;
  });

  const finalScore = totalQuestion ? totalScore / totalQuestion : 0;
  const avgConfidence = totalQuestion ? totalConfidence / totalQuestion : 0;
  const avgCorrectness = totalQuestion ? totalCorrectness / totalQuestion : 0;
  const avgCommunication = totalQuestion ? totalCommunication / totalQuestion : 0;

  interview.finalScore = finalScore;
  interview.confidence = avgConfidence;
  interview.correctness = avgCorrectness;
  interview.communication = avgCommunication;

  interview.status = "Completed";
  await interview.save({ validateBeforeSave: true });
  return res.status(200).json({
    finalScore: Number(finalScore.toFixed(1)),
    confidence: Number(avgConfidence.toFixed(1)),
    communication: Number(avgCommunication.toFixed(1)),
    correctness: Number(avgCorrectness.toFixed(1)),
    questionWiseScore: interview.question.map((q) => ({
      question: q.question,
      score: q.score || 0,
      feedback: q.feedback || "",
      confidence: q.confidence || 0,
      communication: q.communication || 0,
      correctness: q.correctness || 0,
    })),
  });
});

/**
 * @description: This is a controller that fetches all interviews for the authenticated user.
 * @access : Private
 * @method : GET
 * @path : /api/v1/interview/get-interview
 */
export const getMyInterviews = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const interviews = await InterviewAgent.find({ userId }).sort({createdAt:-1})
  return res.status(200).json({
    success: true,
    message: "Interviews fetched successfully",
    data: interviews,
  });
});

/**
 * @description: This is a controller that retrieves the detailed report for a specific interview.
 * @access : Private
 * @method : GET
 * @path : /api/v1/interview/report/:interviewId
 */
export const getInterviewReport = asyncHandler(async (req, res) => {
  const { interviewId } = req.params;
  if (!interviewId) {
    return res.status(400).json({
      success: false,
      message: "Interview ID is required",
    });
  }
  const interview = await InterviewAgent.findById(interviewId);
  if (!interview) {
    return res.status(404).json({
      success: false,
      message: "Interview not found",
    });
  }
 const totalQuestion = interview.question.length;

  let totalConfidence = 0;
  let totalCorrectness = 0;
  let totalCommunication = 0;

  interview.question.forEach((q) => {
    totalConfidence += q.confidence || 0;
    totalCorrectness += q.correctness || 0;
    totalCommunication += q.communication || 0;
  });

  
  const avgConfidence = totalQuestion ? totalConfidence / totalQuestion : 0;
  const avgCorrectness = totalQuestion ? totalCorrectness / totalQuestion : 0;
  const avgCommunication = totalQuestion ? totalCommunication / totalQuestion : 0;

  return res.status(200).json({
    finalScore: Number((interview.finalScore || 0).toFixed(1)),
    confidence: Number(avgConfidence.toFixed(1)),
    communication: Number(avgCommunication.toFixed(1)),
    correctness: Number(avgCorrectness.toFixed(1)),
    questionWiseScore: interview.question.map((q) => ({
      question: q.question,
      score: q.score || 0,
      feedback: q.feedback || "",
      confidence: q.confidence || 0,
      communication: q.communication || 0,
      correctness: q.correctness || 0,
    })),
  });

});