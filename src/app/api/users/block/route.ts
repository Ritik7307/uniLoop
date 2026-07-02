import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();

    const currentUser = await User.findOne({ email: (session.user as any).email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = currentUser._id.toString();
    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
    }



    // Toggle logic: if already blocked, unblock, else block
    let updatedUser;
    if (currentUser.blockedUsers && currentUser.blockedUsers.includes(targetUserId)) {
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
