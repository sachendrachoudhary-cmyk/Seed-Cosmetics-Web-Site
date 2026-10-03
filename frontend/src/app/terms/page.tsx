import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Seed Cosmetics",
};

export default function PolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8">
      <div className="border-b border-cream-border pb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Seed Cosmetics Legal</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Terms of Service</h1>
      </div>
      <div className="space-y-8 text-charcoal-light">
        
        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">1. Acceptance of Terms</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">By accessing, browsing, or purchasing products through www.seedcosmetics.in, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service and applicable laws of India.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">2. Cosmetic Use & Patch-Testing Disclaimer</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">All formulations crafted by Seed Cosmetics are topical cosmetic personal care products intended for external application only. They are not pharmaceutical medications and are not intended to diagnose, cure, mitigate, or treat clinical medical dermatological conditions. We strongly recommend performing a 24-hour patch test on the inner forearm prior to full facial or scalp application.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">3. Pricing, Accuracy & Orders</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">All prices on our storefront are quoted in Indian Rupees (INR) inclusive of applicable 18% Goods and Services Tax (GST). We reserve the right to modify prices or correct inadvertent typographical errors without prior notification. In the event of a pricing anomaly, we will notify you prior to order fulfillment.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">4. Intellectual Property & Governing Jurisdiction</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">All trademarks, product names, botanical formulations, graphic assets, brand typography, and proprietary copy remain the intellectual property of Seed Cosmetics India. Any legal dispute or claim arising from use of this website shall fall under the exclusive jurisdiction of the competent courts of Gurugram, Haryana, India.</p>
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