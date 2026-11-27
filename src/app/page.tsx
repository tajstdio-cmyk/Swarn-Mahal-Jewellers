"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  RefreshCcw,
  Gem,
  MapPin,
  Clock,
  Phone,
  Star,
  Calendar,
  Compass,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";

const CATEGORY_SHOWCASE = [
  {
    name: "Rings",
    subtitle: "Solitaires & Signets",
    image: "/images/prod-ring-women.jpg",
    href: "/jewellery?category=Rings",
  },
  {
    name: "Bracelets",
    subtitle: "Filigree & Men's Kadas",
    image: "/images/prod-bracelet-women.jpg",
    href: "/jewellery?category=Bracelets",
  },
  {
    name: "Necklaces",
    subtitle: "Bridal Temple Haars",
    image: "/images/prod-necklace.jpg",
    href: "/jewellery?category=Necklaces",
  },
  {
    name: "Earrings",
    subtitle: "Royal Jhumkas & Studs",
    image: "/images/prod-earrings.jpg",
    href: "/jewellery?category=Earrings",
  },
  {
    name: "Men's Chains",
    subtitle: "22K Solid Franco",
    image: "/images/prod-chain-men.jpg",
    href: "/jewellery?category=Chains",
  },
  {
    name: "Mangalsutra",
    subtitle: "Modern Sacred Luxury",
    image: "/images/prod-mangalsutra.jpg",
    href: "/jewellery?category=Mangalsutra",
  },
];

const SHOWCASE_TABS = [
  { id: "All", label: "Signature Picks" },
  { id: "Women", label: "Women's Edit" },
  { id: "Men", label: "Men's Studio" },
  { id: "Rings", label: "Rings" },
  { id: "Bracelets", label: "Bracelets & Kadas" },
  { id: "Necklaces", label: "Necklaces" },
];

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% BIS 916 HUID",
    desc: "Every gold creation is laser-inscribed with a 6-digit government HUID hallmark.",
  },
  {
    icon: Gem,
    title: "IGI Certified Diamonds",
    desc: "Natural, ethically sourced VVS-EF diamonds graded with international certification.",
  },
  {
    icon: RefreshCcw,
    title: "Lifetime Exchange",
    desc: "Transparent 100% prevailing gold rate exchange value with zero hidden deductions.",
  },
  {
    icon: Award,
    title: "Karatmeter Purity Check",
    desc: "Verify purity live in front of you at our Joda Pipal, Ambikapur showroom.",
  },
];

export default function HomePage() {
  const { store } = useStore();
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts = useMemo(() => {
    let list = store.products;
    if (activeTab === "Women" || activeTab === "Men") {
      list = list.filter((p) => p.gender === activeTab || p.gender === "Unisex");
    } else if (activeTab !== "All") {
      list = list.filter((p) => p.category === activeTab);
    } else {
      list = list.filter((p) => p.featured || p.bestseller);
    }
    return list.slice(0, 8);
  }, [activeTab, store.products]);

  return (
    <div className="bg-ivory-50">
      {/* 1. Dynamic Admin-Editable Sliding Hero Banner */}
      <HeroSlider banners={store.banners} />

      {/* 2. Shop By Category Visual Grid */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-22">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-600 font-semibold">
            Crafted For Every Occasion
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold text-burgundy-950 mt-2">
            Shop By Category
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {CATEGORY_SHOWCASE.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
            >
              <Link
                href={cat.href}
                className="group block text-center p-2.5 rounded-2xl bg-white border border-ivory-200 hover:border-gold-400/70 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-ivory-100 mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-burgundy-950 group-hover:text-gold-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-ink-500 mt-0.5">{cat.subtitle}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Shop By Gender — Women & Men Royal Split */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Women's Luxury Edit */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/jewellery?gender=Women"
              className="group relative block h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src="/images/banner-bridal.jpg"
                alt="Women's Jewellery Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/90 via-burgundy-950/35 to-transparent" />
              <div className="absolute inset-0 p-7 sm:p-10 flex flex-col justify-end">
                <span className="text-[11px] uppercase tracking-[0.25em] text-gold-300 font-semibold">
                  For Her • Bridal & Contemporary
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-2">
                  Women&apos;s Luxury Edit
                </h3>
                <p className="text-sm text-ivory-100/85 mt-2 max-w-md">
                  Temple necklaces, solitaire rings, diamond mangalsutras, and delicate filigree bracelets crafted in pure gold.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-gold-300 text-sm font-semibold group-hover:gap-3.5 transition-all">
                  Explore Women&apos;s Jewellery <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Men's Royal Studio */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/jewellery?gender=Men"
              className="group relative block h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src="/images/banner-mens.jpg"
                alt="Men's Jewellery Studio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120d0b]/92 via-[#120d0b]/40 to-transparent" />
              <div className="absolute inset-0 p-7 sm:p-10 flex flex-col justify-end">
                <span className="text-[11px] uppercase tracking-[0.25em] text-gold-300 font-semibold">
                  For Him • Samrat Collection
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-2">
                  Men&apos;s Royal Studio
                </h3>
                <p className="text-sm text-ivory-100/85 mt-2 max-w-md">
                  Engraved 22K gold kadas, solid Italian Franco chains, and bold solitaire signet rings built with regal poise.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-gold-300 text-sm font-semibold group-hover:gap-3.5 transition-all">
                  Explore Men&apos;s Jewellery <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. Interactive Tabbed Signature Creations */}
      <section className="py-16 sm:py-22 bg-ivory-100/75 border-y border-ivory-200 luxury-pattern">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[11px] uppercase tracking-[0.28em] text-gold-600 font-semibold">
                Handpicked Masterpieces
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-burgundy-950 mt-2">
                Swarn Mahal Signatures
              </h2>
            </div>

            {/* Animated Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {SHOWCASE_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      active
                        ? "text-gold-100"
                        : "text-ink-700 hover:text-burgundy-900 bg-white/80 border border-ivory-300/70"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="home-tab-pill"
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                        className="absolute inset-0 rounded-full bg-burgundy-900 shadow-md"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/jewellery"
              className="btn-luxury inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-burgundy-900 text-gold-100 text-sm font-semibold shadow-lg"
            >
              View Complete Jewellery Catalogue
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Curated Collections Showcase */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-18 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.28em] text-gold-600 font-semibold">
              Story-Driven Craftsmanship
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-burgundy-950 mt-2">
              Curated Collections
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy-800 hover:text-gold-600 transition-colors"
          >
            All Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {store.collections.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <Link
                href={`/jewellery?collection=${col.slug}`}
                className="group relative block h-[380px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/92 via-burgundy-950/25 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-gold-400/20 backdrop-blur-md border border-gold-300/40 text-gold-200 text-[10px] font-semibold uppercase tracking-widest">
                    {col.badge}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gold-300 font-medium">
                    {col.tagline}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-white mt-1">
                    {col.name}
                  </h3>
                  <p className="text-xs text-ivory-100/80 mt-2 line-clamp-2">
                    {col.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. The Swarn Mahal Promise (Tanishq-style Trust Pillars) */}
      <section className="bg-burgundy-950 text-ivory-100 py-18 sm:py-22 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,168,78,0.14),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(153,46,70,0.25),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-[0.28em] text-gold-300 font-semibold">
              Pure Trust • Zero Compromise
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-white mt-2">
              The Swarn Mahal Promise
            </h2>
            <p className="text-sm text-ivory-200/75 mt-3">
              Trusted by over {store.storeInfo.happyFamilies} families across Ambikapur & Surguja for {store.storeInfo.heritageYears} years.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_PILLARS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="p-6 rounded-2xl bg-white/5 border border-gold-400/20 backdrop-blur-sm hover:border-gold-400/50 hover:bg-white/8 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400/25 to-burgundy-800 border border-gold-400/40 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-gold-300" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-gold-100">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ivory-200/75 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Ambikapur Flagship Showroom Spotlight */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-18 sm:py-24">
        <div className="rounded-3xl bg-white border border-gold-300/45 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-gold-600 font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Visit Our Flagship Showroom
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-burgundy-950 mt-2 leading-tight">
              Experience Royalty Near Joda Pipal, Ambikapur
            </h2>
            <p className="text-sm sm:text-base text-ink-700 mt-4 leading-relaxed">
              Step into our serene showroom for bespoke bridal consultations, live Karatmeter gold purity verification, and customized jewellery design crafted exclusively for your family celebrations.
            </p>

            <div className="mt-6 space-y-3 text-sm text-ink-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-burgundy-800 shrink-0 mt-1" />
                <span>{store.storeInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-burgundy-800 shrink-0" />
                <span>{store.storeInfo.timings}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-burgundy-800 shrink-0" />
                <span>{store.storeInfo.phone}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-luxury inline-flex items-center gap-2 px-6 py-3 rounded-full bg-burgundy-900 text-gold-100 text-sm font-semibold"
              >
                <Calendar className="w-4 h-4 text-gold-300" />
                Book Private Appointment
              </Link>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.storeInfo.mapEmbedQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-burgundy-900/25 text-burgundy-900 hover:bg-ivory-100 text-sm font-semibold transition-colors"
              >
                <Compass className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[340px] bg-ivory-100">
            <iframe
              title="Swarn Mahal Jewellers Ambikapur Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(store.storeInfo.mapEmbedQuery)}&output=embed`}
              className="w-full h-full min-h-[360px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* 9. Customer Testimonials */}
      <section className="pb-20 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-600 font-semibold">
            Cherished Stories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-burgundy-950 mt-2">
            Loved By Families Across Surguja
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {store.testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="p-7 rounded-2xl bg-white border border-ivory-200 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-500 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-ink-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ivory-100 flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-burgundy-950">
                    {t.name}
                  </p>
                  <p className="text-xs text-ink-500">{t.location}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-ivory-100 text-[10px] font-semibold uppercase tracking-wider text-gold-600">
                  {t.occasion}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
