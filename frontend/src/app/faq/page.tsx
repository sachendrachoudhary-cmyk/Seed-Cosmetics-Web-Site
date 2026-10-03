"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes Seed Cosmetics different from regular skincare brands?",
      a: "Unlike brands that use inert petroleum mineral oil bases, all our formulations are built upon nutrient-dense, virgin cold-pressed seed oils (Rosehip, Babchi, Sesame, Castor) combined with clinical dermatological actives (5 Ceramides, Niacinamide, Centella Asiatica) at verified physiological pH levels.",
    },
    {
      q: "Are Seed Cosmetics formulations suitable for acne-prone skin?",
      a: "Yes. Our oils are specifically selected for their high linoleic acid profile and low comedogenic ratings (such as Rosehip, rating 1), which help liquefy hardened sebum and prevent pore blockages.",
    },
    {
      q: "How long does shipping take across India?",
      a: "Orders are prepared fresh in our Gurugram facility and dispatched via express courier (BlueDart, Delhivery) within 24 business hours. Deliveries to metro cities usually arrive in 2–3 business days.",
    },
    {
      q: "What payment methods are supported on Seed Cosmetics?",
      a: "We partner with Razorpay to provide secure 256-bit encrypted payments supporting all Indian UPI options (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit cards (Visa, Mastercard, RuPay), and NetBanking.",
    },
    {
      q: "Can I cancel or return my order?",
      a: "Unopened products can be returned within 7 days of delivery in their original tamper-evident packaging. In the rare event of transit damage, we provide immediate replacement or a full refund upon photo verification.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-10">
      <div className="text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Help Centre</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">Answers regarding formulations, orders, shipping, and returns.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white rounded-xl border border-cream-border overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif text-base sm:text-lg text-charcoal hover:text-botanical transition-colors"
            >
              <span>{f.q}</span>
              {openIdx === i ? <ChevronUp className="w-4 h-4 shrink-0 text-botanical" /> : <ChevronDown className="w-4 h-4 shrink-0 text-charcoal-muted" />}
            </button>
            {openIdx === i && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-charcoal-light leading-relaxed border-t border-cream-border/60 pt-3">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-cream rounded-xl border border-cream-border text-center space-y-2 text-xs">
        <p className="font-semibold text-charcoal">Have a question not answered here?</p>
        <p className="text-charcoal-muted">Reach out to our botanical customer concierge at <a href="mailto:care@seedcosmetics.in" className="text-botanical font-semibold underline">care@seedcosmetics.in</a></p>
      </div>
    </div>
  );
}