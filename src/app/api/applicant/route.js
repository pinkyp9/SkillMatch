import connectDB from "@/lib/db";
import Applicant from "@/models/Applicant";

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const applicant = await Applicant.findOne({ email });

    if (!applicant) {
      return Response.json({ error: "Applicant not found" }, { status: 404 });
    }

    return Response.json({ applicant }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

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

export async function PUT(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { email, education, experience, skillAssessments, bookmarkedJobs } = body;

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const applicant = await Applicant.findOne({ email });

    if (!applicant) {
      return Response.json({ error: "Applicant not found" }, { status: 404 });
    }

    if (education) {
      applicant.education.push(...education);
    }

    if (experience) {
      applicant.experience.push(...experience);
    }

    if (skillAssessments) {
      applicant.skillAssessments.push(...skillAssessments);
    }

    if (bookmarkedJobs) {
      applicant.bookmarkedJobs.push(...bookmarkedJobs);
    }

    await applicant.save();

    return Response.json({ message: "Applicant updated", applicant }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}