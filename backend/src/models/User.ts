import mongoose, { Schema, Document } from "mongoose";

export interface IAddress {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: "customer" | "admin" | "product_admin" | "content_admin" | "operations" | "support";
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["customer", "admin", "product_admin", "content_admin", "operations", "support"],
      default: "customer",
    },
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
