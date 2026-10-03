"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Truck, RefreshCw } from "lucide-react";
import { fetchApi } from "@/utils/api";
import { formatDate } from "@/utils/formatters";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const track = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setErrorMsg("");
    setOrder(null);

    try {
      const res = await fetchApi<any>("/orders/track", {
        method: "POST",
        body: JSON.stringify({
          orderNumber: num.trim(),
          phoneOrEmail: phoneOrEmail.trim(),
        }),
      });

      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "No order found matching the provided details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder) {
      track(initialOrder);
    }
  }, [initialOrder]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track(orderNumber);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-10">
      <div className="text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Real-Time Dispatch</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Track Your Shipment</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
          Enter your Seed Cosmetics Order Number (e.g. SC-2026-XXXX) to inspect fulfillment progress and tracking milestones.
        </p>
      </div>

      <form onSubmit={handleTrackSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-cream-border shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Order Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. SC-1002"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              className="w-full text-xs p-3 bg-cream border border-cream-border rounded-lg uppercase font-mono focus:outline-none focus:border-botanical"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Phone or Email (Optional)</label>
            <input
              type="text"
              placeholder="Associated email or mobile"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full text-xs p-3 bg-cream border border-cream-border rounded-lg focus:outline-none focus:border-botanical"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-botanical hover:bg-botanical-dark text-white py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? "Locating Shipment..." : "Check Status"} <Search className="w-4 h-4" />
        </button>

        {errorMsg && <p className="text-xs text-red-600 text-center">{errorMsg}</p>}
      </form>

      {order && (
        <div className="bg-white rounded-2xl border border-cream-border p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border pb-4">
            <div>
              <p className="text-xs text-charcoal-muted">Order Number</p>
              <p className="font-mono text-base font-bold text-charcoal">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal-muted">Current Fulfillment</p>
              <span className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-botanical-soft text-botanical-dark">
                {order.fulfillmentStatus}
              </span>
            </div>
            {order.trackingNumber && (
              <div>
                <p className="text-xs text-charcoal-muted">Courier & Tracking ID</p>
                <p className="font-mono text-xs font-bold text-charcoal">
                  {(order.courier || "BlueDart") + " : " + order.trackingNumber}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal">Tracking Timeline</h3>
            <div className="border-l-2 border-botanical/30 ml-3 space-y-6 py-2">
              {order.timeline?.map((step: any, i: number) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-botanical border-2 border-white shadow-sm" />
                  <p className="text-xs font-bold text-charcoal">{step.status}</p>
                  <p className="text-xs text-charcoal-muted">{step.note}</p>
                  <span className="text-[10px] text-charcoal-muted font-mono">{formatDate(step.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-botanical animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}