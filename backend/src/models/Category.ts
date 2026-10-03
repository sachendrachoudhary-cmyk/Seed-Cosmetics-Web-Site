import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  featured: boolean;
  order: number;
  parentCategory?: mongoose.Types.ObjectId;
  seo?: {
    title?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
    seo: {
      title: { type: String },
      metaDescription: { type: String },
      canonicalUrl: { type: String },
    },
  },
  { timestamps: true }
);

CategorySchema.index({ featured: 1, order: 1 });

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
