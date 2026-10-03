const fs = require("fs");
const path = require("path");

function write(filePath, content) {
  const full = path.join(__dirname, "..", filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim(), "utf8");
  console.log("Generated:", filePath);
}

const cartPage = `"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/utils/formatters";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon, itemsCount } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [applying, setApplying] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 999;
  const currentSubtotal = cart?.subtotal || 0;
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - currentSubtotal);
  const progressPercent = Math.min(100, Math.round((currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setApplying(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const msg = await applyCoupon(couponInput.trim());
      setCouponSuccess(msg);
      setCouponInput("");
    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon code");
    } finally {
      setApplying(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-cream border border-cream-border flex items-center justify-center text-charcoal-muted">
          <ShoppingBag className="w-10 h-10 opacity-30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Your Botanical Bag is Empty</h1>
        <p className="text-sm text-charcoal-muted max-w-md mx-auto">
          Explore our gentle cold-pressed seed oils, clarifying toners, and barrier repair creams to start your ritual.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-botanical hover:bg-botanical-dark text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-lg shadow-luxury transition-all"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Shopping Bag</h1>
        <p className="text-xs text-charcoal-muted uppercase tracking-wider">
          Review your botanical selection ({itemsCount} items)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 bg-cream rounded-xl border border-cream-border">
            {amountNeeded > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-charcoal flex justify-between">
                  <span>Add <strong>{formatINR(amountNeeded)}</strong> more to qualify for <strong>FREE Delivery</strong></span>
                  <span className="font-mono text-charcoal-muted">{progressPercent}%</span>
                </p>
                <div className="w-full bg-[#DED6C8] h-2 rounded-full overflow-hidden">
                  <div className="bg-botanical h-full rounded-full transition-all duration-300" style={{ width: progressPercent + "%" }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-botanical">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span>You have unlocked Complimentary Express Shipping across India!</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-cream-border overflow-hidden divide-y divide-cream-border">
            {cart.items.map((item) => (
              <div key={item._id} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-cream rounded-lg overflow-hidden shrink-0 border border-cream-border">
                    <img
                      src={item.product?.thumbnail || item.product?.images?.[0]?.url || "/placeholder.jpg"}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={"/products/" + item.product?.slug}
                      className="font-serif text-base text-charcoal hover:text-botanical transition-colors font-medium block"
                    >
                      {item.product?.name}
                    </Link>
                    {item.variantTitle && (
                      <p className="text-xs text-charcoal-muted">Size: {item.variantTitle}</p>
                    )}
                    <p className="text-xs font-semibold text-charcoal">{formatINR(item.unitPrice)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                  <div className="flex items-center border border-cream-border rounded-lg bg-cream">
                    <button
                      onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                      className="p-1.5 hover:text-botanical"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-mono text-xs font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                      className="p-1.5 hover:text-botanical"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-serif text-base font-semibold text-charcoal min-w-[70px] text-right">
                    {formatINR(item.lineTotal)}
                  </span>

                  <button
                    onClick={() => removeItem(item._id!)}
                    className="text-charcoal-muted hover:text-red-500 p-1.5"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-cream-border shadow-sm space-y-6">
          <h2 className="font-serif text-xl text-charcoal">Order Summary</h2>

          <div className="space-y-2">
            {cart.couponCode ? (
              <div className="flex items-center justify-between p-3 bg-botanical-soft rounded-lg border border-botanical/20 text-xs">
                <div className="flex items-center gap-1.5 text-botanical-dark font-medium">
                  <Tag className="w-4 h-4 text-botanical" />
                  <span>Code <strong>{cart.couponCode}</strong> applied (-{formatINR(cart.couponDiscount)})</span>
                </div>
                <button onClick={removeCoupon} className="text-red-600 font-semibold hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. WELCOME10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 text-xs border border-cream-border rounded-lg px-3 py-2.5 uppercase font-mono placeholder:normal-case focus:outline-none focus:border-botanical"
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="bg-charcoal hover:bg-botanical text-white text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {applying ? "..." : "Apply"}
                </button>
              </form>
            )}

            {couponError && <p className="text-xs text-red-600">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-emerald-600">{couponSuccess}</p>}
          </div>

          <div className="space-y-3 text-xs text-charcoal-light border-t border-cream-border pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(cart.subtotal)}</span>
            </div>
            {cart.couponDiscount > 0 && (
              <div className="flex justify-between text-botanical font-semibold">
                <span>Coupon Discount</span>
                <span>-{formatINR(cart.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>{cart.shippingFee === 0 ? <strong className="text-botanical">FREE</strong> : formatINR(cart.shippingFee)}</span>
            </div>
            <div className="border-t border-cream-border pt-3 flex justify-between text-base font-semibold text-charcoal">
              <span>Total Amount</span>
              <span className="font-serif text-xl">{formatINR(cart.grandTotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-botanical hover:bg-botanical-dark text-white py-4 px-6 rounded-lg font-sans text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-luxury hover:shadow-luxury-hover transition-all"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

write("frontend/src/app/cart/page.tsx", cartPage);