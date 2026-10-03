"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { fetchApi } from "@/utils/api";
import { Search as SearchIcon, Filter, RefreshCw, Sparkles } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      try {
        const res = await fetchApi<{ success: boolean; products: any[] }>(
          "/products?search=" + encodeURIComponent(query)
        );
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [query]);

  const filtered = products
    .filter((p) => {
      if (selectedCategory === "all") return true;
      const catName = typeof p.category === "object" ? p.category?.name : p.category;
      return catName?.toLowerCase() === selectedCategory.toLowerCase();
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.sellingPrice - b.sellingPrice;
      if (sortBy === "price_desc") return b.sellingPrice - a.sellingPrice;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-2 border-b border-cream-border pb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Search Results</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
          {query ? `Showing results for "${query}"` : "Explore All Formulations"}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Found {filtered.length} matching cold-pressed botanical product{filtered.length === 1 ? "" : "s"}.
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-cream-border text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-botanical" />
          <span className="font-semibold text-charcoal">Category:</span>
          {["all", "skin", "hair", "body"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                selectedCategory === cat
                  ? "bg-botanical text-white font-semibold"
                  : "text-charcoal-muted hover:text-charcoal bg-cream/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-charcoal">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-cream-border bg-white text-xs outline-none"
          >
            <option value="popular">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <RefreshCw className="w-8 h-8 text-botanical animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-cream-border p-8">
          <SearchIcon className="w-10 h-10 text-charcoal-muted mx-auto" />
          <h3 className="font-serif text-2xl text-charcoal">No Formulations Found</h3>
          <p className="text-xs text-charcoal-muted max-w-md mx-auto">
            We couldn't find any match for "{query}". Try checking for spelling, searching for an active ingredient (like Rosehip or Bakuchiol), or browse our bestsellers.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-botanical hover:bg-botanical-dark text-white px-6 py-2.5 rounded font-sans text-xs uppercase tracking-widest font-bold"
            >
              Browse Complete Shop
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-botanical animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}