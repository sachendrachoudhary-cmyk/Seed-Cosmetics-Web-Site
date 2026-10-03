import mongoose, { Schema, Document } from "mongoose";

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  featured: boolean;
  active: boolean;
  order: number;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    bannerImage: { type: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

CollectionSchema.index({ active: 1, featured: 1 });

export const Collection = mongoose.model<ICollection>("Collection", CollectionSchema);
