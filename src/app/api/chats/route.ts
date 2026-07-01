import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find chats where user is buyer or seller
    const chats = await Chat.find({
      $or: [
        { buyerId: decoded.userId },
        { sellerId: decoded.userId }
      ]
    }).sort({ lastMessageTime: -1 });
    
    return NextResponse.json({ chats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      productId: body.productId,
      $or: [
        { buyerId: decoded.userId, sellerId: body.sellerId },
        { sellerId: decoded.userId, buyerId: body.sellerId }
      ]
    });

    if (!chat) {
      chat = await Chat.create({
        ...body,
        buyerId: decoded.userId,
        messages: []
      });
    }

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
