import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  amount: number;
  originalAmount: number;
  isSplit: boolean;
  roommateName: string | null;
  category: string;
  createdAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  originalAmount: { type: Number, required: true },
  isSplit: { type: Boolean, default: false },
  roommateName: { type: String, default: null },
  category: { type: String, default: "Other" },
  createdAt: { type: Date, default: Date.now },
});

export const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
