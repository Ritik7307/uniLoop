import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { User } from '@/models/User';
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
      ],
      deletedBy: { $ne: decoded.userId }
    }).sort({ lastMessageTime: -1 }).lean();
    
    const enrichedChats = await Promise.all(chats.map(async (chat) => {
      const buyer = await User.findById(chat.buyerId).select('email');
      const seller = await User.findById(chat.sellerId).select('email');
      return {
        ...chat,
        buyerEmail: buyer?.email,
        sellerEmail: seller?.email
      };
    }));
    
    return NextResponse.json({ chats: enrichedChats });
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
