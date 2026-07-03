import mongoose from "mongoose";

const ResumeScehma = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, default: "Untitled Resume" },
    isPublic: { type: Boolean, default: false },
    template: { type: String, default: "Classic" },
    accent_color: { type: String, default: "#3B82F6" },
    professional_summary: {
      type: String,
      default: "",
    },
    skills: {
      type: [{ type: String }],
    },
    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      email: { type: String, default: "" },
      customLinks: {
        type: [
          {
            name: { type: String },
            url: { type: String },
          }
        ],
        default: []
      },
      // Keep old fields for backward compatibility
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    // Keep professional_info for backward compatibility with older AI responses
    professional_info: { type: mongoose.Schema.Types.Mixed },
    experience: {
      type: [
        {
          company: { type: String },
          position: { type: String },
          start_date: { type: String },
          end_date: { type: String },
          is_current: { type: Boolean },
          description: { type: String },
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
          percentage: { type: String },
        },
      ],
    },
  },
  { timestamps: true, minimize: false }
);
const Resume = mongoose.model("Resume", ResumeScehma);
export default Resume;