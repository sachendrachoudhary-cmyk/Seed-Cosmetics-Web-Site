import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  _id?: string;
  product: mongoose.Types.ObjectId;
  variantId?: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
  unitMrp: number;
  lineTotal: number;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  guestSessionId?: string;
  items: ICartItem[];
  couponCode?: string;
  couponDiscount: number;
  shippingFee: number;
  subtotal: number;
  grandTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: { type: String },
  variantTitle: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  unitMrp: { type: Number, required: true, min: 0 },
  lineTotal: { type: Number, required: true, min: 0 },
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guestSessionId: { type: String, trim: true },
    items: [CartItemSchema],
    couponCode: { type: String, uppercase: true, trim: true },
    couponDiscount: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    subtotal: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

CartSchema.index({ user: 1 });
CartSchema.index({ guestSessionId: 1 });

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
