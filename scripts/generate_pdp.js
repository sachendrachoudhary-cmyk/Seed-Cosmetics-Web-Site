const fs = require("fs");
const path = require("path");

function write(filePath, content) {
  const full = path.join(__dirname, "..", filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim(), "utf8");
  console.log("Generated:", filePath);
}

const pdpClient = `"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShieldCheck, Truck, RefreshCw, CheckCircle2, ChevronRight, Plus, Minus, ShoppingBag, Sparkles, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR, calculateDiscountPercent } from "@/utils/formatters";
import { fetchApi } from "@/utils/api";
import { ProductCard } from "@/components/ProductCard";

interface ProductDetailClientProps {
  product: any;
  variants: any[];
  reviews: any[];
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  variants = [],
  reviews = [],
  relatedProducts = [],
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();

  const defaultVariant = variants.find((v) => v.isDefault) || variants[0] || null;
  const [selectedVariant, setSelectedVariant] = useState<any>(defaultVariant);

  const allImages = product.images && product.images.length > 0
    ? product.images.map((img: any) => img.url)
    : [product.thumbnail || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80"];

  const [activeImage, setActiveImage] = useState<string>(allImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "howToUse" | "faqs">("description");

  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewList, setReviewList] = useState(reviews);

  const currentPrice = selectedVariant ? selectedVariant.price : product.sellingPrice;
  const currentMrp = selectedVariant ? selectedVariant.mrp : product.MRP;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const discountPercent = calculateDiscountPercent(currentMrp, currentPrice);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(product._id, selectedVariant?._id, quantity);
      openDrawer();
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setAdding(true);
    try {
      await addItem(product._id, selectedVariant?._id, quantity);
      router.push("/checkout");
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewContent) return;

    setReviewSubmitting(true);
    try {
      const res = await fetchApi("/products/" + product.slug + "/reviews", {
        method: "POST",
        body: JSON.stringify({
          authorName: reviewAuthor,
          rating: reviewRating,
          content: reviewContent,
        }),
      });

      if (res.success && res.review) {
        setReviewList([res.review, ...reviewList]);
        setReviewSubmitted(true);
        setReviewAuthor("");
        setReviewContent("");
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted uppercase tracking-wider">
        <Link href="/" className="hover:text-botanical transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-botanical transition-colors">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={"/category/" + (product.category.slug || "face-care")}
              className="hover:text-botanical transition-colors"
            >
              {product.category.name || "Category"}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] bg-cream rounded-2xl overflow-hidden border border-cream-border shadow-luxury">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-gold-dark text-white text-xs font-mono font-bold px-3 py-1 rounded shadow">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={"w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all " + (activeImage === img ? "border-botanical shadow-sm" : "border-cream-border opacity-70 hover:opacity-100")}
                >
                  <img src={img} alt={"Thumbnail " + (idx + 1)} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">
              {(product.subcategory || "Botanical Formulation") + " • SKU: " + currentSku}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-xs">
                <div className="flex text-amber-500">
                  {"★★★★★"}
                </div>
                <span className="font-semibold text-charcoal">{product.rating ? product.rating.toFixed(1) : "4.9"}</span>
                <span className="text-charcoal-muted">({reviewList.length} reviews)</span>
              </div>
              <span className="text-charcoal-muted">•</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                In Stock • Dispatches in 24h
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 p-4 bg-white rounded-xl border border-cream-border shadow-sm">
            <span className="font-serif text-3xl font-semibold text-charcoal">
              {formatINR(currentPrice)}
            </span>
            {currentMrp > currentPrice && (
              <span className="text-base text-charcoal-muted line-through font-sans">
                {formatINR(currentMrp)}
              </span>
            )}
            <span className="text-xs text-charcoal-muted font-sans ml-auto">
              Inclusive of GST
            </span>
          </div>

          <p className="text-sm text-charcoal-light leading-relaxed">
            {product.shortDescription}
          </p>

          {product.bulletPoints && product.bulletPoints.length > 0 && (
            <div className="space-y-2 py-2">
              <p className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                Clinical & Botanical Highlights:
              </p>
              <ul className="space-y-1.5 text-xs text-charcoal-light">
                {product.bulletPoints.map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {variants.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-charcoal block">
                Select Volume / Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.sku}
                    onClick={() => setSelectedVariant(v)}
                    className={"px-4 py-2 rounded-lg text-xs font-semibold transition-all border " + (selectedVariant?.sku === v.sku ? "bg-botanical text-white border-botanical shadow-sm" : "bg-white text-charcoal border-cream-border hover:bg-cream")}
                  >
                    {v.title + " • " + formatINR(v.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-cream-border rounded-lg bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-charcoal hover:text-botanical transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-mono font-medium text-sm text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-charcoal hover:text-botanical transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || currentStock <= 0}
                className="flex-1 bg-botanical hover:bg-botanical-dark text-white py-3.5 px-6 rounded-lg font-sans text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-luxury hover:shadow-luxury-hover transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                {adding ? "Adding..." : "Add to Bag"}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={adding || currentStock <= 0}
              className="w-full bg-gold hover:bg-gold-dark text-charcoal py-3.5 px-6 rounded-lg font-sans text-xs uppercase tracking-widest font-bold shadow transition-colors disabled:opacity-50"
            >
              Instant Buy Now
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-cream-border/70 text-center">
            <div className="flex flex-col items-center gap-1 text-[11px] text-charcoal-muted">
              <Truck className="w-4 h-4 text-botanical" />
              <span>Free Delivery over ₹999</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[11px] text-charcoal-muted">
              <ShieldCheck className="w-4 h-4 text-botanical" />
              <span>Dermatologically Safe</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[11px] text-charcoal-muted">
              <RefreshCw className="w-4 h-4 text-botanical" />
              <span>Easy Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-cream-border overflow-hidden shadow-sm">
        <div className="flex border-b border-cream-border bg-cream/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab("description")}
            className={"py-4 px-6 text-xs uppercase tracking-widest font-semibold transition-colors shrink-0 " + (activeTab === "description" ? "border-b-2 border-botanical text-botanical-dark bg-white font-bold" : "text-charcoal-muted hover:text-charcoal")}
          >
            Formulation & Benefits
          </button>
          <button
            onClick={() => setActiveTab("ingredients")}
            className={"py-4 px-6 text-xs uppercase tracking-widest font-semibold transition-colors shrink-0 " + (activeTab === "ingredients" ? "border-b-2 border-botanical text-botanical-dark bg-white font-bold" : "text-charcoal-muted hover:text-charcoal")}
          >
            Active Ingredients
          </button>
          <button
            onClick={() => setActiveTab("howToUse")}
            className={"py-4 px-6 text-xs uppercase tracking-widest font-semibold transition-colors shrink-0 " + (activeTab === "howToUse" ? "border-b-2 border-botanical text-botanical-dark bg-white font-bold" : "text-charcoal-muted hover:text-charcoal")}
          >
            How to Use
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={"py-4 px-6 text-xs uppercase tracking-widest font-semibold transition-colors shrink-0 " + (activeTab === "faqs" ? "border-b-2 border-botanical text-botanical-dark bg-white font-bold" : "text-charcoal-muted hover:text-charcoal")}
          >
            {"Clinical FAQs (" + (product.faqs?.length || 0) + ")"}
          </button>
        </div>

        <div className="p-6 sm:p-10 text-sm leading-relaxed text-charcoal-light">
          {activeTab === "description" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2">Botanical Formulation Details</h3>
                <p className="leading-relaxed">{product.description}</p>
              </div>

              {product.benefits && product.benefits.length > 0 && (
                <div>
                  <h4 className="font-serif text-lg text-charcoal mb-2">Proven Skin Benefits</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {product.benefits.map((b: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 p-2 bg-cream/50 rounded border border-cream-border/60">
                        <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.formulationNotes && (
                <div className="p-4 bg-botanical-soft rounded-lg border border-botanical/20 text-xs">
                  <strong className="text-botanical-dark block mb-1">Formulation Science Note:</strong>
                  {product.formulationNotes}
                </div>
              )}
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-6 max-w-3xl">
              <h3 className="font-serif text-xl text-charcoal">Complete Ingredient Transparency</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.ingredients?.map((ing: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-cream/40 border border-cream-border space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-charcoal text-xs">{ing.name}</span>
                      {ing.keyActive && (
                        <span className="text-[10px] bg-botanical text-white px-2 py-0.5 rounded font-mono font-bold">
                          KEY ACTIVE
                        </span>
                      )}
                    </div>
                    {ing.description && (
                      <p className="text-xs text-charcoal-muted leading-relaxed">{ing.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "howToUse" && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-xl text-charcoal">Application Ritual</h3>
              <p className="whitespace-pre-line leading-relaxed">{product.howToUse}</p>
              {product.precautions && (
                <div className="flex gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 mt-4">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Precautions:</strong> {product.precautions}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-xl text-charcoal mb-4">Frequently Asked Questions</h3>
              {product.faqs?.map((faq: any, i: number) => (
                <div key={i} className="p-4 rounded-lg bg-cream/30 border border-cream-border space-y-1">
                  <p className="font-serif text-base font-semibold text-charcoal">{faq.question}</p>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-cream-border p-6 sm:p-10 space-y-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-cream-border">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">Customer Reviews</h3>
            <p className="text-xs text-charcoal-muted mt-1">Authentic experiences from conscious shoppers across India.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-bold text-charcoal">{product.rating ? product.rating.toFixed(1) : "4.9"}</span>
            <div className="text-amber-500 text-sm">{"★★★★★"}</div>
            <span className="text-xs text-charcoal-muted">{"Based on " + reviewList.length + " reviews"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewList.map((rev: any, idx: number) => (
            <div key={idx} className="p-4 rounded-lg bg-cream/30 border border-cream-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal">{rev.authorName}</span>
                <span className="text-amber-500 text-xs">{"★".repeat(rev.rating)}</span>
              </div>
              {rev.title && <p className="font-serif text-sm font-semibold text-charcoal">{rev.title}</p>}
              <p className="text-xs text-charcoal-light leading-relaxed">{rev.content}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-cream-border">
          <h4 className="font-serif text-lg text-charcoal mb-3">Leave a Botanical Review</h4>
          {reviewSubmitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-xs">
              Thank you for sharing your experience! Your review has been added.
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full text-xs p-2.5 bg-cream border border-cream-border rounded focus:outline-none focus:border-botanical"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-cream border border-cream-border rounded focus:outline-none focus:border-botanical"
                  >
                    <option value={5}>5 Stars - Exceptional</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Dissatisfied</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Your Experience</label>
                <textarea
                  required
                  rows={3}
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="How did this formulation perform on your skin?"
                  className="w-full text-xs p-2.5 bg-cream border border-cream-border rounded focus:outline-none focus:border-botanical"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="bg-botanical hover:bg-botanical-dark text-white px-6 py-2.5 rounded text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-widest text-botanical font-semibold">Complementary Rituals</p>
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">Complete Your Botanical Regimen</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-cream-border p-3 flex items-center justify-between gap-3 lg:hidden z-30 shadow-2xl">
        <div className="min-w-0">
          <p className="text-xs font-medium text-charcoal truncate">{product.name}</p>
          <p className="font-serif text-base font-bold text-charcoal">{formatINR(currentPrice)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={adding || currentStock <= 0}
          className="bg-botanical hover:bg-botanical-dark text-white text-xs uppercase tracking-wider font-bold py-3 px-5 rounded-lg shrink-0 shadow flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {adding ? "..." : "Add to Bag"}
        </button>
      </div>
    </div>
  );
}
`;

write("frontend/src/app/products/[slug]/ProductDetailClient.tsx", pdpClient);

const pdpPage = `import React from "react";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

interface PDPProps {
  params: {
    slug: string;
  };
}

async function getProductData(slug: string) {
  try {
    const res = await fetch("http://localhost:5000/api/products/" + slug, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Error fetching product data:", err);
  }
  return null;
}

export async function generateMetadata({ params }: PDPProps) {
  const data = await getProductData(params.slug);
  if (!data || !data.product) {
    return { title: "Product Not Found | Seed Cosmetics" };
  }

  const p = data.product;
  const title = p.seo?.title || (p.name + " | Seed Cosmetics India");
  const description = p.seo?.metaDescription || p.shortDescription;

  return {
    title,
    description,
    alternates: {
      canonical: "https://www.seedcosmetics.in/products/" + p.slug,
    },
    openGraph: {
      title,
      description,
      url: "https://www.seedcosmetics.in/products/" + p.slug,
      images: [
        {
          url: p.thumbnail || p.images?.[0]?.url,
          width: 800,
          height: 800,
          alt: p.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PDPProps) {
  const data = await getProductData(params.slug);

  if (!data || !data.product) {
    notFound();
  }

  const { product, variants, reviews, relatedProducts, structuredData } = data;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ProductDetailClient
        product={product}
        variants={variants || []}
        reviews={reviews || []}
        relatedProducts={relatedProducts || []}
      />
    </>
  );
}
`;

write("frontend/src/app/products/[slug]/page.tsx", pdpPage);