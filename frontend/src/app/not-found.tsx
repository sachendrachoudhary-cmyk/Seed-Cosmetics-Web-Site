import React from "react";
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