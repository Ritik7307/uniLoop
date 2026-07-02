import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
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

    const userId = decoded.userId;
    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
    }

    await connectMongo();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle logic: if already blocked, unblock, else block
    let updatedUser;
    if (user.blockedUsers && user.blockedUsers.includes(targetUserId)) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { blockedUsers: targetUserId } },
        { new: true }
      );
      return NextResponse.json({ message: "User unblocked", blocked: false });
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { blockedUsers: targetUserId } },
        { new: true }
      );
      return NextResponse.json({ message: "User blocked", blocked: true });
    }

  } catch (error) {
    console.error("Error blocking user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
