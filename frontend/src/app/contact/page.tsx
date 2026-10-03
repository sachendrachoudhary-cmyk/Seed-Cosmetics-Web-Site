"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "Order Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-botanical font-semibold">Concierge Support</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Get in Touch</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Have questions about our botanical seed formulations, your routine, or order status? Our concierge team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl border border-cream-border p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-serif text-xl text-charcoal">Seed Cosmetics HQ</h2>

          <div className="space-y-4 text-xs text-charcoal-light">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Facility & Formulation Lab</p>
                <p className="text-charcoal-muted">Sector 48, Sohna Road, Gurugram, Haryana 122018, India</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Customer Concierge</p>
                <a href="mailto:care@seedcosmetics.in" className="text-botanical hover:underline">
                  care@seedcosmetics.in
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Helpline & WhatsApp</p>
                <p className="text-charcoal-muted">+91 (0124) 492-7333</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-botanical shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Operating Hours</p>
                <p className="text-charcoal-muted">Monday – Saturday: 10:00 AM – 6:30 PM IST</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-cream-border">
            <p className="text-[11px] text-charcoal-muted">
              For rapid order tracking without contacting support, visit our{" "}
              <Link href="/track" className="text-botanical font-semibold hover:underline">
                Live Tracking Portal
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-border p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-charcoal">Message Received</h3>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                Thank you, {formData.name}. Our botanical skincare concierge will review your inquiry and respond within 24 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs uppercase tracking-widest font-bold text-botanical hover:underline pt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="font-serif text-xl text-charcoal mb-2">Send a Botanical Inquiry</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="radhika@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Order # (Optional)</label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. SC-1790600123"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none bg-white text-sm"
                >
                  <option value="Order Inquiry">Order Inquiry & Dispatch</option>
                  <option value="Product Recommendation">Product & Routine Recommendation</option>
                  <option value="Returns & Damage">Damaged Item or Return Request</option>
                  <option value="Partnership">Corporate / Wholesale Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with our cold-pressed seed formulations?"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream-border outline-none focus:border-botanical text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-botanical hover:bg-botanical-dark text-white font-sans text-xs uppercase tracking-widest font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}