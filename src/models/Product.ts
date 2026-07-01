import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  price: number;
  category: string;
  condition: string;
  description: string;
  images: string[];
  sellerId: mongoose.Types.ObjectId | string;
  sellerName: string;
  hostel: string;
  listingType: string; // 'sale', 'lost', 'found', 'service'
  status: string; // 'available', 'sold'
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: "Other" },
  condition: { type: String, default: "Good" },
  description: { type: String, required: true },
  images: [{ type: String }],
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sellerName: { type: String, required: true },
  hostel: { type: String, required: true },
  listingType: { type: String, default: 'sale' },
  status: { type: String, default: 'available' },
  createdAt: { type: Date, default: Date.now },
});

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
