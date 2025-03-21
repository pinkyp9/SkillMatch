import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return Response.json({ error: "Email and role are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    const newUser = await User.create({ email, role });
    return Response.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
