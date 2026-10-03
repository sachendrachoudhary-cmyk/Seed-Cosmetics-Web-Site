import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  variantId?: string;
  name: string;
  sku: string;
  image: string;
  variantTitle?: string;
  price: number;
  mrp: number;
  quantity: number;
  lineTotal: number;
}

export interface IOrderTimeline {
  status: string;
  note: string;
  timestamp: Date;
  actor?: string;
}

export interface IOrderAudit {
  action: string;
  actor: string;
  timestamp: Date;
  details: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    couponCode?: string;
    shippingFee: number;
    tax: number;
    grandTotal: number;
  };
  paymentStatus: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  fulfillmentStatus: "unfulfilled" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "returned";
  paymentMethod: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  trackingNumber?: string;
  courier?: string;
  timeline: IOrderTimeline[];
  auditHistory: IOrderAudit[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: { type: String },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  image: { type: String, required: true },
  variantTitle: { type: String },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true, min: 0 },
});

const OrderTimelineSchema = new Schema<IOrderTimeline>({
  status: { type: String, required: true },
  note: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  actor: { type: String, default: "system" },
});

const OrderAuditSchema = new Schema<IOrderAudit>({
  action: { type: String, required: true },
  actor: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      couponCode: { type: String, uppercase: true, trim: true },
      shippingFee: { type: Number, default: 0, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      grandTotal: { type: Number, required: true, min: 0 },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    fulfillmentStatus: {
      type: String,
      enum: ["unfulfilled", "processing", "packed", "shipped", "delivered", "cancelled", "returned"],
      default: "unfulfilled",
    },
    paymentMethod: { type: String, enum: ["razorpay", "cod"], default: "razorpay" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    trackingNumber: { type: String },
    courier: { type: String },
    timeline: [OrderTimelineSchema],
    auditHistory: [OrderAuditSchema],
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ user: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ paymentStatus: 1, fulfillmentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
