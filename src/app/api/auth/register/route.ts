import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    const user = await User.create({
      name,
      email,
      passwordHash,
      otp,
      otpExpiry,
    });

    // Send email via Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"UniLoop Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your UniLoop Verification Code',
      text: `Your one-time password (OTP) is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #2563eb;">Welcome to UniLoop!</h2>
          <p>Please use the following verification code to complete your registration:</p>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b; padding: 15px; background: #f8fafc; border-radius: 8px; margin: 20px auto; width: max-content;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 14px;">This code expires in 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: 'OTP sent to email',
      userId: user._id.toString(),
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
