import mongoose, { Schema, Document } from "mongoose";

export interface IVariant extends Document {
  productId: mongoose.Types.ObjectId;
  sku: string;
  title: string;
  sizeVolume: string;
  attributes: Record<string, string>;
  mrp: number;
  price: number;
  stock: number;
  image?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    sizeVolume: { type: String, required: true },
    attributes: { type: Map, of: String, default: {} },
    mrp: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VariantSchema.index({ productId: 1, isDefault: 1 });

export const Variant = mongoose.model<IVariant>("Variant", VariantSchema);
