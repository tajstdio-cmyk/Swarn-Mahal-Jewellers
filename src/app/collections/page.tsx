"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function CollectionsPage() {
  const { store } = useStore();

  return (
    <div className="min-h-screen bg-ivory-50 pb-20">
      <section className="bg-burgundy-950 text-ivory-100 py-16 sm:py-22 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,168,78,0.18),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.28em] text-gold-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Signature Editions
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold text-white mt-3">
            Our Curated Collections
          </h1>
          <p className="text-sm sm:text-base text-ivory-200/80 mt-4 leading-relaxed">
            From royal bridal temple craftsmanship to bold men&apos;s solid gold
            kadas and IGI-certified everyday solitaires — each collection tells
            a timeless story.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14 space-y-10">
        {store.collections.map((col, idx) => {
          const count = store.products.filter(
            (p) => p.collectionSlug === col.slug
          ).length;
          const reverse = idx % 2 === 1;

          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="rounded-3xl bg-white border border-ivory-200 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12"
            >
              <div
                className={`lg:col-span-6 h-[320px] sm:h-[400px] overflow-hidden ${
                  reverse ? "lg:order-2" : ""
                }`}
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div
                className={`lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center ${
                  reverse ? "lg:order-1" : ""
                }`}
              >
                <span className="w-fit px-3 py-1 rounded-full bg-gold-100 border border-gold-300 text-burgundy-900 text-[10px] font-semibold uppercase tracking-widest">
                  {col.badge}
                </span>
                <p className="text-xs uppercase tracking-[0.22em] text-gold-600 font-semibold mt-4">
                  {col.tagline}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-burgundy-950 mt-1">
                  {col.name}
                </h2>
                <p className="text-sm sm:text-base text-ink-700 mt-4 leading-relaxed">
                  {col.description}
                </p>
                <p className="text-xs text-ink-500 mt-3 font-medium">
                  {count} handcrafted {count === 1 ? "piece" : "pieces"} currently
                  showcased
                </p>

                <div className="mt-7">
                  <Link
                    href={`/jewellery?collection=${col.slug}`}
                    className="btn-luxury inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-burgundy-900 text-gold-100 text-sm font-semibold"
                  >
                    Explore {col.name}
                    <ArrowRight className="w-4 h-4 text-gold-300" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
