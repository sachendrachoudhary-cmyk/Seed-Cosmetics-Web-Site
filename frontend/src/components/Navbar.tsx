"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User as UserIcon, Menu, X, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { itemsCount, openDrawer } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-cream-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal hover:text-botanical transition-colors"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/shop"
              className="text-sm font-medium tracking-wider uppercase text-charcoal hover:text-botanical transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/category/serums-treatments"
              className="text-sm font-medium tracking-wider uppercase text-charcoal hover:text-botanical transition-colors"
            >
              Serums
            </Link>
            <Link
              href="/category/toners-mists"
              className="text-sm font-medium tracking-wider uppercase text-charcoal hover:text-botanical transition-colors"
            >
              Toners
            </Link>
            <Link
              href="/category/hair-care"
              className="text-sm font-medium tracking-wider uppercase text-charcoal hover:text-botanical transition-colors"
            >
              Hair Rituals
            </Link>
            <Link
              href="/guides/science-of-cold-pressed-seed-oils"
              className="text-sm font-medium tracking-wider uppercase text-charcoal hover:text-botanical transition-colors"
            >
              The Journal
            </Link>
          </nav>

          {/* Brand Logo (Center) */}
          <div className="text-center flex flex-col items-center">
            <Link href="/" className="group flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-medium text-charcoal group-hover:text-botanical transition-colors uppercase">
                Seed Cosmetics
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-charcoal-muted mt-0.5 font-sans">
                Care Begins Here.
              </span>
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="flex items-center space-x-5">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-charcoal hover:text-botanical transition-colors flex items-center gap-1.5"
              title="Search products..."
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-charcoal-muted">Search</span>
            </button>

            {/* Account dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-2 text-charcoal hover:text-botanical transition-colors flex items-center gap-1"
                title="Account"
              >
                <UserIcon className="w-5 h-5" />
                {user && (
                  <span className="hidden md:inline-block text-xs font-medium text-charcoal">
                    {user.name.split(" ")[0]}
                  </span>
                )}
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-luxury border border-cream-border py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-cream-border">
                        <p className="text-xs text-charcoal-muted">Signed in as</p>
                        <p className="text-sm font-medium text-charcoal truncate">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-botanical-soft text-botanical-dark rounded font-semibold uppercase tracking-wider">
                            Store Admin
                          </span>
                        )}
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-cream transition-colors"
                      >
                        My Orders & Addresses
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-botanical-dark font-medium hover:bg-botanical-soft transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-botanical" /> Admin Control Centre
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/account/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-charcoal font-medium hover:bg-cream transition-colors"
                      >
                        Log In
                      </Link>
                      <Link
                        href="/account/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-cream transition-colors"
                      >
                        Create an Account
                      </Link>
                      <div className="border-t border-cream-border mt-1 pt-1">
                        <Link
                          href="/track"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-charcoal-muted hover:text-botanical transition-colors"
                        >
                          Track an Order
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={openDrawer}
              className="p-2 text-charcoal hover:text-botanical transition-colors relative flex items-center"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-botanical text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                  {itemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-canvas border-b border-cream-border px-6 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-serif tracking-wider text-charcoal hover:text-botanical"
          >
            Shop All Formulations
          </Link>
          <Link
            href="/category/face-care"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-charcoal-light hover:text-botanical pl-2"
          >
            &bull; Face Care & Moisturisers
          </Link>
          <Link
            href="/category/serums-treatments"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-charcoal-light hover:text-botanical pl-2"
          >
            &bull; Active Botanical Serums
          </Link>
          <Link
            href="/category/toners-mists"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-charcoal-light hover:text-botanical pl-2"
          >
            &bull; Hydrosols & Toners
          </Link>
          <Link
            href="/category/hair-care"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-charcoal-light hover:text-botanical pl-2"
          >
            &bull; Hair & Scalp Rituals
          </Link>
          <Link
            href="/about-seed-cosmetics"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-serif tracking-wider text-charcoal hover:text-botanical pt-2 border-t border-cream-border"
          >
            Our Botanical Philosophy
          </Link>
          <Link
            href="/guides/science-of-cold-pressed-seed-oils"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-serif tracking-wider text-charcoal hover:text-botanical"
          >
            The Seed Journal
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gold-dark hover:text-botanical"
          >
            Track My Order
          </Link>
        </div>
      )}
    </header>
  );
};