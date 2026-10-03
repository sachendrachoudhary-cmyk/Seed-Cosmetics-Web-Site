"use client";

import React, { useState } from "react";
import { Sparkles, Check, Copy } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyCoupon = () => {
    navigator.clipboard.writeText("WELCOME10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-botanical-dark text-white text-xs py-2 px-4 text-center font-sans tracking-wide flex items-center justify-center gap-2 relative z-50">
      <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
      <span>
        Complimentary Express Shipping across India on orders over ₹999 &bull; Use code{" "}
        <strong className="text-gold tracking-widest font-mono uppercase">WELCOME10</strong> for 10% off
      </span>
      <button
        onClick={copyCoupon}
        className="ml-2 inline-flex items-center gap-1 text-[10px] bg-white/10 hover:bg-white/20 text-cream px-2 py-0.5 rounded transition-colors"
        title="Copy coupon code"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-emerald-400" /> Copied
          </>
        ) : (
          <>
            <Copy className="w-3 h-3 text-gold" /> Copy
          </>
        )}
      </button>
    </div>
  );
};