import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import puppeteer from "puppeteer";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
const getModel = () => {
  return new ChatOpenAI({
    model: process.env.AI_MODEL || "google/gemini-2.5-flash",
    apiKey: process.env.OPENROUTER_API_KEY,
    temperature: 0.2,
    configuration: {
      baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173", // Optional, for including your app on openrouter.ai rankings.
        "X-Title": "PrepVector", // Optional. Shows in rankings on openrouter.ai.
      }
    },
  });
};

const interviewReportSchema = z.object({
  title: z
    .string()
    .describe(
      "A concise, professional job title based on the job description or candidate profile. E.g., 'Senior Frontend Engineer'"
    ),
  matchScore: z
    .number()
    .describe(
      "the match score is a number between 0 to 100 indicating how well the candidate's profile matches the job description. "
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "A realistic technical interview question tailored to the candidate's target role, skills, experience level, projects, and technologies mentioned in their resume. Questions should resemble those commonly asked by hiring managers or engineers during actual interviews."
          ),
        intention: z
          .string()
          .describe(
            "Explain in detail what the interviewer is trying to evaluate through this question. Mention the specific technical concepts, problem-solving abilities, practical knowledge, depth of understanding, communication skills, or real-world experience being assessed."
          ),
        answer: z
          .string()
          .describe(
            "Provide a comprehensive interview-ready answer guide. Include the key concepts that should be discussed, the recommended thought process, practical examples where applicable, common mistakes to avoid, and what an ideal candidate's response should demonstrate."
          ),
      })
    )
    .describe(
      "A list of role-specific technical interview questions designed to help the candidate prepare for real interviews. Questions should cover both fundamental concepts and practical application of relevant technologies."
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "A realistic behavioral or situational interview question commonly asked by recruiters, hiring managers, or team leads. Questions should assess communication skills, teamwork, leadership, conflict resolution, adaptability, ownership, and professional growth."
          ),
        intention: z
          .string()
          .describe(
            "Describe the hiring objective behind this question. Explain what personality traits, soft skills, work ethic, decision-making abilities, emotional intelligence, or cultural fit factors the interviewer is evaluating."
          ),
        answer: z
          .string()
          .describe(
            "Provide detailed guidance on how the candidate should structure their response. Encourage the STAR method (Situation, Task, Action, Result) when appropriate. Include important points to cover, examples of strong responses, and behaviors that interviewers typically value."
          ),
      })
    )
    .describe(
      "A collection of behavioral interview questions intended to evaluate the candidate's professional experience, interpersonal skills, problem-solving approach, teamwork, and overall workplace effectiveness."
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "A specific technical skill, tool, framework, concept, domain knowledge area, or professional competency that appears to be missing, underdeveloped, or insufficiently demonstrated based on the candidate's resume and target job description."
          ),
        severity: z
          .string()
          .describe(
            "The importance of addressing this gap for interview success. Use values such as 'Critical', 'Moderate', or 'Minor'. Critical gaps are likely to significantly impact hiring decisions, while minor gaps are beneficial but not essential."
          ),
      })
    )
    .describe(
      "An analysis of missing or weak skills that may reduce the candidate's competitiveness for the target role. Focus on the most relevant gaps compared to the job requirements."
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .string()
          .describe(
            "The sequential day number in the preparation plan, starting from '1'. Each day should build upon previous learning and contribute toward interview readiness."
          ),
        focus: z
          .string()
          .describe(
            "The primary learning objective or theme for the day, such as React Fundamentals, System Design, Behavioral Interview Preparation, Data Structures, Backend Development, or Project Revision."
          ),
        tasks: z
          .array(z.string())
          .describe(
            "A detailed list of actionable tasks the candidate should complete during the day. Tasks should be specific, measurable, and practical, including studying concepts, building mini-projects, solving coding problems, revising interview topics, or conducting mock interviews."
          ),
      })
    )
    .describe(
      "A structured multi-day interview preparation roadmap tailored to the candidate's experience level, skill gaps, and target role. The roadmap should progressively improve technical knowledge, practical skills, interview confidence, and overall job readiness."
    ),
});

export async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  const interviewReportPrompt = `
Role: AI-Powered Mock Interview Coach and Preparation Expert
Goal: Act as an AI-powered interviewer and preparation coach to help job seekers master interviews for the given role. Provide realistic questions, detailed feedback, and a structured preparation plan.

Resume: ${resume}
Job Description: ${jobDescription}
Self-Description: ${selfDescription}

Create a structured interview preparation report that includes:

0. Job Title
Generate a concise, professional job title for this report based on the job description or candidate profile.

1. Realistic Technical Interview Questions
Generate a list of technical interview questions that an interviewer would realistically ask for this role. These questions should assess the candidate’s:
- Practical skills and domain knowledge
- Problem-solving ability
- Technical depth and clarity of understanding
- Ability to apply concepts to real-world scenarios
- Technology stack familiarity (based on resume)
- Experience level appropriateness
Note : Also include tough level questions.

For each question, include:
- The question itself
-level of question
- The underlying intention of the question
- A detailed answer guide

2. Realistic Behavioral / Situational Interview Questions
Generate a list of behavioral or situational interview questions commonly asked by recruiters, hiring managers, team leads, and technical leads.
Note : Also include tough level questions.

For each question, include:
- The question itself
-level of question
- The interviewer's intention
- Guidance on how to structure the response

3. Skill Gap Analysis
Identify and analyze critical skill gaps based on the comparison between:
- Candidate’s resume and experience
- Target job description requirements

4. Structured Preparation Plan
Create a structured multi-day interview preparation roadmap.

Important Strict Constraints:
- CRITICAL: You must STRICTLY research and analyze only topics related to resume evaluation, interview preparation, and job matching.
- Do NOT engage in off-topic discussions. If the job description or resume is completely irrelevant (e.g., asking to write a poem or a recipe), generate a highly critical skill gap report indicating the candidate has 0% match and missing all required skills.
- Return output that matches the provided schema exactly.
- Do not include markdown fences.
- Do not include any extra explanation outside the structured response.
`;

  const parser = StructuredOutputParser.fromZodSchema(interviewReportSchema);
  const formatInstructions = parser.getFormatInstructions();

  const model = getModel();
  
  // We explicitly append the JSON schema instructions to the prompt
  // and remove withStructuredOutput so it runs as a pure text-to-json task.
  const result = await model.invoke(interviewReportPrompt + "\n\n" + formatInstructions);

  try {
    let cleanText = result.content;
    
    // Attempt to fix common LLM JSON typo: `"day": 3",` -> `"day": 3,`
    cleanText = cleanText.replace(/"day":\s*(\d+)",/g, '"day": $1,');
    
    const parsed = await parser.parse(cleanText);
    return parsed;
  } catch (e) {
    console.error("Failed to parse LLM output:", e);
    // If it fails to parse, try to manually extract JSON from markdown fences just in case
    let text = result.content;
    text = text.replace(/"day":\s*(\d+)",/g, '"day": $1,');
    
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(text);
  }
}
export const generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};
export const generateResumePdf = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "Complete professional resume in valid HTML format for PDF generation with Puppeteer"
      ),
  });
  const prompt = `Generate a professional and modern resume in complete HTML format for the candidate using the following details.
    Resume: ${resume}
    Job Description: ${jobDescription}
    Self-Description: ${selfDescription}
    
    Requirements:
- Return valid complete HTML
- Make it professional and ATS-friendly
- Include sections like Summary, Skills, Experience, Projects, Education
- Tailor the content to the job description
- Use clean inline styling suitable for PDF generation
    `;
  const parser = StructuredOutputParser.fromZodSchema(resumePdfSchema);
  const formatInstructions = parser.getFormatInstructions();
  const model = getModel();
  
  const result = await model.invoke(prompt + "\n\n" + formatInstructions);

  let parsed;
  try {
    parsed = await parser.parse(result.content);
  } catch (e) {
    console.error("Failed to parse LLM output for PDF:", e);
    const text = result.content;
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1]);
    } else {
      parsed = JSON.parse(text);
    }
  }

  const pdfBuffer = await generatePdfFromHtml(parsed.html);

  return pdfBuffer;
};
