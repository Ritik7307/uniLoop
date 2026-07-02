import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import jwt from 'jsonwebtoken';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id: chatId } = await params;
    const userId = decoded.userId;

    await connectMongo();

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { deletedBy: userId } },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Chat deleted for user", chat });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
