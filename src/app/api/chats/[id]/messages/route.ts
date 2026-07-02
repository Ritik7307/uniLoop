import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { getServerSession } from 'next-auth';
import { User } from '@/models/User';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = (await params).id;
    
    const session = await getServerSession();
    if (!session || !session.user || !(session.user as any).email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: (session.user as any).email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Verify user is part of chat
    if (chat.buyerId.toString() !== user._id.toString() && chat.sellerId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const recipientId = chat.buyerId.toString() === user._id.toString() ? chat.sellerId.toString() : chat.buyerId.toString();

    // Check if recipient has blocked the sender or vice-versa
    const recipientUser = await User.findById(recipientId);
    if (recipientUser?.blockedUsers?.includes(user._id.toString())) {
      return NextResponse.json({ error: 'You are blocked by this user' }, { status: 403 });
    }
    if (user?.blockedUsers?.includes(recipientId)) {
      return NextResponse.json({ error: 'You have blocked this user' }, { status: 403 });
    }

    const body = await req.json();
    
    const newMessage = {
      text: body.text,
      imageUrl: body.imageUrl,
      type: body.type || 'text',
      senderId: user._id,
      timestamp: new Date()
    };

    chat.messages.push(newMessage as any);
    chat.lastMessage = body.type === 'image' ? 'Sent an image' : body.text;
    chat.lastMessageTime = newMessage.timestamp;
    
    // Un-delete the chat for both users since there's a new message
    chat.deletedBy = [];
    
    await chat.save();

    return NextResponse.json({ message: chat.messages[chat.messages.length - 1] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
