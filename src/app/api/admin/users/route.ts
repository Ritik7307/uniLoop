import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { User } from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const adminUser = await User.findOne({ email: session.user.email });
  if (!adminUser || adminUser.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await User.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const adminUser = await User.findOne({ email: session.user.email });
  if (!adminUser || adminUser.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { action, targetUserId } = await req.json();

  if (!targetUserId) return NextResponse.json({ error: "Target User ID missing" }, { status: 400 });

  if (action === "delete") {
    await User.findByIdAndDelete(targetUserId);
    return NextResponse.json({ success: true, message: "User deleted" });
  }

  // Example of blocking: in this app users block each other, but admin blocking might mean something else.
  // We can just support delete for now.

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
