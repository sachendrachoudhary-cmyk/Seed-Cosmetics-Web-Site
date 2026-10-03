const fs = require("fs");
const path = require("path");

function write(filePath, content) {
  const full = path.join(__dirname, "..", filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim(), "utf8");
  console.log("Generated:", filePath);
}

// 1. ABOUT PAGE
const aboutPage = `import React from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Shield, Award, Heart } from "lucide-react";

export const metadata = {
  title: "Our Botanical Philosophy | Seed Cosmetics India",
  description: "Learn about Seed Cosmetics - mass-premium Indian personal care formulated with pure cold-pressed seed oils and clinically tested actives.",
  alternates: { canonical: "https://www.seedcosmetics.in/about-seed-cosmetics" },
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">The Seed Story</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal leading-tight">
          Care Begins Here.
        </h1>
        <p className="text-base text-charcoal-light leading-relaxed">
          Seed Cosmetics was founded on a singular conviction: that the most potent healing and restorative compounds for human skin reside in the dormant heart of botanical seeds.
        </p>
      </div>

      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-luxury border border-cream-border">
        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80"
          alt="Seed Cosmetics Botanical Laboratory"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm text-charcoal-light leading-relaxed">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-charcoal">The Biology of Cold-Pressed Seeds</h2>
          <p>
            A seed is botanical life suspended in its most nutrient-dense state. When extracted via gentle, slow mechanical cold-pressing—without excessive friction heat or toxic chemical solvents like hexane—the delicate lipid profiles remain undamaged.
          </p>
          <p>
            Unlike synthetic carrier agents and mineral oils that sit inertly on the skin surface, unrefined botanical seed oils possess high concentrations of essential fatty acids (Linoleic Omega-6 and Alpha-Linolenic Omega-3) that mimic the skin natural lipid bilayer.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-charcoal">Formulated for Indian Climates</h2>
          <p>
            Indian skin frequently navigates sharp humidity shifts, intense tropical UV radiation, and urban environmental smog. Formulating for these conditions demands high active efficacy without suffocating textures.
          </p>
          <p>
            Every formulation at Seed Cosmetics is balanced to physiological skin pH 5.0–5.5, ensuring your protective acid mantle remains fortified against bacterial overgrowth and trans-epidermal moisture loss.
          </p>
        </div>
      </div>

      <div className="bg-botanical-dark text-white rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl">Experience the Botanical Difference</h3>
        <p className="text-xs sm:text-sm text-cream/70 max-w-md mx-auto">
          Explore our complete range of cold-pressed facial elixirs, clarifying toners, and scalp treatments.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-gold hover:bg-gold-dark text-charcoal px-8 py-3.5 rounded font-sans text-xs uppercase tracking-widest font-bold transition-colors"
        >
          Explore Catalogue
        </Link>
      </div>
    </div>
  );
}
`;
write("frontend/src/app/about-seed-cosmetics/page.tsx", aboutPage);

// 2. GUIDES DETAIL PAGE
const guidePage = `import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, User, ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

interface GuideProps {
  params: {
    slug: string;
  };
}

async function getGuide(slug: string) {
  try {
    const res = await fetch("http://localhost:5000/api/content/articles/" + slug, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.content;
    }
  } catch (err) {
    console.error("Failed to load article:", err);
  }
  return null;
}

export async function generateMetadata({ params }: GuideProps) {
  const guide = await getGuide(params.slug);
  if (!guide) return { title: "Article Not Found | Seed Cosmetics" };

  return {
    title: guide.seo?.title || (guide.title + " | Seed Journal"),
    description: guide.seo?.metaDescription || guide.excerpt,
    alternates: { canonical: "https://www.seedcosmetics.in/guides/" + guide.slug },
  };
}

export default async function GuidePage({ params }: GuideProps) {
  const guide = await getGuide(params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted uppercase tracking-wider">
        <Link href="/" className="hover:text-botanical">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/about-seed-cosmetics" className="hover:text-botanical">The Journal</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-semibold truncate max-w-xs">{guide.title}</span>
      </nav>

      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">
          {guide.category || "Botanical Science"}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal leading-tight">
          {guide.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs text-charcoal-muted pt-2">
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {guide.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(guide.publishedAt || guide.createdAt)}</span>
        </div>
      </div>

      {guide.featuredImage && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-cream-border shadow-luxury">
          <img src={guide.featuredImage} alt={guide.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-stone max-w-none text-charcoal-light leading-relaxed whitespace-pre-line text-sm sm:text-base pt-4">
        {guide.body}
      </div>

      <div className="border-t border-cream-border pt-8 flex justify-between items-center">
        <Link href="/shop" className="text-xs uppercase tracking-widest font-semibold text-botanical flex items-center gap-1.5 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Return to Shop
        </Link>
      </div>
    </article>
  );
}
`;
write("frontend/src/app/guides/[slug]/page.tsx", guidePage);

// 3. FAQ PAGE
const faqPage = `"use client";

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
`;
write("frontend/src/app/faq/page.tsx", faqPage);

// 4. POLICIES GENERATOR
const policies = [
  {
    path: "frontend/src/app/shipping-policy/page.tsx",
    title: "Shipping & Delivery Policy",
    sections: [
      {
        heading: "Dispatch Timelines",
        body: "All Seed Cosmetics orders are processed and dispatched within 24 to 48 business hours from our laboratory facility in Gurugram, Haryana. Orders placed on Sundays or public holidays are fulfilled on the immediate next working business day.",
      },
      {
        heading: "Free Shipping Threshold & Delivery Charges",
        body: "We offer Complimentary Express Shipping on all prepaid orders exceeding ₹999 anywhere across India. For orders below the ₹999 threshold, a nominal flat express shipping fee of ₹99 is calculated at checkout.",
      },
      {
        heading: "Logistics Partners & Real-Time Tracking",
        body: "We partner exclusively with tier-1 national logistics networks including BlueDart, Delhivery, and DTDC. As soon as your order has been dispatched, you will receive an automated tracking link and AWB tracking identifier via SMS and registered email address.",
      },
      {
        heading: "Delivery Transit Estimates",
        body: "Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad): 2 to 4 business days.\\nTier 2 & Tier 3 Cities / Non-Metro Destinations: 4 to 7 business days.\\nNorth-East & Remote Regions: 6 to 9 business days.",
      },
    ],
  },
  {
    path: "frontend/src/app/returns-refunds/page.tsx",
    title: "Returns & Refund Policy",
    sections: [
      {
        heading: "7-Day Botanical Satisfaction Guarantee",
        body: "Due to the sterile and hygienic nature of personal care formulations, we accept returns on unopened, unused products in their original tamper-evident seals within 7 calendar days of delivery.",
      },
      {
        heading: "Transit Damage & Defective Shipments",
        body: "In the rare event that your shipment arrives damaged, leaking, or with broken seals, please photograph the package and send an email to care@seedcosmetics.in within 48 hours of delivery. We will immediately dispatch an expedited replacement at no extra charge, or issue a complete refund without requiring you to return the damaged item.",
      },
      {
        heading: "Refund Initiation & Timelines",
        body: "Once your returned parcel is received and inspected at our warehouse, your refund is approved and initiated through Razorpay to your original payment mode (UPI, NetBanking, Credit/Debit Card) within 24 to 48 hours. Depending on your bank provider, funds appear in your account within 5 to 7 business days.",
      },
      {
        heading: "Non-Returnable Items",
        body: "Products that have had their safety seal broken, bottles that have been pumped or tested, or items marked as clearance/free gift samples cannot be returned for hygiene and bio-safety compliance.",
      },
    ],
  },
  {
    path: "frontend/src/app/privacy-policy/page.tsx",
    title: "Privacy Policy",
    sections: [
      {
        heading: "Information We Collect",
        body: "When you interact with Seed Cosmetics, we collect personal information you explicitly provide: your name, shipping address, billing address, telephone number, and email address. This information is utilized solely for order processing, logistics coordination, and customer account administration.",
      },
      {
        heading: "Payment Data & Financial Security",
        body: "Seed Cosmetics never captures, stores, or processes your sensitive payment card details or UPI PINs on our servers. All transactions are securely handled by Razorpay, a PCI-DSS Level 1 certified payment aggregator utilizing bank-grade 256-bit SSL encryption.",
      },
      {
        heading: "Cookie Usage & Session Tracking",
        body: "We employ strictly necessary cookies and session tokens to preserve your shopping bag contents, authenticate your customer dashboard, and remember your browsing preferences across visits.",
      },
      {
        heading: "Zero Data Brokerage Guarantee",
        body: "We strictly uphold a zero-data-brokerage commitment. Your private contact details and purchase histories are never rented, traded, sold, or shared with third-party telemarketing networks.",
      },
    ],
  },
  {
    path: "frontend/src/app/terms/page.tsx",
    title: "Terms of Service",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By accessing, browsing, or purchasing products through www.seedcosmetics.in, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service and applicable laws of India.",
      },
      {
        heading: "2. Cosmetic Use & Patch-Testing Disclaimer",
        body: "All formulations crafted by Seed Cosmetics are topical cosmetic personal care products intended for external application only. They are not pharmaceutical medications and are not intended to diagnose, cure, mitigate, or treat clinical medical dermatological conditions. We strongly recommend performing a 24-hour patch test on the inner forearm prior to full facial or scalp application.",
      },
      {
        heading: "3. Pricing, Accuracy & Orders",
        body: "All prices on our storefront are quoted in Indian Rupees (INR) inclusive of applicable 18% Goods and Services Tax (GST). We reserve the right to modify prices or correct inadvertent typographical errors without prior notification. In the event of a pricing anomaly, we will notify you prior to order fulfillment.",
      },
      {
        heading: "4. Intellectual Property & Governing Jurisdiction",
        body: "All trademarks, product names, botanical formulations, graphic assets, brand typography, and proprietary copy remain the intellectual property of Seed Cosmetics India. Any legal dispute or claim arising from use of this website shall fall under the exclusive jurisdiction of the competent courts of Gurugram, Haryana, India.",
      },
    ],
  },
];

for (const p of policies) {
  const sectionsJsx = p.sections.map(s => `
        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">${s.heading}</h2>
          <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">${s.body}</p>
        </div>`
  ).join("\n");

  const code = `import React from "react";
import Link from "next/link";

export const metadata = {
  title: "${p.title} | Seed Cosmetics",
};

export default function PolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8">
      <div className="border-b border-cream-border pb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Seed Cosmetics Legal</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">${p.title}</h1>
      </div>
      <div className="space-y-8 text-charcoal-light">
        ${sectionsJsx}
      </div>
      <div className="pt-8 border-t border-cream-border">
        <Link href="/" className="text-xs uppercase tracking-widest font-semibold text-botanical hover:underline">
          &larr; Return to Homepage
        </Link>
      </div>
    </div>
  );
}
`;
  write(p.path, code);
}

console.log("All content & policy pages successfully generated!");