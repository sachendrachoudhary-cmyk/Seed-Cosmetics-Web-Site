const fs = require("fs");
const path = require("path");

function write(relPath, content) {
  const full = path.join(__dirname, "..", relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim(), "utf8");
  console.log("Generated:", relPath);
}

// 1. CONTACT PAGE
const contactPage = `"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "Order Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Concierge Support</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Get in Touch</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Have questions about our botanical seed formulations, your routine, or order status? Our concierge team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl border border-cream-border p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-serif text-xl text-charcoal">Seed Cosmetics HQ</h2>

          <div className="space-y-4 text-xs text-charcoal-light">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Facility & Formulation Lab</p>
                <p className="text-charcoal-muted">Sector 48, Sohna Road, Gurugram, Haryana 122018, India</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Customer Concierge</p>
                <a href="mailto:care@seedcosmetics.in" className="text-botanical hover:underline">
                  care@seedcosmetics.in
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Helpline & WhatsApp</p>
                <p className="text-charcoal-muted">+91 (0124) 492-7333</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Operating Hours</p>
                <p className="text-charcoal-muted">Monday – Saturday: 10:00 AM – 6:30 PM IST</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-cream-border">
            <p className="text-[11px] text-charcoal-muted">
              For rapid order tracking without contacting support, visit our{" "}
              <Link href="/track" className="text-botanical font-semibold hover:underline">
                Live Tracking Portal
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-border p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-charcoal">Message Received</h3>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                Thank you, {formData.name}. Our botanical skincare concierge will review your inquiry and respond within 24 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs uppercase tracking-widest font-bold text-botanical hover:underline pt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="font-serif text-xl text-charcoal mb-2">Send a Botanical Inquiry</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="radhika@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Order # (Optional)</label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. SC-1790600123"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none bg-white text-sm"
                >
                  <option value="Order Inquiry">Order Inquiry & Dispatch</option>
                  <option value="Product Recommendation">Product & Routine Recommendation</option>
                  <option value="Returns & Damage">Damaged Item or Return Request</option>
                  <option value="Partnership">Corporate / Wholesale Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with our cold-pressed seed formulations?"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-botanical hover:bg-botanical-dark text-white font-sans text-xs uppercase tracking-widest font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
`;
write("frontend/src/app/contact/page.tsx", contactPage);

// 2. SEARCH PAGE
const searchPage = `"use client";

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
          {query ? \`Showing results for "\${query}"\` : "Explore All Formulations"}
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
              className={\`px-3 py-1.5 rounded-lg capitalize transition-colors \${
                selectedCategory === cat
                  ? "bg-botanical text-white font-semibold"
                  : "text-charcoal-muted hover:text-charcoal bg-cream/40"
              }\`}
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
            We couldn\'t find any match for "{query}". Try checking for spelling, searching for an active ingredient (like Rosehip or Bakuchiol), or browse our bestsellers.
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
`;
write("frontend/src/app/search/page.tsx", searchPage);

// 3. 404 NOT FOUND PAGE
const notFoundPage = `import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Error 404</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal">Formulation Not Found</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          The page or botanical elixir you are looking for may have been archived, restocked under a new link, or never extracted.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto bg-botanical hover:bg-botanical-dark text-white px-6 py-3 rounded font-sans text-xs uppercase tracking-widest font-bold transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto border border-cream-border hover:bg-cream px-6 py-3 rounded font-sans text-xs uppercase tracking-widest font-bold text-charcoal transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
write("frontend/src/app/not-found.tsx", notFoundPage);

// 4. ERROR BOUNDARY
const errorPage = `"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-cream-border shadow-luxury text-center space-y-5">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">System Notice</p>
          <h1 className="font-serif text-2xl text-charcoal">Something went wrong</h1>
          <p className="text-xs text-charcoal-muted">
            An unexpected error interrupted this session. Our botanical systems have logged the event.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-botanical hover:bg-botanical-dark text-white px-6 py-2.5 rounded font-sans text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto border border-cream-border px-6 py-2.5 rounded font-sans text-xs uppercase tracking-widest font-bold text-charcoal hover:bg-cream transition-colors"
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
write("frontend/src/app/error.tsx", errorPage);

console.log("All auxiliary pages (contact, search, not-found, error) generated!");
