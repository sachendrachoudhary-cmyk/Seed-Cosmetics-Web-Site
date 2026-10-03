import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  type: "journal" | "guide" | "faq" | "landing" | "ingredient" | "banner";
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  author: string;
  seo?: {
    title?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  relatedProducts: mongoose.Types.ObjectId[];
  status: "draft" | "published";
  order?: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    type: {
      type: String,
      enum: ["journal", "guide", "faq", "landing", "ingredient", "banner"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    body: { type: String, required: true },
    excerpt: { type: String },
    featuredImage: { type: String },
    category: { type: String },
    author: { type: String, default: "Seed Editorial Team" },
    seo: {
      title: { type: String },
      metaDescription: { type: String },
      canonicalUrl: { type: String },
    },
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    order: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

ContentSchema.index({ type: 1, status: 1 });
ContentSchema.index({ slug: 1 });

export const Content = mongoose.model<IContent>("Content", ContentSchema);
