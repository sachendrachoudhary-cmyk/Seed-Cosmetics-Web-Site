import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Shield, Leaf, Droplets, Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

async function getShowcaseData() {
  try {
    const res = await fetch("http://localhost:5000/api/products/showcase", {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Could not reach backend during SSR, falling back to static showcase data.");
  }
  return { bestSellers: [], newArrivals: [], featured: [] };
}

export default async function HomePage() {
  const data = await getShowcaseData();
  const bestSellers = data.bestSellers || [];

  const categories = [
    {
      name: "Facial Serums",
      slug: "serums-treatments",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",
      count: "Concentrated Actives",
    },
    {
      name: "Clarifying Toners",
      slug: "toners-mists",
      image: "https://images.unsplash.com/photo-1608248597359-59754f923297?auto=format&fit=crop&w=500&q=80",
      count: "Alcohol-Free Hydrosols",
    },
    {
      name: "Barrier Moisturizers",
      slug: "face-care",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
      count: "5-Ceramide Lipid Creams",
    },
    {
      name: "Scalp Growth Oils",
      slug: "hair-care",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80",
      count: "Rosemary & Bhringraj",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F3ECE1] border-b border-cream-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-cream-border text-xs uppercase tracking-widest font-semibold text-botanical">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> Botanical Science &bull; Formulated in India
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-[1.15] tracking-tight">
                Pure, Potent, <br />
                <span className="italic font-normal text-botanical-dark">Botanical Science.</span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-light leading-relaxed max-w-xl font-sans">
                Formulated with unrefined cold-pressed seed lipids, clinical dermatological bio-actives, and zero synthetic fillers. Designed to rebuild compromised barriers and cultivate resilient, naturally radiant skin.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/shop"
                  className="bg-botanical hover:bg-botanical-dark text-white px-8 py-4 rounded font-sans text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 shadow-luxury hover:shadow-luxury-hover transition-all"
                >
                  Explore Catalogue <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about-seed-cosmetics"
                  className="bg-white hover:bg-cream text-charcoal px-8 py-4 rounded font-sans text-xs uppercase tracking-[0.2em] font-semibold border border-cream-border transition-colors"
                >
                  Our Philosophy
                </Link>
              </div>

              {/* Mini highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cream-border/70 max-w-lg">
                <div>
                  <p className="font-serif text-2xl font-bold text-charcoal">100%</p>
                  <p className="text-xs text-charcoal-muted">Vegan & Cruelty-Free</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-charcoal">0%</p>
                  <p className="text-xs text-charcoal-muted">Synthetic Fragrance</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-charcoal">5.2</p>
                  <p className="text-xs text-charcoal-muted">Physiological Skin pH</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80"
                  alt="Seed Cosmetics Glass Dropper Bottles on Botanical Surface"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-gold-light">Signature Formulation</p>
                  <p className="font-serif text-xl sm:text-2xl font-medium">Bakuchiol & Cold-Pressed Rosehip</p>
                  <p className="text-xs text-white/80">Gentle natural retinol alternative for sensitive Indian skin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED BOTANICAL CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">
            Botanical Categorisation
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Targeted Regimens for Every Need
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-white border border-cream-border shadow-sm hover:shadow-luxury-hover transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-[10px] uppercase tracking-widest text-gold-light font-mono font-medium">
                  {cat.count}
                </p>
                <h3 className="font-serif text-lg sm:text-xl font-medium group-hover:text-gold-light transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">
              Loved by Our Community
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mt-1">
              Flagship Botanical Formulations
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest font-semibold text-botanical hover:text-botanical-dark flex items-center gap-1.5 transition-colors"
          >
            View Complete Catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fallback cards if backend is booting */}
            <div className="p-8 text-center bg-white rounded-lg border border-cream-border col-span-4 py-16">
              <p className="font-serif text-lg text-charcoal">Loading fresh botanical batch...</p>
              <Link href="/shop" className="text-xs text-botanical font-semibold mt-2 inline-block underline">
                Browse Shop Directly
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. THE INGREDIENT STORY / "WHY SEED COSMETICS" */}
      <section className="bg-white border-y border-cream-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-cream-border shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1608248597359-59754f923297?auto=format&fit=crop&w=1000&q=80"
                alt="Botanical herbs and cold pressed seed oil drops"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">
                The Science of Seed Lipids
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal leading-tight">
                Why Unrefined Seed Oils Make All the Difference
              </h2>
              <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
                Most commercial cosmetic brands rely on cheap, inert mineral oils or heavily bleached derivatives. At Seed Cosmetics, we cold-press whole botanical seeds—Rosehip, Babchi, Sesame, and Jojoba—preserving their vital fatty acid chains, polyphenols, and micronutrients.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-botanical/20 flex items-center justify-center text-botanical-dark shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-botanical" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal">Biomimetic Lipid Harmony</h4>
                    <p className="text-xs text-charcoal-muted leading-relaxed">
                      Seed lipids mirror the skin&apos;s natural sebum matrix, absorbing deeply without pore congestion.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-botanical/20 flex items-center justify-center text-botanical-dark shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-botanical" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal">Clinically Proven Plant Actives</h4>
                    <p className="text-xs text-charcoal-muted leading-relaxed">
                      Every botanical formula is paired with rigorous actives: 5 Ceramides, Niacinamide, and Centella.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-botanical/20 flex items-center justify-center text-botanical-dark shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-botanical" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal">Zero Sensitizing Additives</h4>
                    <p className="text-xs text-charcoal-muted leading-relaxed">
                      Formulated strictly without essential oils, artificial perfumes, sulfates, or drying alcohol.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/guides/science-of-cold-pressed-seed-oils"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-botanical hover:text-botanical-dark"
                >
                  Read Our Clinical Formulation Guide <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">
            Real Experiences
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Loved by Conscious Indian Skin
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-cream-border shadow-sm space-y-4">
            <div className="flex text-amber-500">
              {"★★★★★"}
            </div>
            <p className="font-serif text-base text-charcoal italic">
              &ldquo;The Bakuchiol Youth Elixir replaced my synthetic retinol completely. No flaking, no irritation, and my texture is remarkably smooth.&rdquo;
            </p>
            <div className="border-t border-cream-border/60 pt-3">
              <p className="text-xs font-semibold text-charcoal">Priya Sharma</p>
              <p className="text-[11px] text-charcoal-muted">Bengaluru &bull; Verified Buyer</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-cream-border shadow-sm space-y-4">
            <div className="flex text-amber-500">
              {"★★★★★"}
            </div>
            <p className="font-serif text-base text-charcoal italic">
              &ldquo;The 5-Ceramide cream rescued my skin after an allergic flare-up. It is so soothing, non-sticky, and lightweight in humidity.&rdquo;
            </p>
            <div className="border-t border-cream-border/60 pt-3">
              <p className="text-xs font-semibold text-charcoal">Aditi Mukherjee</p>
              <p className="text-[11px] text-charcoal-muted">Mumbai &bull; Verified Buyer</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-cream-border shadow-sm space-y-4">
            <div className="flex text-amber-500">
              {"★★★★★"}
            </div>
            <p className="font-serif text-base text-charcoal italic">
              &ldquo;The rosemary and bhringraj scalp oil has visibly decreased my seasonal hair shedding. The root applicator is so convenient!&rdquo;
            </p>
            <div className="border-t border-cream-border/60 pt-3">
              <p className="text-xs font-semibold text-charcoal">Dr. Rohit Sen</p>
              <p className="text-[11px] text-charcoal-muted">Delhi NCR &bull; Verified Buyer</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-botanical-dark text-white rounded-2xl p-8 sm:p-14 text-center space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-botanical/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium">
            Join the Botanical Movement
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl max-w-xl mx-auto leading-tight">
            Your Skin Deserves Clean, Grounded Botanical Care.
          </h2>
          <p className="text-sm text-cream/70 max-w-md mx-auto">
            Enjoy 10% off your first order with coupon code <strong className="text-gold">WELCOME10</strong> and complimentary shipping across India.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-gold hover:bg-gold-dark text-charcoal px-8 py-3.5 rounded font-sans text-xs uppercase tracking-widest font-bold shadow-lg transition-colors"
            >
              Start Your Botanical Routine
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}