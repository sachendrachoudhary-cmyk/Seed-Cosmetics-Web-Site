import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Seed Cosmetics",
};

export default function PolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8">
      <div className="border-b border-cream-border pb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Seed Cosmetics Legal</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Privacy Policy</h1>
      </div>
      <div className="space-y-8 text-charcoal-light">
        
        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Information We Collect</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">When you interact with Seed Cosmetics, we collect personal information you explicitly provide: your name, shipping address, billing address, telephone number, and email address. This information is utilized solely for order processing, logistics coordination, and customer account administration.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Payment Data & Financial Security</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">Seed Cosmetics never captures, stores, or processes your sensitive payment card details or UPI PINs on our servers. All transactions are securely handled by Razorpay, a PCI-DSS Level 1 certified payment aggregator utilizing bank-grade 256-bit SSL encryption.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Cookie Usage & Session Tracking</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">We employ strictly necessary cookies and session tokens to preserve your shopping bag contents, authenticate your customer dashboard, and remember your browsing preferences across visits.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Zero Data Brokerage Guarantee</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">We strictly uphold a zero-data-brokerage commitment. Your private contact details and purchase histories are never rented, traded, sold, or shared with third-party telemarketing networks.</p>
        </div>
      </div>
      <div className="pt-8 border-t border-cream-border">
        <Link href="/" className="text-xs uppercase tracking-widest font-semibold text-botanical hover:underline">
          &larr; Return to Homepage
        </Link>
      </div>
    </div>
  );
}