import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema(
  {
    question: String,
    difficulty: String,
    timeLimit: Number,
    answer: String,
    feedback: String,
    score: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    correctness: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["HR", "Technical"]
    },
    resumeText: {
      type: String,
    },
    question: [questionsSchema],
    finalScore: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    correctness: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Incomplete", "Completed"],
      default: "Incomplete",
    },
  },
  { timestamps: true }
);


const InterviewAgent = mongoose.model("InterviewAgent", interviewSchema);
export default InterviewAgent 
