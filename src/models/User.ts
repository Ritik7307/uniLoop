import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  department: string;
  year: string;
  hostel: string;
  walletBalance: number;
  monthlyBudget: number;
  blockedUsers: string[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  emailVerified: { type: Date },
  department: { type: String, default: "" },
  year: { type: String, default: "" },
  hostel: { type: String, default: "" },
  walletBalance: { type: Number, default: 0 },
  monthlyBudget: { type: Number, default: 5000 },
  blockedUsers: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
