import connectDB from "@/lib/db";
import Recruiter from "@/models/Recruiter";

// POST: Create a new recruiter
export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { name, email, company } = body;

    if (!name || !email || !company) {
      return Response.json({ error: "Name, email, and company are required" }, { status: 400 });
    }

    const existing = await Recruiter.findOne({ email });

    if (existing) {
      return Response.json({ error: "Recruiter already exists" }, { status: 409 });
    }

    const recruiter = await Recruiter.create({ name, email, company });

    return Response.json({ message: "Recruiter created", recruiter }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

// GET: Fetch recruiter by email via query param
export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return Response.json({ error: "Recruiter not found" }, { status: 404 });
    }

    return Response.json({ recruiter }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
