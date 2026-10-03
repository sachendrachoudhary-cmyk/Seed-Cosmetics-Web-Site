"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserIcon, Package, MapPin, LogOut, ChevronRight, Truck, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/utils/api";
import { formatINR, formatDate } from "@/utils/formatters";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");

  // New address state
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
      return;
    }

    async function loadOrders() {
      try {
        const res = await fetchApi("/orders/me");
        if (res.success && res.orders) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error("Failed to load user orders:", err);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="py-24 text-center text-xs text-charcoal-muted uppercase tracking-widest animate-pulse">
        Authenticating session...
      </div>
    );
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/auth/addresses", {
        method: "POST",
        body: JSON.stringify({ fullName, phone, addressLine1, city, state, pincode }),
      });
      await refreshUser();
      setShowAddAddr(false);
      setFullName("");
      setPhone("");
      setAddressLine1("");
      setCity("");
      setState("");
      setPincode("");
    } catch (err: any) {
      alert(err.message || "Failed to add address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await fetchApi("/auth/addresses/" + id, { method: "DELETE" });
      await refreshUser();
    } catch (err: any) {
      alert(err.message || "Failed to delete address");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-border">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">My Account</h1>
          <p className="text-xs text-charcoal-muted mt-1">Welcome back, {user.name} ({user.email})</p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-charcoal-muted hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-cream-border p-3 space-y-1 shadow-sm">
          <button
            onClick={() => setActiveTab("orders")}
            className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left " + (activeTab === "orders" ? "bg-botanical text-white" : "text-charcoal hover:bg-cream")}
          >
            <Package className="w-4 h-4" /> Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left " + (activeTab === "addresses" ? "bg-botanical text-white" : "text-charcoal hover:bg-cream")}
          >
            <MapPin className="w-4 h-4" /> Saved Addresses ({user.addresses?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left " + (activeTab === "profile" ? "bg-botanical text-white" : "text-charcoal hover:bg-cream")}
          >
            <UserIcon className="w-4 h-4" /> Profile Details
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-cream-border p-6 sm:p-8 shadow-sm">
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-charcoal">Your Order History</h2>

              {orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-xs text-charcoal-muted">You have not placed any orders yet.</p>
                  <Link href="/shop" className="text-xs text-botanical font-semibold underline inline-block">
                    Explore Botanical Formulations
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o._id} className="p-5 rounded-xl border border-cream-border space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-border/60 pb-3">
                        <div>
                          <p className="text-xs text-charcoal-muted">Order ID</p>
                          <p className="font-mono text-xs font-bold text-charcoal">{o.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-charcoal-muted">Placed On</p>
                          <p className="text-xs font-semibold text-charcoal">{formatDate(o.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-charcoal-muted">Total</p>
                          <p className="font-serif text-sm font-bold text-charcoal">{formatINR(o.pricing?.grandTotal)}</p>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-botanical-soft text-botanical-dark">
                          {o.fulfillmentStatus}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {o.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-charcoal">{item.name} &bull; Qty {item.quantity}</span>
                            <span className="font-medium text-charcoal">{formatINR(item.lineTotal)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Link
                          href={"/track?orderNumber=" + o.orderNumber}
                          className="inline-flex items-center gap-1.5 text-xs text-botanical font-semibold hover:underline"
                        >
                          <Truck className="w-3.5 h-3.5" /> Track Shipment
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-charcoal">Saved Delivery Addresses</h2>
                <button
                  onClick={() => setShowAddAddr(!showAddAddr)}
                  className="bg-cream hover:bg-botanical hover:text-white text-charcoal text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-lg border border-cream-border flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              </div>

              {showAddAddr && (
                <form onSubmit={handleAddAddress} className="p-4 bg-cream/40 rounded-xl border border-cream-border space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="text-xs p-2.5 bg-white border border-cream-border rounded"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="text-xs p-2.5 bg-white border border-cream-border rounded"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Address Line 1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-cream-border rounded"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="text-xs p-2.5 bg-white border border-cream-border rounded"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="text-xs p-2.5 bg-white border border-cream-border rounded"
                    />
                    <input
                      type="text"
                      required
                      placeholder="PIN Code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="text-xs p-2.5 bg-white border border-cream-border rounded font-mono"
                    />
                  </div>
                  <button type="submit" className="bg-botanical text-white px-5 py-2 rounded text-xs uppercase font-semibold">
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses?.map((addr: any) => (
                  <div key={addr._id} className="p-4 rounded-xl border border-cream-border space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-semibold text-charcoal">{addr.fullName}</p>
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="text-charcoal-muted hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-charcoal-muted">{addr.addressLine1}</p>
                    <p className="text-xs text-charcoal-muted">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-[11px] font-mono text-charcoal-muted">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4 max-w-md">
              <h2 className="font-serif text-xl text-charcoal">Account Details</h2>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-charcoal-muted block">Full Name:</span>
                  <span className="font-medium text-charcoal text-sm">{user.name}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Email Address:</span>
                  <span className="font-medium text-charcoal text-sm">{user.email}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Account Type:</span>
                  <span className="font-medium text-botanical text-xs uppercase">{user.role}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}