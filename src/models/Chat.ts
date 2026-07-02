import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  text?: string;
  imageUrl?: string;
  type: string; // 'text', 'image'
  senderId: string;
  timestamp: Date;
}

export interface IChat extends Document {
  productId: string;
  buyerId: string;
  sellerId: string;
  buyerName: string;
  productName: string;
  lastMessage: string;
  lastMessageTime: Date;
  deletedBy: string[];
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  text: { type: String },
  imageUrl: { type: String },
  type: { type: String, default: 'text' },
  senderId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const ChatSchema: Schema = new Schema({
  productId: { type: String, required: true },
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  productName: { type: String, required: true },
  lastMessage: { type: String, default: "" },
  lastMessageTime: { type: Date, default: Date.now },
  deletedBy: { type: [String], default: [] },
  messages: [MessageSchema]
});

export const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
