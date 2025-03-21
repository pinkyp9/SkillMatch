import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  institute: String,
  from: Number,
  to: Number,
  grade: String,
  field: String,
});

const experienceSchema = new mongoose.Schema({
  company: String,
  from: String, // e.g., "March 2023"
  to: String,
  description: String,
  achievements: String,
});

const skillAssessmentSchema = new mongoose.Schema({
  ass_name: String,
  date: Number,
  score: Number,
  proctoring_score: Number,
});

const bookmarkedJobSchema = new mongoose.Schema({
  job_id: String,
});

const applicantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    credits: {
      type: Number,
      required: true,
      unique: true,
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    skillAssessments: {
      type: [skillAssessmentSchema],
      default: [],
    },
    bookmarkedJobs: {
      type: [bookmarkedJobSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Applicant || mongoose.model("Applicant", applicantSchema);
