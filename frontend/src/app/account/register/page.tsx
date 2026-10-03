"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await register(name, email, password, phone);
      router.push("/account");
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Join Our Circle</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Create an Account</h1>
        <p className="text-xs text-charcoal-muted">Enjoy personalized skincare recommendations and order tracking.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-cream-border shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full text-xs p-3 bg-cream border border-cream-border rounded-lg focus:outline-none focus:border-botanical"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              className="w-full text-xs p-3 bg-cream border border-cream-border rounded-lg focus:outline-none focus:border-botanical"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full text-xs p-3 bg-cream border border-cream-border rounded-lg focus:outline-none focus:border-botanical font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Password (min. 6 characters)</label>
            <input
              type="password"
              required
              minLength={6}
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
            {loading ? "Registering..." : "Create Account"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-charcoal-muted">
            Already have an account?{" "}
            <Link href="/account/login" className="text-botanical font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}