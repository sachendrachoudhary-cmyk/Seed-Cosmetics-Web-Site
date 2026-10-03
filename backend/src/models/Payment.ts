import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  orderNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number; // in INR
  currency: string;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  method?: string;
  webhookEvents: Array<{
    event: string;
    receivedAt: Date;
    payload: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    orderNumber: { type: String, required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created",
    },
    method: { type: String },
    webhookEvents: [
      {
        event: { type: String },
        receivedAt: { type: Date, default: Date.now },
        payload: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: true }
);

PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ orderId: 1 });

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
