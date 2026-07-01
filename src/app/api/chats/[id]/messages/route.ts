import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = (await params).id;
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Verify user is part of chat
    if (chat.buyerId.toString() !== decoded.userId && chat.sellerId.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    const newMessage = {
      text: body.text,
      imageUrl: body.imageUrl,
      type: body.type || 'text',
      senderId: decoded.userId,
      timestamp: new Date()
    };

    chat.messages.push(newMessage as any);
    chat.lastMessage = body.type === 'image' ? 'Sent an image' : body.text;
    chat.lastMessageTime = newMessage.timestamp;
    
    await chat.save();

    return NextResponse.json({ message: chat.messages[chat.messages.length - 1] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
