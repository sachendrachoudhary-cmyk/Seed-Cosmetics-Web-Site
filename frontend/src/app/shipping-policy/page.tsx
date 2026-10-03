import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Shipping & Delivery Policy | Seed Cosmetics",
};

export default function PolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8">
      <div className="border-b border-cream-border pb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Seed Cosmetics Legal</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Shipping & Delivery Policy</h1>
      </div>
      <div className="space-y-8 text-charcoal-light">
        
        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Dispatch Timelines</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">All Seed Cosmetics orders are processed and dispatched within 24 to 48 business hours from our laboratory facility in Gurugram, Haryana. Orders placed on Sundays or public holidays are fulfilled on the immediate next working business day.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Free Shipping Threshold & Delivery Charges</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">We offer Complimentary Express Shipping on all prepaid orders exceeding ₹999 anywhere across India. For orders below the ₹999 threshold, a nominal flat express shipping fee of ₹99 is calculated at checkout.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Logistics Partners & Real-Time Tracking</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">We partner exclusively with tier-1 national logistics networks including BlueDart, Delhivery, and DTDC. As soon as your order has been dispatched, you will receive an automated tracking link and AWB tracking identifier via SMS and registered email address.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Delivery Transit Estimates</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad): 2 to 4 business days.\nTier 2 & Tier 3 Cities / Non-Metro Destinations: 4 to 7 business days.\nNorth-East & Remote Regions: 6 to 9 business days.</p>
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