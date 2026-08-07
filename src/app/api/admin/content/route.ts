import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Project } from "@/models/Project";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const adminUser = await User.findOne({ email: session.user.email });
  if (!adminUser || adminUser.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const products = await Product.find({}).sort({ createdAt: -1 });
  const projects = await Project.find({}).sort({ createdAt: -1 });
  
  return NextResponse.json({ products, projects });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const adminUser = await User.findOne({ email: session.user.email });
  if (!adminUser || adminUser.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { action, targetId, type } = await req.json();

  if (!targetId || !type) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

  if (action === "delete") {
    if (type === "product") {
      await Product.findByIdAndDelete(targetId);
    } else if (type === "project") {
      await Project.findByIdAndDelete(targetId);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Content deleted" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
