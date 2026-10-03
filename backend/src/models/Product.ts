import mongoose, { Schema, Document } from "mongoose";

export interface IProductImage {
  url: string;
  alt: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface IIngredient {
  name: string;
  keyActive?: boolean;
  description?: string;
}

export interface IProductFAQ {
  question: string;
  answer: string;
}

export interface IProductSEO {
  title?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  targetTopic?: string;
  relatedTopics?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface IProduct extends Document {
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  collectionRef?: mongoose.Types.ObjectId;
  shortDescription: string;
  description: string;
  bulletPoints: string[];
  benefits: string[];
  ingredients: IIngredient[];
  formulationNotes?: string;
  howToUse: string;
  precautions?: string;
  faqs: IProductFAQ[];
  images: IProductImage[];
  thumbnail: string;
  hasVariants: boolean;
  MRP: number;
  sellingPrice: number;
  discountType: "percentage" | "fixed" | "none";
  discountValue: number;
  taxPercent: number;
  stock: number;
  lowStockThreshold: number;
  status: "draft" | "preview" | "scheduled" | "published" | "archived";
  rating: number;
  reviewCount: number;
  skinType?: string[];
  skinConcern?: string[];
  seo: IProductSEO;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  publishedAt?: Date;
  scheduledPublishAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: String, default: "Seed Cosmetics", trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: String, trim: true },
    collectionRef: { type: Schema.Types.ObjectId, ref: "Collection" },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    bulletPoints: [{ type: String }],
    benefits: [{ type: String }],
    ingredients: [
      {
        name: { type: String, required: true },
        keyActive: { type: Boolean, default: false },
        description: { type: String },
      },
    ],
    formulationNotes: { type: String },
    howToUse: { type: String, required: true },
    precautions: { type: String },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    thumbnail: { type: String, required: true },
    hasVariants: { type: Boolean, default: false },
    MRP: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    discountType: { type: String, enum: ["percentage", "fixed", "none"], default: "none" },
    discountValue: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 18 },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ["draft", "preview", "scheduled", "published", "archived"],
      default: "draft",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    skinType: [{ type: String }],
    skinConcern: [{ type: String }],
    seo: {
      title: { type: String },
      metaDescription: { type: String },
      canonicalUrl: { type: String },
      targetTopic: { type: String },
      relatedTopics: [{ type: String }],
      ogTitle: { type: String },
      ogDescription: { type: String },
      ogImage: { type: String },
      noIndex: { type: Boolean, default: false },
    },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    publishedAt: { type: Date },
    scheduledPublishAt: { type: Date },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ status: 1, featured: 1, bestSeller: 1, newArrival: 1 });
ProductSchema.index({
  name: "text",
  shortDescription: "text",
  "ingredients.name": "text",
  skinConcern: "text",
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
