import mongoose from "mongoose";

/**
 * -job description:string
 * -resume text:string
 * -self description:string
 *
 * -matchscore :Number
 * Technical questions :[{question:"",intention:"",answer:""}]
 * behaviourial questions ;[{question:"",intention:"",answer:""}]
 * skill gaps [skill:"",severity:{
 * type:enum
 * enum : [low,med.high]
 * }]
 * preparation plan [{
 * day:number
 * focus : string ,
 * task:["string"]
 * },{}]
 */
const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question is required."],
    },
    intension: {
      type: String,
      required: [true, "Intension is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  { _id: false }
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Behavioral question is required"],
    },
    intension: {
      type: String,
      required: [true, "Intension is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  { _id: false }
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
    },
    task: {
      type: Array,
      required: [true, "Task is required"],
    },
  },
  { _id: false }
);

const inteviewReportSechema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    selfDescription: {
      type: String,
      required: true,
    },
    matchScore: {
      type: String,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required:[true,"Job title required."]
    }
  },
  { timestamps: true }
);

export const InterviewReport = mongoose.model(
  "InterviewReport",
  inteviewReportSechema
);
