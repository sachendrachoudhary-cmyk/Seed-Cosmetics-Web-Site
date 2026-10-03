import mongoose, { Schema, Document } from "mongoose";

export interface IInventoryLog extends Document {
  productId: mongoose.Types.ObjectId;
  variantId?: string;
  sku: string;
  change: number; // positive or negative
  previousStock: number;
  newStock: number;
  reason: "order_placed" | "order_cancelled" | "manual_adjustment" | "restock" | "return" | "damaged";
  referenceId?: string; // Order Number or adjustment note
  actor: string;
  createdAt: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: String },
    sku: { type: String, required: true },
    change: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: {
      type: String,
      enum: ["order_placed", "order_cancelled", "manual_adjustment", "restock", "return", "damaged"],
      required: true,
    },
    referenceId: { type: String },
    actor: { type: String, default: "system" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

InventoryLogSchema.index({ sku: 1, createdAt: -1 });
InventoryLogSchema.index({ productId: 1 });

export const InventoryLog = mongoose.model<IInventoryLog>("InventoryLog", InventoryLogSchema);
