"use client";

import React, { useState, useEffect } from "react";
import { Filter, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { fetchApi } from "@/utils/api";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedConcern, setSelectedConcern] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = [
    { label: "All Formulations", value: "all" },
    { label: "Facial Serums", value: "serums-treatments" },
    { label: "Clarifying Toners", value: "toners-mists" },
    { label: "Barrier Face Care", value: "face-care" },
    { label: "Hair & Scalp Rituals", value: "hair-care" },
  ];

  const concerns = [
    { label: "All Concerns", value: "all" },
    { label: "Anti-Aging & Texture", value: "Anti-Aging" },
    { label: "Pores & Oil Control", value: "Pores" },
    { label: "Barrier Repair & Sensitivity", value: "Barrier Repair" },
    { label: "Hair Fall & Scalp Health", value: "Hair Fall" },
    { label: "Dark Spots & Dullness", value: "Dark Spots" },
  ];

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let endpoint = `/products?sort=${sortBy}`;
        if (selectedCategory !== "all") {
          endpoint += `&category=${selectedCategory}`;
        }
        if (selectedConcern !== "all") {
          endpoint += `&skinConcern=${encodeURIComponent(selectedConcern)}`;
        }

        const res = await fetchApi<{ success: boolean; products: any[] }>(endpoint);
        if (res.success) {
          setProducts(res.products || []);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory, selectedConcern, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">
          Complete Botanical Catalogue
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
          Pure Botanical Formulations
        </h1>
        <p className="text-sm text-charcoal-muted max-w-xl mx-auto">
          Crafted with virgin cold-pressed seed oils and tested dermatological bio-actives. Formulated without synthetic fragrance or mineral oils.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cream-border">
        {/* Category Pills (Desktop) */}
        <div className="hidden md:flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-all ${
                selectedCategory === cat.value
                  ? "bg-botanical text-white shadow-sm"
                  : "bg-white text-charcoal hover:bg-cream border border-cream-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile Filter Button */}
        <div className="flex items-center gap-2 md:hidden w-full sm:w-auto justify-between">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold bg-white border border-cream-border px-4 py-2 rounded-lg text-charcoal"
          >
            <SlidersHorizontal className="w-4 h-4 text-botanical" /> Filters
          </button>
          <span className="text-xs text-charcoal-muted">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-charcoal-muted" />
          <span className="text-xs text-charcoal-muted hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-white border border-cream-border rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:border-botanical font-sans"
          >
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Additions</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Desktop Concern Sidebar */}
        <div className="hidden md:block space-y-6">
          <div className="bg-white p-5 rounded-xl border border-cream-border shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-charcoal tracking-wide flex items-center gap-2">
              <Filter className="w-4 h-4 text-botanical" /> Skin & Hair Concern
            </h3>
            <div className="space-y-2">
              {concerns.map((con) => (
                <button
                  key={con.value}
                  onClick={() => setSelectedConcern(con.value)}
                  className={`block w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                    selectedConcern === con.value
                      ? "bg-botanical-soft text-botanical-dark font-semibold"
                      : "text-charcoal-light hover:text-botanical hover:bg-cream"
                  }`}
                >
                  {con.label}
                </button>
              ))}
            </div>

            {(selectedCategory !== "all" || selectedConcern !== "all") && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedConcern("all");
                }}
                className="w-full text-center text-xs text-red-600 font-semibold pt-2 hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-botanical border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-charcoal-muted uppercase tracking-widest">
                Fetching botanical formulations...
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-xl border border-cream-border p-8 space-y-4">
              <p className="font-serif text-xl text-charcoal">No formulations found</p>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                No active formulations match your selected filters. Try clearing your filters to see the full collection.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedConcern("all");
                }}
                className="bg-botanical text-white px-6 py-2.5 rounded text-xs uppercase tracking-wider font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-charcoal/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-canvas rounded-t-2xl sm:rounded-2xl p-6 border border-cream-border space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-cream-border">
              <h3 className="font-serif text-lg text-charcoal">Filter Formulations</h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-5 h-5 text-charcoal" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-charcoal-muted font-semibold mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`text-xs px-3 py-1.5 rounded-full border ${
                        selectedCategory === cat.value
                          ? "bg-botanical text-white border-botanical"
                          : "bg-white text-charcoal border-cream-border"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-charcoal-muted font-semibold mb-2">Skin Concern</h4>
                <div className="flex flex-wrap gap-2">
                  {concerns.map((con) => (
                    <button
                      key={con.value}
                      onClick={() => setSelectedConcern(con.value)}
                      className={`text-xs px-3 py-1.5 rounded-full border ${
                        selectedConcern === con.value
                          ? "bg-botanical text-white border-botanical"
                          : "bg-white text-charcoal border-cream-border"
                      }`}
                    >
                      {con.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-cream-border">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedConcern("all");
                  setMobileFiltersOpen(false);
                }}
                className="w-1/2 py-2.5 border border-cream-border rounded text-xs uppercase font-semibold text-charcoal"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 py-2.5 bg-botanical text-white rounded text-xs uppercase font-semibold"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}