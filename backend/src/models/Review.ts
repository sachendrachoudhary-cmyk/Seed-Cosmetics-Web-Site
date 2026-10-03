import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  authorName: string;
  rating: number; // 1-5
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  status: "pending" | "approved" | "rejected";
  helpfulVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    isVerifiedPurchase: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
    helpfulVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1, status: 1 });
ReviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
