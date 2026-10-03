import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Returns & Refund Policy | Seed Cosmetics",
};

export default function PolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8">
      <div className="border-b border-cream-border pb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Seed Cosmetics Legal</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Returns & Refund Policy</h1>
      </div>
      <div className="space-y-8 text-charcoal-light">
        
        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">7-Day Botanical Satisfaction Guarantee</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">Due to the sterile and hygienic nature of personal care formulations, we accept returns on unopened, unused products in their original tamper-evident seals within 7 calendar days of delivery.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Transit Damage & Defective Shipments</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">In the rare event that your shipment arrives damaged, leaking, or with broken seals, please photograph the package and send an email to care@seedcosmetics.in within 48 hours of delivery. We will immediately dispatch an expedited replacement at no extra charge, or issue a complete refund without requiring you to return the damaged item.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Refund Initiation & Timelines</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">Once your returned parcel is received and inspected at our warehouse, your refund is approved and initiated through Razorpay to your original payment mode (UPI, NetBanking, Credit/Debit Card) within 24 to 48 hours. Depending on your bank provider, funds appear in your account within 5 to 7 business days.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Non-Returnable Items</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">Products that have had their safety seal broken, bottles that have been pumped or tested, or items marked as clearance/free gift samples cannot be returned for hygiene and bio-safety compliance.</p>
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