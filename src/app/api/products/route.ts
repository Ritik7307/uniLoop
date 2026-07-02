import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json({ products });
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

    const product = await Product.create({
      ...body,
      sellerId: user._id,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
