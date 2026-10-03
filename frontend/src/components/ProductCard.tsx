"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR, calculateDiscountPercent } from "@/utils/formatters";

export interface IProductCardData {
  _id: string;
  name: string;
  slug: string;
  thumbnail: string;
  images?: Array<{ url: string; alt: string }>;
  sellingPrice: number;
  MRP: number;
  rating?: number;
  reviewCount?: number;
  shortDescription?: string;
  category?: { name: string; slug: string } | string;
  bestSeller?: boolean;
  newArrival?: boolean;
  stock?: number;
  hasVariants?: boolean;
}

export const ProductCard: React.FC<{ product: IProductCardData }> = ({ product }) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const discountPercent = calculateDiscountPercent(product.MRP, product.sellingPrice);
  const categoryName = typeof product.category === "object" ? product.category?.name : "Botanical Care";

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setAdding(true);
    try {
      await addItem(product._id, undefined, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // Handled in context
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg border border-cream-border overflow-hidden hover:shadow-luxury-hover transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] bg-cream overflow-hidden">
          <img
            src={product.thumbnail || product.images?.[0]?.url || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.bestSeller && (
              <span className="bg-botanical-dark text-white text-[10px] font-sans uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-sm">
                Bestseller
              </span>
            )}
            {product.newArrival && !product.bestSeller && (
              <span className="bg-botanical text-white text-[10px] font-sans uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-sm">
                New
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-gold-dark text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-2">
          {/* Category Tag */}
          <p className="text-[10px] uppercase tracking-widest font-semibold text-botanical">
            {categoryName}
          </p>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-serif text-base sm:text-lg font-medium text-charcoal group-hover:text-botanical transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-charcoal-muted">
            <div className="flex text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-charcoal text-xs">
              {product.rating ? product.rating.toFixed(1) : "4.9"}
            </span>
            <span className="text-[11px] text-charcoal-muted">
              ({product.reviewCount || 100}+)
            </span>
          </div>

          {/* Short description excerpt */}
          {product.shortDescription && (
            <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed pt-1">
              {product.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Bar: Price & Action */}
      <div className="p-4 sm:p-5 pt-0 border-t border-cream-border/60 mt-3 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-lg sm:text-xl font-semibold text-charcoal">
            {formatINR(product.sellingPrice)}
          </span>
          {product.MRP > product.sellingPrice && (
            <span className="text-xs text-charcoal-muted line-through font-sans">
              {formatINR(product.MRP)}
            </span>
          )}
        </div>

        {product.hasVariants ? (
          <Link
            href={`/products/${product.slug}`}
            className="text-[11px] uppercase tracking-widest font-semibold text-botanical hover:text-botanical-dark px-3 py-2 border border-botanical/40 hover:border-botanical rounded transition-colors"
          >
            Options
          </Link>
        ) : (
          <button
            onClick={handleQuickAdd}
            disabled={adding || (product.stock !== undefined && product.stock <= 0)}
            className="bg-cream hover:bg-botanical text-charcoal hover:text-white px-3 py-2 rounded text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-1.5 border border-cream-border hover:border-botanical disabled:opacity-50"
            title="Quick Add to Bag"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Added
              </>
            ) : adding ? (
              "..."
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};