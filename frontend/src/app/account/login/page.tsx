"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await login(email, password);
      router.push("/account");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Welcome Back</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Account Sign In</h1>
        <p className="text-xs text-charcoal-muted">Sign in to access your orders and saved shipping addresses.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-cream-border shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-xs p-3 bg-cream border border-cream-border rounded-lg focus:outline-none focus:border-botanical"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 bg-cream border border-cream-border rounded-lg focus:outline-none focus:border-botanical"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-botanical hover:bg-botanical-dark text-white py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Accounts Quick-Fill */}
        <div className="border-t border-cream-border pt-4 space-y-2">
          <p className="text-[11px] text-charcoal-muted uppercase tracking-wider font-semibold">Quick Demo Login:</p>
          <div className="flex gap-2">
            <button
              onClick={() => fillDemo("admin@seedcosmetics.in", "SeedAdmin@2026!")}
              className="w-1/2 py-2 px-2 bg-cream hover:bg-botanical-soft text-[11px] rounded border border-cream-border text-charcoal font-medium text-center"
            >
              👑 Store Admin
            </button>
            <button
              onClick={() => fillDemo("priya.sharma@example.com", "Customer@2026!")}
              className="w-1/2 py-2 px-2 bg-cream hover:bg-botanical-soft text-[11px] rounded border border-cream-border text-charcoal font-medium text-center"
            >
              🌿 Customer
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-charcoal-muted">
            Do not have an account yet?{" "}
            <Link href="/account/register" className="text-botanical font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}