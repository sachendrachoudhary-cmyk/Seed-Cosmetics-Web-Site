import mongoose, { Schema, Document } from "mongoose";

export interface IRedirect extends Document {
  fromPath: string;
  toPath: string;
  statusCode: number;
  hits: number;
  createdAt: Date;
  updatedAt: Date;
}

const RedirectSchema = new Schema<IRedirect>(
  {
    fromPath: { type: String, required: true, unique: true, trim: true },
    toPath: { type: String, required: true, trim: true },
    statusCode: { type: Number, default: 301, enum: [301, 302] },
    hits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

RedirectSchema.index({ fromPath: 1 });

export const Redirect = mongoose.model<IRedirect>("Redirect", RedirectSchema);
