"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Leaf, HeartHandshake, Award } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#262420] text-cream border-t border-[#3E3A34]">
      {/* Botanical Trust Pillars Section */}
      <div className="border-b border-[#3E3A34]/80 py-10 bg-[#1F1D1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-botanical/20 flex items-center justify-center text-botanical-light mb-1">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base text-cream tracking-wide">Cold-Pressed Actives</h4>
              <p className="text-xs text-cream/60 max-w-[200px]">Virgin botanical lipids extracted without heat to preserve bio-actives.</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-botanical/20 flex items-center justify-center text-botanical-light mb-1">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base text-cream tracking-wide">Clinical Efficacy</h4>
              <p className="text-xs text-cream/60 max-w-[200px]">Dermatologically tested formulations tailored for Indian skin types.</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-botanical/20 flex items-center justify-center text-botanical-light mb-1">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base text-cream tracking-wide">Clean Formulation</h4>
              <p className="text-xs text-cream/60 max-w-[200px]">Zero synthetic fragrances, parabens, silicones, or mineral oils.</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-botanical/20 flex items-center justify-center text-botanical-light mb-1">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base text-cream tracking-wide">100% Cruelty-Free</h4>
              <p className="text-xs text-cream/60 max-w-[200px]">PETA-approved vegan care. Never tested on animals, ever.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.25em] font-medium text-cream uppercase">
                Seed Cosmetics
              </span>
              <p className="text-xs tracking-[0.3em] uppercase text-gold mt-1">Care Begins Here.</p>
            </Link>
            <p className="text-sm text-cream/70 leading-relaxed max-w-sm">
              Mass-premium botanical personal care uniting ancient plant wisdom with modern dermatology. Formulated in India for resilient, naturally radiant skin.
            </p>

            <div className="pt-2">
              <h5 className="text-xs uppercase tracking-widest text-gold font-medium mb-3">
                Join the Seed Circle
              </h5>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-950/40 p-3 rounded border border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Welcome to the Seed Circle! Use code <strong>WELCOME10</strong> for 10% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-[#1C1A17] border border-[#3E3A34] text-cream text-sm px-4 py-2.5 rounded focus:outline-none focus:border-gold w-full transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-botanical hover:bg-botanical-light text-white px-5 py-2.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1 transition-colors shrink-0"
                  >
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Catalogue Links */}
          <div className="space-y-3">
            <h5 className="font-serif text-base tracking-wide text-cream">Botanical Catalogue</h5>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">
                  Shop All Formulations
                </Link>
              </li>
              <li>
                <Link href="/category/serums-treatments" className="hover:text-gold transition-colors">
                  Facial Serums & Elixirs
                </Link>
              </li>
              <li>
                <Link href="/category/toners-mists" className="hover:text-gold transition-colors">
                  Clarifying Toners & Mists
                </Link>
              </li>
              <li>
                <Link href="/category/face-care" className="hover:text-gold transition-colors">
                  Barrier Repair Creams
                </Link>
              </li>
              <li>
                <Link href="/category/hair-care" className="hover:text-gold transition-colors">
                  Ayurvedic Scalp Oils
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand & Editorial */}
          <div className="space-y-3">
            <h5 className="font-serif text-base tracking-wide text-cream">Philosophy & Guides</h5>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>
                <Link href="/about-seed-cosmetics" className="hover:text-gold transition-colors">
                  Our Seed Story
                </Link>
              </li>
              <li>
                <Link href="/guides/science-of-cold-pressed-seed-oils" className="hover:text-gold transition-colors">
                  Cold-Pressed Seed Oils
                </Link>
              </li>
              <li>
                <Link href="/guides/bakuchiol-vs-retinol-guide" className="hover:text-gold transition-colors">
                  Bakuchiol vs Retinol Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-gold transition-colors">
                  Track Your Shipment
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h5 className="font-serif text-base tracking-wide text-cream">Customer Care & Policies</h5>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>
                <Link href="/shipping-policy" className="hover:text-gold transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns-refunds" className="hover:text-gold transition-colors">
                  Returns & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li className="pt-2 text-xs text-cream/50">
                Support: <a href="mailto:care@seedcosmetics.in" className="text-gold hover:underline">care@seedcosmetics.in</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#3E3A34] flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} Seed Cosmetics India. All Rights Reserved. www.seedcosmetics.in</p>
          <div className="flex items-center space-x-4 text-[11px] text-cream/60">
            <span>Razorpay Secured</span>
            <span>&bull;</span>
            <span>UPI & Cards</span>
            <span>&bull;</span>
            <span>Fast Express Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};