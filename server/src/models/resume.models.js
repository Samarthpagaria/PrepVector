import mongoose from "mongoose";

const ResumeScehma = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template: { type: String, default: "Classic" },
    accent_color: { type: String, default: "#3B82F6" },
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
    },
  },
  { timestamps: true, minimize: false }
);
const Resume = mongoose.model("Resume", ResumeScehma);
export default Resume;