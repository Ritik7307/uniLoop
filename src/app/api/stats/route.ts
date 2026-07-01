import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    
    // Count total users and total active products
    const [userCount, productCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments()
    ]);
    
    return NextResponse.json({ 
      users: userCount, 
      products: productCount 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
