import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Project } from "@/models/Project";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const unwrappedParams = await params;
    const { id } = unwrappedParams;

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Error in GET /api/projects/[id]:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const unwrappedParams = await params;
    const { id } = unwrappedParams;
    const body = await req.json();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const user = session.user as any;
    const userId = user.id || user.uid;

    if (project.authorId !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, { $set: body }, { new: true });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Error in PUT /api/projects/[id]:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const unwrappedParams = await params;
    const { id } = unwrappedParams;

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const user = session.user as any;
    const userId = user.id || user.uid;

    if (project.authorId !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/projects/[id]:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
