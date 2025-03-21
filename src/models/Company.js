import mongoose from "mongoose";

const JobListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    pay: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: "USD" }
    },
    language: {
      type: String,
      required: true,
      enum: ["English", "Spanish", "French", "German", "Mandarin", "Other"]
    },
    location: {
      type: String,
      required: true,
      enum: ["Remote", "Hybrid", "Offline"]
    },
    industry: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    website: { type: String },
    logo: { type: String },
    location: { type: String },
    industry: { type: String},
    jobListings: [JobListingSchema] // Embedding job listings inside the company
  },
  { timestamps: true }
);

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);;
