import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: (session.user as any).email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find chats where user is buyer or seller
    const chats = await Chat.find({
      $or: [
        { buyerId: user._id },
        { sellerId: user._id }
      ],
      deletedBy: { $ne: user._id }
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
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: (session.user as any).email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      productId: body.productId,
      $or: [
        { buyerId: user._id, sellerId: body.sellerId },
        { sellerId: user._id, buyerId: body.sellerId }
      ]
    });

    if (!chat) {
      chat = await Chat.create({
        ...body,
        buyerId: user._id,
        messages: []
      });
    }

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
