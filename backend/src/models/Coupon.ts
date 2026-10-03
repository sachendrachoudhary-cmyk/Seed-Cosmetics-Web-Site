import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minCartValue: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usedCount: number;
  perCustomerLimit: number;
  firstOrderOnly: boolean;
  freeShipping: boolean;
  isActive: boolean;
  applicableCategories?: mongoose.Types.ObjectId[];
  applicableProducts?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minCartValue: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0 },
    perCustomerLimit: { type: Number, default: 1 },
    firstOrderOnly: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1, isActive: 1 });

export const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);
