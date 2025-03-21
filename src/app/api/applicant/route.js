import connectDB from "@/lib/db";
import Applicant from "@/models/Applicant";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { name, email, education, experience, skillAssessments, bookmarkedJobs } = body;

    if (!name || !email) {
      return Response.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existing = await Applicant.findOne({ email });
    if (existing) {
      return Response.json({ error: "Applicant already exists" }, { status: 409 });
    }

    const applicant = await Applicant.create({
      name,
      email,
      credits: 100,  
      education: education || [],
      experience: experience || [],
      skillAssessments: skillAssessments || [],
      bookmarkedJobs: bookmarkedJobs || [],
    });

    return Response.json({ message: "Applicant created", applicant }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}