"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { fetchApi } from "@/utils/api";
import { formatINR } from "@/utils/formatters";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PredictiveSearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setCategories([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setCategories([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchApi<{ success: boolean; products: any[]; categories: any[] }>(
          `/products/search?q=${encodeURIComponent(query.trim())}`
        );
        if (res.success) {
          setResults(res.products || []);
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = ["Bakuchiol", "Ceramide Cream", "Niacinamide Toner", "Rosemary Hair Oil", "Vitamin C", "Sensitive Skin"];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-8 pt-16 sm:pt-24">
        <div className="relative w-full max-w-2xl bg-canvas rounded-xl shadow-2xl border border-cream-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Search Header */}
          <div className="p-4 sm:p-6 border-b border-cream-border flex items-center gap-3 bg-white">
            <Search className="w-5 h-5 text-charcoal-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search botanical actives, concerns, or formulations..."
              className="w-full text-base sm:text-lg bg-transparent text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none font-serif"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 text-charcoal-muted hover:text-charcoal transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-2 text-xs uppercase tracking-widest font-semibold text-charcoal-muted hover:text-botanical transition-colors px-2 py-1"
            >
              ESC
            </button>
          </div>

          {/* Search Body */}
          <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-6">
            {/* Quick Popular Searches if query is empty */}
            {!query.trim() && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-charcoal-muted font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-gold" /> Popular Botanical Queries
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="text-xs bg-white hover:bg-botanical hover:text-white text-charcoal px-3 py-1.5 rounded-full border border-cream-border transition-colors shadow-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="py-8 text-center text-xs text-charcoal-muted font-sans animate-pulse">
                Discovering botanical formulations...
              </div>
            )}

            {/* Results */}
            {!loading && query.trim() && (
              <>
                {/* Categories match */}
                {categories.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <Link
                          key={c._id}
                          href={`/category/${c.slug}`}
                          onClick={onClose}
                          className="text-xs bg-botanical-soft text-botanical-dark px-3 py-1 rounded border border-botanical/20 font-medium hover:bg-botanical hover:text-white transition-colors"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products match */}
                {results.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">
                      Formulations ({results.length})
                    </p>
                    <div className="divide-y divide-cream-border/60">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 py-3 group hover:bg-white/80 p-2 rounded-lg transition-colors"
                        >
                          <img
                            src={product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded bg-cream shrink-0 border border-cream-border"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-sm font-medium text-charcoal group-hover:text-botanical transition-colors truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-charcoal-muted truncate">
                              {product.shortDescription}
                            </p>
                            <span className="text-xs font-semibold text-charcoal mt-0.5 inline-block">
                              {formatINR(product.sellingPrice)}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-charcoal-muted group-hover:text-botanical group-hover:translate-x-1 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <p className="font-serif text-base text-charcoal">No formulations found for &ldquo;{query}&rdquo;</p>
                    <p className="text-xs text-charcoal-muted">
                      Try searching for active ingredients like Bakuchiol, Niacinamide, Centella, or Ceramide.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};