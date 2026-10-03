import React from "react";
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