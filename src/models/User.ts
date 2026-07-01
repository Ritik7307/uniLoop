import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  department: string;
  year: string;
  hostel: string;
  walletBalance: number;
  monthlyBudget: number;
  createdAt: Date;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  department: { type: String, default: "" },
  year: { type: String, default: "" },
  hostel: { type: String, default: "" },
  walletBalance: { type: Number, default: 0 },
  monthlyBudget: { type: Number, default: 5000 },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
