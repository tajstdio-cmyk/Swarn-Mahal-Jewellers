"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Send,
  CheckCircle2,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

function ContactContent() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || "";
  const { store, refreshStore, showToast } = useStore();

  const [form, setForm] = useState({
    type: initialProduct ? "product_inquiry" : "appointment",
    name: "",
    phone: "",
    email: "",
    preferredDate: "",
    productName: initialProduct,
    message: initialProduct
      ? `I would like to view and try on "${initialProduct}" at the Joda Pipal, Ambikapur showroom.`
      : "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        showToast("Appointment request sent! Our showroom team will call you shortly.");
        await refreshStore();
      } else {
        showToast("Please fill in your name, phone number, and message.", "error");
      }
    } catch {
      showToast("Something went wrong. Please call us directly.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const { storeInfo } = store;

  return (
    <div className="min-h-screen bg-ivory-50 pb-20">
      {/* Header */}
      <section className="bg-burgundy-950 text-ivory-100 py-16 sm:py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(212,168,78,0.18),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.28em] text-gold-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Ambikapur Flagship Showroom
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white mt-2">
            Visit Us Near Joda Pipal, Ambikapur
          </h1>
          <p className="text-sm sm:text-base text-ivory-200/80 mt-3 max-w-2xl">
            Schedule a private bridal consultation, request a bespoke design, or
            walk in for live Karatmeter purity testing and transparent gold exchange.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 -mt-8 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Booking Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gold-300/40 shadow-xl p-7 sm:p-10">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="font-display text-3xl font-semibold text-burgundy-950">
                Thank You, {form.name}!
              </h2>
              <p className="text-sm text-ink-700 max-w-md mx-auto">
                Your request has been logged with our Ambikapur showroom
                concierge. We will reach out on <strong>{form.phone}</strong>{" "}
                shortly to confirm your visit near Joda Pipal.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    type: "appointment",
                    name: "",
                    phone: "",
                    email: "",
                    preferredDate: "",
                    productName: "",
                    message: "",
                  });
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-burgundy-950">
                  Book an Appointment or Custom Order
                </h2>
                <p className="text-xs text-ink-500 mt-1">
                  All inquiries are synced directly to the Swarn Mahal Admin Dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                    Inquiry Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                  >
                    <option value="appointment">Showroom Visit / Bridal Consult</option>
                    <option value="product_inquiry">Jewellery Piece Inquiry</option>
                    <option value="custom_order">Custom Jewellery Design</option>
                    <option value="contact">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                    Preferred Visit Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-ink-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={form.preferredDate}
                      onChange={(e) =>
                        setForm({ ...form, preferredDate: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Roshan Soni"
                    className="w-full px-4 py-3 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98261 XXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                    Jewellery Piece (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.productName}
                    onChange={(e) =>
                      setForm({ ...form, productName: e.target.value })
                    }
                    placeholder="e.g., Bridal Haar or Men's Kada"
                    className="w-full px-4 py-3 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5">
                  Message / Preferences *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share occasion, approximate budget, or custom design ideas..."
                  className="w-full px-4 py-3 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-luxury w-full py-4 rounded-full bg-burgundy-900 text-gold-100 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
              >
                <Send className="w-4 h-4 text-gold-300" />
                {submitting ? "Sending Request..." : "Confirm Appointment Request"}
              </button>
            </form>
          )}
        </div>

        {/* Right: Showroom Info + Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-7 rounded-3xl bg-white border border-ivory-200 shadow-lg space-y-5">
            <h3 className="font-display text-2xl font-semibold text-burgundy-950">
              Showroom Details
            </h3>
            <div className="space-y-4 text-sm text-ink-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink-900">Address</p>
                  <p>{storeInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink-900">Showroom Hours</p>
                  <p>{storeInfo.timings}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink-900">Direct Concierge</p>
                  <p>{storeInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink-900">Email</p>
                  <p>{storeInfo.email}</p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${storeInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat Directly on WhatsApp
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border border-ivory-200 shadow-lg h-72 bg-ivory-100">
            <iframe
              title="Joda Pipal Ambikapur Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(storeInfo.mapEmbedQuery)}&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory-50 flex items-center justify-center font-display text-2xl text-burgundy-900">
          Loading Showroom Details...
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
