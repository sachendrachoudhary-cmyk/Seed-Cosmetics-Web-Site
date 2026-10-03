"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/utils/formatters";

export const CartDrawer: React.FC = () => {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeItem, applyCoupon, removeCoupon, itemsCount } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [applying, setApplying] = useState(false);

  if (!isDrawerOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-canvas shadow-2xl flex flex-col border-l border-cream-border animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-cream-border flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-botanical" />
              <h3 className="font-serif text-xl tracking-wide text-charcoal">Your Botanical Bag</h3>
              <span className="text-xs bg-cream px-2 py-0.5 rounded-full text-charcoal-muted">
                {itemsCount} {itemsCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full text-charcoal hover:bg-cream transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#EFE9DF] px-5 py-3 border-b border-cream-border text-xs">
            {amountNeeded > 0 ? (
              <div>
                <p className="text-charcoal mb-1.5 flex items-center justify-between">
                  <span>Add <strong>{formatINR(amountNeeded)}</strong> more for <strong>FREE Delivery</strong></span>
                  <span className="font-mono text-[10px] text-charcoal-muted">{progressPercent}%</span>
                </p>
                <div className="w-full bg-[#DED6C8] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-botanical h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-botanical font-medium">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span>You unlocked <strong>Free Express Shipping</strong> across India!</span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!cart || cart.items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-cream border border-cream-border flex items-center justify-center text-charcoal-muted">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h4 className="font-serif text-lg text-charcoal">Your bag is empty</h4>
                <p className="text-xs text-charcoal-muted max-w-xs mx-auto">
                  Discover our gentle botanical formulations crafted with virgin seed oils and clinical actives.
                </p>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="inline-block bg-botanical hover:bg-botanical-dark text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded transition-colors"
                >
                  Explore Catalogue
                </Link>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 bg-white rounded-lg border border-cream-border shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-cream rounded overflow-hidden relative shrink-0">
                    <img
                      src={item.product?.thumbnail || item.product?.images?.[0]?.url || "/placeholder.jpg"}
                      alt={item.product?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <Link
                          href={`/products/${item.product?.slug}`}
                          onClick={closeDrawer}
                          className="text-xs font-medium text-charcoal hover:text-botanical transition-colors line-clamp-1"
                        >
                          {item.product?.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item._id!)}
                          className="text-charcoal-muted hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantTitle && (
                        <p className="text-[11px] text-charcoal-muted mt-0.5">Size: {item.variantTitle}</p>
                      )}

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-semibold text-charcoal">
                          {formatINR(item.unitPrice)}
                        </span>
                        {item.unitMrp > item.unitPrice && (
                          <span className="text-[10px] text-charcoal-muted line-through">
                            {formatINR(item.unitMrp)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-cream-border/60">
                      <div className="flex items-center border border-cream-border rounded bg-cream">
                        <button
                          onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                          className="p-1 hover:text-botanical transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                          className="p-1 hover:text-botanical transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-charcoal">
                        {formatINR(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart && cart.items.length > 0 && (
            <div className="p-5 border-t border-cream-border bg-white space-y-4">
              {/* Coupon Form */}
              <div>
                {cart.couponCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-botanical-soft rounded border border-botanical/20 text-xs">
                    <div className="flex items-center gap-1.5 text-botanical-dark font-medium">
                      <Tag className="w-3.5 h-3.5 text-botanical" />
                      <span>Code <strong>{cart.couponCode}</strong> applied (-{formatINR(cart.couponDiscount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-charcoal-muted hover:text-red-500 text-xs font-semibold underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 text-xs border border-cream-border rounded px-3 py-2 uppercase placeholder:normal-case font-mono focus:outline-none focus:border-botanical"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="bg-charcoal hover:bg-botanical text-white text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded transition-colors disabled:opacity-50"
                    >
                      {applying ? "..." : "Apply"}
                    </button>
                  </form>
                )}

                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-charcoal-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(cart.subtotal)}</span>
                </div>
                {cart.couponDiscount > 0 && (
                  <div className="flex justify-between text-botanical font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatINR(cart.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping (India)</span>
                  <span>{cart.shippingFee === 0 ? <strong className="text-botanical">FREE</strong> : formatINR(cart.shippingFee)}</span>
                </div>
                <div className="border-t border-cream-border pt-2 flex justify-between text-sm font-semibold text-charcoal">
                  <span>Estimated Total</span>
                  <span className="font-serif text-lg">{formatINR(cart.grandTotal)}</span>
                </div>
                <p className="text-[10px] text-charcoal-muted text-center pt-0.5">
                  Inclusive of all applicable Indian taxes (GST)
                </p>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full bg-botanical hover:bg-botanical-dark text-white py-3.5 px-4 rounded font-sans text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};