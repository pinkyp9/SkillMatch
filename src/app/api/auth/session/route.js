import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req) {
  try {
    const { getUser } = getKindeServerSession(req);
    const user = await getUser();

    if (!user || !user.email) {
      return Response.json({ user: null }, { status: 200 }); // ✅ Always return valid JSON
    }

    return Response.json({
      email: user.email,
      name: user.given_name || "User",
    });
  } catch (error) {
    console.error("Error fetching user session:", error);
    return Response.json({ error: "Internal Server Error", user: null }, { status: 500 });
  }
}
