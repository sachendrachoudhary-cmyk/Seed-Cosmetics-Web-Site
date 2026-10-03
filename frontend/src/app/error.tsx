"use client";

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