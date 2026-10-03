"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Truck, RefreshCw } from "lucide-react";
import { fetchApi } from "@/utils/api";
import { formatINR, formatDate } from "@/utils/formatters";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderNumber) return;

    async function loadOrder() {
      try {
        const res = await fetchApi<any>("/orders/" + orderNumber);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error("Failed to load confirmed order:", err);
      }
    }

    loadOrder();
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-botanical-soft text-botanical rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Payment Verified • Order Confirmed</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Thank You for Your Order!</h1>
        <p className="text-sm text-charcoal-muted max-w-md mx-auto">
          We have received your payment. Our botanical laboratory in Gurugram is preparing your fresh formulation batch.
        </p>
      </div>

      {order && (
        <div className="bg-white rounded-2xl border border-cream-border p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border pb-4">
            <div>
              <p className="text-xs text-charcoal-muted">Order Reference</p>
              <p className="font-mono text-base font-bold text-charcoal">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal-muted">Date</p>
              <p className="text-xs font-semibold text-charcoal">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal-muted">Payment Status</p>
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal">Ordered Formulations</h3>
            <div className="divide-y divide-cream-border/60">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-charcoal">{item.name}</p>
                    {item.variantTitle && <p className="text-charcoal-muted">{item.variantTitle}</p>}
                    <p className="text-charcoal-muted">{"Qty: " + item.quantity}</p>
                  </div>
                  <span className="font-semibold text-charcoal">{formatINR(item.lineTotal)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-cream-border pt-4 text-xs space-y-1">
            <h4 className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">Shipping Destination:</h4>
            <p className="text-charcoal-light font-medium">{order.shippingAddress?.fullName + " (" + order.shippingAddress?.phone + ")"}</p>
            <p className="text-charcoal-muted">{order.shippingAddress?.addressLine1 + ", " + (order.shippingAddress?.addressLine2 || "")}</p>
            <p className="text-charcoal-muted">{order.shippingAddress?.city + ", " + order.shippingAddress?.state + " - " + order.shippingAddress?.pincode}</p>
          </div>

          <div className="border-t border-cream-border pt-4 space-y-1.5 text-xs text-charcoal-light">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(order.pricing?.subtotal)}</span>
            </div>
            {order.pricing?.couponDiscount > 0 && (
              <div className="flex justify-between text-botanical font-medium">
                <span>Coupon ({order.pricing?.couponCode})</span>
                <span>-{formatINR(order.pricing?.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Shipping</span>
              <span>{order.pricing?.shippingFee === 0 ? "Complimentary (FREE)" : formatINR(order.pricing?.shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-cream-border pt-2 text-sm font-serif font-bold text-charcoal">
              <span>Authoritative Grand Total</span>
              <span>{formatINR(order.pricing?.grandTotal)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href={"/track" + (order ? "?orderNumber=" + order.orderNumber : "")}
          className="w-full sm:w-auto bg-botanical hover:bg-botanical-dark text-white px-8 py-3.5 rounded font-sans text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Truck className="w-4 h-4" /> Track Shipment
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto border border-cream-border hover:bg-cream text-charcoal px-8 py-3.5 rounded font-sans text-xs uppercase tracking-widest font-semibold text-center transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-botanical animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}