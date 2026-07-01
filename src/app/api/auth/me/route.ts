import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        uid: user._id.toString(),
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        hostel: user.hostel,
        walletBalance: user.walletBalance,
        monthlyBudget: user.monthlyBudget,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
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

    const updates = await req.json();
    
    // Whitelist updates
    const allowedUpdates: any = {};
    if (updates.name) allowedUpdates.name = updates.name;
    if (updates.department) allowedUpdates.department = updates.department;
    if (updates.year) allowedUpdates.year = updates.year;
    if (updates.hostel) allowedUpdates.hostel = updates.hostel;
    if (updates.walletBalance !== undefined) allowedUpdates.walletBalance = updates.walletBalance;

    const user = await User.findByIdAndUpdate(decoded.userId, allowedUpdates, { new: true });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        uid: user._id.toString(),
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        hostel: user.hostel,
        walletBalance: user.walletBalance,
        monthlyBudget: user.monthlyBudget,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
