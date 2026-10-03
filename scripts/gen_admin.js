const fs = require("fs");
const path = require("path");

const adminPageCode = `"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/utils/api";
import { formatINR, formatDate } from "@/utils/formatters";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Tag,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Filter,
  Truck,
  Edit2,
  Trash2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const { user, token, login, loading: authLoading } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders" | "inventory" | "coupons" | "seo"
  >("dashboard");

  // Auth local state for login form if not authenticated as admin
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data States
  const [loadingData, setLoadingData] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [seoReport, setSeoReport] = useState<any[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "",
    sku: "",
    category: "Skin",
    shortDescription: "",
    description: "",
    bulletPoints: ["100% Cold-Pressed Seed Extraction", "Zero Petroleum or Mineral Oils"],
    ingredients: "Cold-Pressed Rosehip Seed Oil, Bakuchiol (1.0%), Vitamin E Tocopherol",
    howToUse: "Warm 3–4 drops between palms and gently press onto cleansed, damp face and neck.",
    MRP: 999,
    sellingPrice: 849,
    stock: 50,
    thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    status: "published",
  });
  const [newBullet, setNewBullet] = useState("");

  // Stock Adjustment Modal State
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStockProd, setSelectedStockProd] = useState<any>(null);
  const [stockAdjustment, setStockAdjustment] = useState({
    newStock: 0,
    reason: "restock",
    note: "",
  });

  // Order Update Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderUpdate, setOrderUpdate] = useState({
    fulfillmentStatus: "processing",
    paymentStatus: "paid",
    courier: "Delhivery Express",
    trackingNumber: "",
    note: "",
  });

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 799,
    maxDiscountAmount: 300,
    expiresAt: "",
  });

  // Orders Search & Filter
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  const isAdmin = user && (user.role === "admin" || user.role === "product_admin" || user.role === "operations");

  // Load Dashboard Data
  const loadDashboardData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const res = await fetchApi<{ success: boolean; analytics: any }>("/admin/dashboard");
      if (res.success) {
        setAnalytics(res.analytics);
      }
    } catch (err: any) {
      console.error("Dashboard error:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Load Products
  const loadProducts = async () => {
    try {
      const res = await fetchApi<{ success: boolean; products: any[] }>("/products?limit=50");
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err: any) {
      console.error("Products error:", err);
    }
  };

  // Load Orders
  const loadOrders = async () => {
    try {
      const query = new URLSearchParams();
      if (orderSearch) query.set("search", orderSearch);
      if (orderStatusFilter !== "all") query.set("fulfillmentStatus", orderStatusFilter);
      const res = await fetchApi<{ success: boolean; orders: any[] }>("/admin/orders?" + query.toString());
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err: any) {
      console.error("Orders error:", err);
    }
  };

  // Load Inventory
  const loadInventory = async () => {
    try {
      const [invRes, logsRes] = await Promise.all([
        fetchApi<{ success: boolean; products: any[] }>("/admin/inventory"),
        fetchApi<{ success: boolean; logs: any[] }>("/admin/inventory/logs"),
      ]);
      if (invRes.success) setInventory(invRes.products);
      if (logsRes.success) setInventoryLogs(logsRes.logs);
    } catch (err: any) {
      console.error("Inventory error:", err);
    }
  };

  // Load Coupons
  const loadCoupons = async () => {
    try {
      const res = await fetchApi<{ success: boolean; coupons: any[] }>("/admin/coupons");
      if (res.success) setCoupons(res.coupons);
    } catch (err: any) {
      console.error("Coupons error:", err);
    }
  };

  // Load SEO
  const loadSeo = async () => {
    try {
      const res = await fetchApi<{ success: boolean; report: any[] }>("/admin/seo/report");
      if (res.success) setSeoReport(res.report);
    } catch (err: any) {
      console.error("SEO error:", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "dashboard") loadDashboardData();
      else if (activeTab === "products") loadProducts();
      else if (activeTab === "orders") loadOrders();
      else if (activeTab === "inventory") loadInventory();
      else if (activeTab === "coupons") loadCoupons();
      else if (activeTab === "seo") loadSeo();
    }
  }, [isAdmin, activeTab]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      setLoginError(err.message || "Invalid administrative credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Create Product Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      const res = await fetchApi<{ success: boolean; message: string }>("/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...newProd,
          ingredients: newProd.ingredients.split(",").map((s) => s.trim()),
        }),
      });
      if (res.success) {
        setActionSuccess("Product created successfully with verified SEO scoring!");
        setIsProductModalOpen(false);
        loadProducts();
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to create product.");
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(\`Are you sure you want to delete "\${name}"? This action is permanent.\`)) return;
    try {
      const res = await fetchApi<{ success: boolean }>("/admin/products/" + id, {
        method: "DELETE",
      });
      if (res.success) {
        setActionSuccess(\`Product "\${name}" removed.\`);
        loadProducts();
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to delete product.");
    }
  };

  // Adjust Stock Handler
  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockProd) return;
    try {
      const res = await fetchApi<{ success: boolean; message: string }>("/admin/inventory/adjust", {
        method: "POST",
        body: JSON.stringify({
          productId: selectedStockProd._id,
          sku: selectedStockProd.sku,
          newStock: stockAdjustment.newStock,
          reason: stockAdjustment.reason,
          note: stockAdjustment.note,
        }),
      });
      if (res.success) {
        setActionSuccess(res.message);
        setIsStockModalOpen(false);
        loadInventory();
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to adjust stock.");
    }
  };

  // Update Order Status Handler
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await fetchApi<{ success: boolean; message: string }>(
        \`/admin/orders/\${selectedOrder.orderNumber}/status\`,
        {
          method: "PUT",
          body: JSON.stringify(orderUpdate),
        }
      );
      if (res.success) {
        setActionSuccess(\`Order \${selectedOrder.orderNumber} updated successfully.\`);
        setSelectedOrder(null);
        loadOrders();
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to update order.");
    }
  };

  // Toggle Coupon Status
  const handleToggleCoupon = async (id: string) => {
    try {
      const res = await fetchApi<{ success: boolean; message: string }>(\`/admin/coupons/\${id}/toggle\`, {
        method: "PATCH",
      });
      if (res.success) {
        setActionSuccess(res.message);
        loadCoupons();
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to toggle coupon.");
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetchApi<{ success: boolean; message: string }>("/admin/coupons", {
        method: "POST",
        body: JSON.stringify({
          ...newCoupon,
          expiresAt: newCoupon.expiresAt ? new Date(newCoupon.expiresAt) : undefined,
        }),
      });
      if (res.success) {
        setActionSuccess(res.message);
        setIsCouponModalOpen(false);
        loadCoupons();
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to create coupon.");
    }
  };

  // Unauthenticated / Non-Admin Gate
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-botanical animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-cream-border shadow-luxury space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-botanical/10 rounded-full flex items-center justify-center mx-auto text-botanical">
              <Lock className="w-6 h-6" />
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Security Gate</p>
            <h1 className="font-serif text-2xl text-charcoal">Commerce Control Centre</h1>
            <p className="text-xs text-charcoal-muted">Sign in with administrative privileges to manage Seed Cosmetics.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@seedcosmetics.in"
                className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border text-sm focus:border-botanical focus:ring-1 focus:ring-botanical outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border text-sm focus:border-botanical focus:ring-1 focus:ring-botanical outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-botanical hover:bg-botanical-dark text-white font-sans text-xs uppercase tracking-widest font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Authenticate as Admin"}
            </button>
          </form>

          {/* Quick Demo Credentials Fill */}
          <div className="p-4 bg-cream/70 rounded-xl border border-cream-border text-xs space-y-2">
            <p className="font-semibold text-charcoal">Seed Cosmetics Master Admin:</p>
            <div className="flex justify-between items-center text-charcoal-light">
              <span>admin@seedcosmetics.in</span>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("admin@seedcosmetics.in");
                  setLoginPassword("SeedAdmin@2026!");
                }}
                className="text-botanical font-semibold hover:underline"
              >
                Auto-fill credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/30">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-cream-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-xl tracking-[0.18em] uppercase text-charcoal">
              Seed Cosmetics
            </Link>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-botanical text-white px-2 py-0.5 rounded">
              Control Centre
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-charcoal-muted">
              Logged in as <strong className="text-charcoal">{user.name}</strong> ({user.role})
            </span>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 text-botanical font-semibold hover:underline"
            >
              View Storefront <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Alerts */}
        {actionSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" /> {actionSuccess}
            </span>
            <button onClick={() => setActionSuccess(null)} className="text-green-600 hover:text-green-800 font-bold">
              &times;
            </button>
          </div>
        )}
        {actionError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" /> {actionError}
            </span>
            <button onClick={() => setActionError(null)} className="text-red-600 hover:text-red-800 font-bold">
              &times;
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-1 space-y-1">
            <nav className="bg-white rounded-2xl border border-cream-border p-2 space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "products", label: "Products", icon: Package },
                { id: "orders", label: "Orders", icon: ShoppingBag },
                { id: "inventory", label: "Inventory", icon: Boxes },
                { id: "coupons", label: "Coupons", icon: Tag },
                { id: "seo", label: "SEO & GEO Center", icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={\`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors \${
                      isActive
                        ? "bg-botanical text-white shadow-sm"
                        : "text-charcoal-light hover:bg-cream/60 hover:text-charcoal"
                    }\`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick SEO Badge */}
            <div className="bg-white rounded-2xl border border-cream-border p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal">SEO Quality Gate</span>
                <ShieldCheck className="w-4 h-4 text-botanical" />
              </div>
              <p className="text-[11px] text-charcoal-muted leading-relaxed">
                Automated Schema.org JSON-LD generation and AI bot discoverability active across all product routes.
              </p>
              <div className="pt-1 flex gap-2 text-[10px]">
                <a href="/robots.txt" target="_blank" className="text-botanical hover:underline">
                  robots.txt &rarr;
                </a>
                <a href="/sitemap.xml" target="_blank" className="text-botanical hover:underline">
                  sitemap.xml &rarr;
                </a>
              </div>
            </div>
          </aside>

          {/* Tab Content Workspace */}
          <main className="lg:col-span-4 space-y-6">
            {/* ==================== 1. DASHBOARD TAB ==================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal">Store Performance</h2>
                    <p className="text-xs text-charcoal-muted">High-level financial and fulfillment telemetry.</p>
                  </div>
                  <button
                    onClick={loadDashboardData}
                    className="p-2 border border-cream-border rounded-lg text-charcoal-muted hover:text-botanical transition-colors"
                  >
                    <RefreshCw className={\`w-4 h-4 \${loadingData ? "animate-spin" : ""}\`} />
                  </button>
                </div>

                {analytics && (
                  <>
                    {/* Primary KPI Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm space-y-1">
                        <span className="text-[11px] uppercase tracking-wider text-charcoal-muted font-semibold">
                          Total Revenue
                        </span>
                        <p className="font-serif text-2xl text-charcoal">{formatINR(analytics.totalRevenue)}</p>
                        <span className="text-[10px] text-botanical font-medium">Verified Paid Volume</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm space-y-1">
                        <span className="text-[11px] uppercase tracking-wider text-charcoal-muted font-semibold">
                          Total Orders
                        </span>
                        <p className="font-serif text-2xl text-charcoal">{analytics.totalOrders}</p>
                        <span className="text-[10px] text-charcoal-light">Lifetime Transactions</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm space-y-1">
                        <span className="text-[11px] uppercase tracking-wider text-charcoal-muted font-semibold">
                          Average Order (AOV)
                        </span>
                        <p className="font-serif text-2xl text-charcoal">{formatINR(analytics.aov)}</p>
                        <span className="text-[10px] text-charcoal-light">Per Paid Basket</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm space-y-1">
                        <span className="text-[11px] uppercase tracking-wider text-charcoal-muted font-semibold">
                          Units Dispatched
                        </span>
                        <p className="font-serif text-2xl text-charcoal">{analytics.unitsSold}</p>
                        <span className="text-[10px] text-charcoal-light">Bottles & Jars</span>
                      </div>
                    </div>

                    {/* Today & Fulfillment Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm space-y-3">
                        <h3 className="font-serif text-base text-charcoal">Today\'s Metrics</h3>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-charcoal-light">Today\'s Revenue:</span>
                            <span className="font-bold text-charcoal">{formatINR(analytics.today?.revenue || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-charcoal-light">Today\'s Orders:</span>
                            <span className="font-bold text-charcoal">{analytics.today?.orders || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm space-y-3">
                        <h3 className="font-serif text-base text-charcoal">Fulfillment Pipeline</h3>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-charcoal-light">Processing Orders:</span>
                            <span className="font-bold text-amber-600">{analytics.today?.processingOrders || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-charcoal-light">In Transit (Shipped):</span>
                            <span className="font-bold text-botanical">{analytics.today?.shippedOrders || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm space-y-3">
                        <h3 className="font-serif text-base text-charcoal">SEO Health State</h3>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-charcoal-light">Ready (100%):</span>
                            <span className="font-bold text-green-600">{analytics.seoHealth?.ready || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-charcoal-light">Needs Attention:</span>
                            <span className="font-bold text-amber-600">{analytics.seoHealth?.needsAttention || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Low Stock Alerts */}
                    {analytics.lowStockProducts?.length > 0 && (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Low Inventory Warning ({analytics.lowStockProducts.length} Products &le; 5 units)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {analytics.lowStockProducts.map((p: any) => (
                            <div
                              key={p._id}
                              className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs"
                            >
                              <div className="truncate pr-2">
                                <p className="font-medium text-charcoal truncate">{p.name}</p>
                                <p className="text-[10px] text-charcoal-muted">SKU: {p.sku}</p>
                              </div>
                              <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                {p.stock} left
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ==================== 2. PRODUCTS TAB ==================== */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal">Product Catalogue</h2>
                    <p className="text-xs text-charcoal-muted">Database-driven botanical skincare formulations.</p>
                  </div>
                  <button
                    onClick={() => setIsProductModalOpen(true)}
                    className="bg-botanical hover:bg-botanical-dark text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Formulation
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-cream-border overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cream/40 border-b border-cream-border text-charcoal-muted uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Pricing</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-border">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-cream/20 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={p.thumbnail || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=100&q=80"}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border border-cream-border"
                            />
                            <div>
                              <p className="font-semibold text-charcoal">{p.name}</p>
                              <p className="text-[10px] text-charcoal-muted">{p.category?.name || p.category}</p>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-charcoal-light">{p.sku}</td>
                          <td className="p-4">
                            <span className="font-bold text-charcoal">{formatINR(p.sellingPrice)}</span>
                            {p.MRP > p.sellingPrice && (
                              <span className="text-[10px] text-charcoal-muted line-through ml-1.5">
                                {formatINR(p.MRP)}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={\`px-2 py-0.5 rounded text-[10px] font-bold \${
                                p.stock > 10
                                  ? "bg-green-100 text-green-800"
                                  : p.stock > 0
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }\`}
                            >
                              {p.stock} in stock
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={\`px-2 py-0.5 rounded text-[10px] uppercase font-semibold \${
                                p.status === "published"
                                  ? "bg-botanical/10 text-botanical"
                                  : "bg-gray-100 text-gray-600"
                              }\`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <Link
                              href={\`/products/\${p.slug}\`}
                              target="_blank"
                              className="text-botanical hover:underline font-semibold"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(p._id, p.name)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== 3. ORDERS TAB ==================== */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal">Customer Orders</h2>
                    <p className="text-xs text-charcoal-muted">Razorpay payments & courier dispatch management.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search Order # or Email..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && loadOrders()}
                      className="px-3 py-2 rounded-xl border border-cream-border text-xs w-full sm:w-48 outline-none focus:border-botanical"
                    />
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => {
                        setOrderStatusFilter(e.target.value);
                      }}
                      className="px-3 py-2 rounded-xl border border-cream-border text-xs outline-none bg-white text-charcoal"
                    >
                      <option value="all">All Statuses</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-cream-border overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cream/40 border-b border-cream-border text-charcoal-muted uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Fulfillment</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-border">
                      {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-cream/20 transition-colors">
                          <td className="p-4 font-mono font-bold text-charcoal">{o.orderNumber}</td>
                          <td className="p-4 text-charcoal-light">{formatDate(o.createdAt)}</td>
                          <td className="p-4">
                            <p className="font-semibold text-charcoal">{o.customerName}</p>
                            <p className="text-[10px] text-charcoal-muted">{o.customerEmail}</p>
                          </td>
                          <td className="p-4 font-bold text-charcoal">{formatINR(o.pricing?.grandTotal || 0)}</td>
                          <td className="p-4">
                            <span
                              className={\`px-2 py-0.5 rounded text-[10px] font-bold uppercase \${
                                o.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }\`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={\`px-2 py-0.5 rounded text-[10px] font-bold uppercase \${
                                o.fulfillmentStatus === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : o.fulfillmentStatus === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : o.fulfillmentStatus === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }\`}
                            >
                              {o.fulfillmentStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(o);
                                setOrderUpdate({
                                  fulfillmentStatus: o.fulfillmentStatus,
                                  paymentStatus: o.paymentStatus,
                                  courier: o.courier || "Delhivery Express",
                                  trackingNumber: o.trackingNumber || "",
                                  note: "",
                                });
                              }}
                              className="text-botanical hover:underline font-semibold"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div className="p-8 text-center text-charcoal-muted text-xs">
                      No orders match your filter criteria.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== 4. INVENTORY TAB ==================== */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal">Inventory & Stock Control</h2>
                  <p className="text-xs text-charcoal-muted">
                    SKU level stock tracking with full audit logging and cancellation restoration.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-cream-border overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cream/40 border-b border-cream-border text-charcoal-muted uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Current Stock</th>
                        <th className="p-4">Threshold</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Adjust</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-border">
                      {inventory.map((inv) => (
                        <tr key={inv._id} className="hover:bg-cream/20 transition-colors">
                          <td className="p-4 font-mono font-bold text-charcoal">{inv.sku}</td>
                          <td className="p-4 font-medium text-charcoal">{inv.name}</td>
                          <td className="p-4 font-bold text-charcoal">{inv.stock} units</td>
                          <td className="p-4 text-charcoal-muted">{inv.lowStockThreshold || 5} units</td>
                          <td className="p-4">
                            <span
                              className={\`px-2 py-0.5 rounded text-[10px] font-bold \${
                                inv.stock <= 5
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }\`}
                            >
                              {inv.stock <= 5 ? "LOW STOCK" : "OPTIMAL"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedStockProd(inv);
                                setStockAdjustment({
                                  newStock: inv.stock,
                                  reason: "restock",
                                  note: "Manual replenishment via admin",
                                });
                                setIsStockModalOpen(true);
                              }}
                              className="text-botanical hover:underline font-semibold"
                            >
                              Adjust Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Audit Logs */}
                <div className="bg-white rounded-2xl border border-cream-border p-5 space-y-3">
                  <h3 className="font-serif text-base text-charcoal">Recent Stock Movement Logs</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-cream-border/60">
                    {inventoryLogs.slice(0, 15).map((log) => (
                      <div key={log._id} className="pt-2 text-xs flex items-center justify-between text-charcoal-light">
                        <div>
                          <span className="font-mono font-bold text-charcoal">{log.sku}</span> &bull; Reason:{" "}
                          <span className="capitalize font-semibold">{log.reason}</span>
                          <p className="text-[10px] text-charcoal-muted">By: {log.actor} | {formatDate(log.createdAt)}</p>
                        </div>
                        <span
                          className={\`font-mono font-bold \${
                            log.change > 0 ? "text-green-600" : "text-red-600"
                          }\`}
                        >
                          {log.change > 0 ? \`+\${log.change}\` : log.change} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 5. COUPONS TAB ==================== */}
            {activeTab === "coupons" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal">Promotional Coupons</h2>
                    <p className="text-xs text-charcoal-muted">Server-authoritative discount validation.</p>
                  </div>
                  <button
                    onClick={() => setIsCouponModalOpen(true)}
                    className="bg-botanical hover:bg-botanical-dark text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Create Coupon
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {coupons.map((c) => (
                    <div
                      key={c._id}
                      className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-base text-botanical">{c.code}</span>
                          <span
                            className={\`px-2 py-0.5 rounded text-[10px] font-bold uppercase \${
                              c.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                            }\`}
                          >
                            {c.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal-light">
                          {c.discountType === "percentage" ? \`\${c.discountValue}% OFF\` : \`\${formatINR(c.discountValue)} FLAT OFF\`}
                        </p>
                        <p className="text-[11px] text-charcoal-muted">
                          Min spend: {formatINR(c.minOrderValue || 0)} {c.maxDiscountAmount ? \`| Cap: \${formatINR(c.maxDiscountAmount)}\` : ""}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-cream-border flex justify-between items-center text-xs">
                        <span className="text-[11px] text-charcoal-muted">Used: {c.usedCount || 0} times</span>
                        <button
                          onClick={() => handleToggleCoupon(c._id)}
                          className="text-botanical font-semibold hover:underline"
                        >
                          {c.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== 6. SEO & GEO CENTER TAB ==================== */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal">SEO & AI Search (GEO) Center</h2>
                  <p className="text-xs text-charcoal-muted">
                    Automated Schema.org Product, Offer, Breadcrumb microdata and AI search agent verification.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-cream-border p-5 space-y-4">
                  <h3 className="font-serif text-base text-charcoal">Live Product SEO Scorecard</h3>
                  <div className="space-y-3">
                    {seoReport.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-cream-border/80 bg-cream/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-charcoal text-sm">{item.name}</span>
                            <span
                              className={\`px-2 py-0.5 rounded text-[10px] font-bold \${
                                item.seoStatus === "READY"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }\`}
                            >
                              {item.seoStatus}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-charcoal-muted">/products/{item.slug}</p>
                          {item.issues?.length > 0 && (
                            <ul className="text-[11px] text-amber-700 list-disc list-inside">
                              {item.issues.map((iss: string, idx: number) => (
                                <li key={idx}>{iss}</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-xs text-charcoal-muted">SEO Quality Score</span>
                            <p className="font-serif text-xl font-bold text-botanical">{item.score}/100</p>
                          </div>
                          <Link
                            href={\`/products/\${item.slug}\`}
                            target="_blank"
                            className="p-2 bg-white rounded-lg border border-cream-border hover:bg-cream/40 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-botanical" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ==================== ADD PRODUCT MODAL ==================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-cream-border max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-cream-border pb-4">
              <div>
                <h3 className="font-serif text-xl text-charcoal">Add New Botanical Formulation</h3>
                <p className="text-xs text-charcoal-muted">Formulated with pure cold-pressed seed oils.</p>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="text-charcoal-muted hover:text-charcoal text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Bakuchiol Rosehip Elixir"
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value.toUpperCase() })}
                    placeholder="e.g. SEED-OIL-007"
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none bg-white"
                  >
                    <option value="Skin">Skin</option>
                    <option value="Hair">Hair</option>
                    <option value="Body">Body</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProd.MRP}
                    onChange={(e) => setNewProd({ ...newProd, MRP: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProd.sellingPrice}
                    onChange={(e) => setNewProd({ ...newProd, sellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Short Description (SEO Snippet)</label>
                <input
                  type="text"
                  required
                  value={newProd.shortDescription}
                  onChange={(e) => setNewProd({ ...newProd, shortDescription: e.target.value })}
                  placeholder="Pure cold-pressed botanical nectar to rejuvenate skin barrier."
                  className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical"
                />
              </div>

              {/* Repeatable Bullet Points Builder */}
              <div>
                <label className="block font-semibold text-charcoal mb-1">
                  Key Benefits / Repeatable Bullet Points (High-Conversion SEO)
                </label>
                <div className="space-y-2">
                  {newProd.bulletPoints.map((bp, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-botanical font-bold">&bull;</span>
                      <span className="flex-1 bg-cream/40 px-3 py-1.5 rounded border border-cream-border">{bp}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewProd({
                            ...newProd,
                            bulletPoints: newProd.bulletPoints.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add key benefit bullet..."
                      value={newBullet}
                      onChange={(e) => setNewBullet(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded border border-cream-border outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newBullet.trim()) {
                          setNewProd({
                            ...newProd,
                            bulletPoints: [...newProd.bulletPoints, newBullet.trim()],
                          });
                          setNewBullet("");
                        }
                      }}
                      className="bg-cream-border hover:bg-cream-border/80 px-3 py-1.5 rounded font-semibold text-charcoal"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Ingredients (comma-separated)</label>
                <textarea
                  rows={2}
                  value={newProd.ingredients}
                  onChange={(e) => setNewProd({ ...newProd, ingredients: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newProd.thumbnail}
                    onChange={(e) => setNewProd({ ...newProd, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-cream-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-cream-border rounded-lg text-charcoal-muted hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-botanical hover:bg-botanical-dark text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Save Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== STOCK ADJUSTMENT MODAL ==================== */}
      {isStockModalOpen && selectedStockProd && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-cream-border max-w-md w-full p-6 space-y-5">
            <div>
              <h3 className="font-serif text-lg text-charcoal">Adjust SKU Inventory</h3>
              <p className="text-xs text-charcoal-muted">
                {selectedStockProd.name} ({selectedStockProd.sku})
              </p>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal mb-1">New Total Units in Stock</label>
                <input
                  type="number"
                  required
                  value={stockAdjustment.newStock}
                  onChange={(e) =>
                    setStockAdjustment({ ...stockAdjustment, newStock: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical text-base font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Audit Reason</label>
                <select
                  value={stockAdjustment.reason}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none bg-white"
                >
                  <option value="restock">New Stock Inward / Batch Arrival</option>
                  <option value="cycle_count">Warehouse Physical Audit (Cycle Count)</option>
                  <option value="damage">Damaged in Transit / Warehouse Breakage</option>
                  <option value="write_off">Expired / Formulation Testing Batch</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Administrative Note</label>
                <input
                  type="text"
                  placeholder="e.g. Batch #2026-B arrived from laboratory"
                  value={stockAdjustment.note}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, note: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none focus:border-botanical"
                />
              </div>

              <div className="pt-3 border-t border-cream-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 border border-cream-border rounded-lg text-charcoal-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-botanical hover:bg-botanical-dark text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Update & Log Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MANAGE ORDER MODAL ==================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-cream-border max-w-lg w-full p-6 space-y-5">
            <div>
              <h3 className="font-serif text-lg text-charcoal">Manage Order: {selectedOrder.orderNumber}</h3>
              <p className="text-xs text-charcoal-muted">
                {selectedOrder.customerName} &bull; {formatINR(selectedOrder.pricing?.grandTotal || 0)}
              </p>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Fulfillment Status</label>
                  <select
                    value={orderUpdate.fulfillmentStatus}
                    onChange={(e) =>
                      setOrderUpdate({ ...orderUpdate, fulfillmentStatus: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none bg-white font-semibold"
                  >
                    <option value="created">Created</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled (Auto-Restore Stock)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Payment Status</label>
                  <select
                    value={orderUpdate.paymentStatus}
                    onChange={(e) =>
                      setOrderUpdate({ ...orderUpdate, paymentStatus: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none bg-white font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={orderUpdate.courier}
                    onChange={(e) => setOrderUpdate({ ...orderUpdate, courier: e.target.value })}
                    placeholder="Delhivery / BlueDart"
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">AWB Tracking Number</label>
                  <input
                    type="text"
                    value={orderUpdate.trackingNumber}
                    onChange={(e) =>
                      setOrderUpdate({ ...orderUpdate, trackingNumber: e.target.value })
                    }
                    placeholder="e.g. DEL-109283921"
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Audit Status Note</label>
                <input
                  type="text"
                  placeholder="e.g. Picked up by logistics agent"
                  value={orderUpdate.note}
                  onChange={(e) => setOrderUpdate({ ...orderUpdate, note: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none"
                />
              </div>

              <div className="pt-3 border-t border-cream-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-cream-border rounded-lg text-charcoal-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-botanical hover:bg-botanical-dark text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE COUPON MODAL ==================== */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-cream-border max-w-md w-full p-6 space-y-5">
            <div>
              <h3 className="font-serif text-lg text-charcoal">Create Promotional Coupon</h3>
              <p className="text-xs text-charcoal-muted">Discounts validated authoritatively on server.</p>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BOTANICAL20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discountType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Cash (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderValue}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.maxDiscountAmount}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, maxDiscountAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-cream-border outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-cream-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-cream-border rounded-lg text-charcoal-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-botanical hover:bg-botanical-dark text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;

const targetPath = path.join(__dirname, "..", "frontend", "src", "app", "admin", "page.tsx");
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, adminPageCode.trim(), "utf8");
console.log("Admin Control Centre generated at:", targetPath);
