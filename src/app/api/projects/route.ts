import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Project } from "@/models/Project";

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Parse URL for search or tech filter if needed
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { techStack: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Error in GET /api/projects:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { title, description, techStack, githubUrl, liveUrl, images } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: "Title and description are required" }, { status: 400 });
    }

    // Handle user ID since it can be in `id` or `uid`
    const user = session.user as any;
    const authorId = user.id || user.uid;

    const project = await Project.create({
      title,
      description,
      techStack: techStack || [],
      githubUrl,
      liveUrl,
      images: images || [],
      authorId,
      authorName: user.name || "Anonymous",
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/projects:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
