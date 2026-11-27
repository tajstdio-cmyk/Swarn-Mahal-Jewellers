"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Heart,
  RotateCcw,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import { Category, Gender, MetalType } from "@/lib/types";

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Rings",
  "Bracelets",
  "Necklaces",
  "Earrings",
  "Bangles",
  "Chains",
  "Mangalsutra",
  "Pendants",
];

const GENDERS: ("All" | Gender)[] = ["All", "Women", "Men", "Unisex"];

const METALS: ("All" | MetalType)[] = [
  "All",
  "22K Gold",
  "18K Gold",
  "Diamond",
  "Rose Gold",
  "Platinum",
  "Silver",
];

function JewelleryCatalogueContent() {
  const searchParams = useSearchParams();
  const { store, wishlist } = useStore();

  const [category, setCategory] = useState<string>("All");
  const [gender, setGender] = useState<string>("All");
  const [metal, setMetal] = useState<string>("All");
  const [collection, setCollection] = useState<string>("All");
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(600000);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [search, setSearch] = useState<string>("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setCategory(searchParams.get("category") || "All");
    setGender(searchParams.get("gender") || "All");
    setMetal(searchParams.get("metal") || "All");
    setCollection(searchParams.get("collection") || "All");
    setOnlyWishlist(searchParams.get("wishlist") === "true");
  }, [searchParams]);

  const resetFilters = () => {
    setCategory("All");
    setGender("All");
    setMetal("All");
    setCollection("All");
    setOnlyWishlist(false);
    setMaxPrice(600000);
    setSortBy("featured");
    setSearch("");
  };

  const filtered = useMemo(() => {
    let list = [...store.products];

    if (onlyWishlist) {
      list = list.filter((p) => wishlist.includes(p.id));
    }
    if (category !== "All") {
      list = list.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (gender !== "All") {
      list = list.filter(
        (p) =>
          p.gender.toLowerCase() === gender.toLowerCase() ||
          p.gender === "Unisex"
      );
    }
    if (metal !== "All") {
      list = list.filter((p) => p.metal.toLowerCase() === metal.toLowerCase());
    }
    if (collection !== "All") {
      list = list.filter((p) => p.collectionSlug === collection);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.metal.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "weight-desc":
        list.sort((a, b) => b.weightGrams - a.weightGrams);
        break;
      case "newest":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        list.sort(
          (a, b) =>
            Number(b.featured) +
            Number(b.bestseller) -
            (Number(a.featured) + Number(a.bestseller))
        );
    }

    return list;
  }, [
    store.products,
    onlyWishlist,
    wishlist,
    category,
    gender,
    metal,
    collection,
    search,
    maxPrice,
    sortBy,
  ]);

  const pageHeading = useMemo(() => {
    if (onlyWishlist) return "Your Saved Wishlist";
    if (gender !== "All" && category !== "All")
      return `${gender}'s ${category}`;
    if (gender !== "All") return `${gender}'s Jewellery Collection`;
    if (category !== "All") return `Fine ${category}`;
    if (collection !== "All") {
      const found = store.collections.find((c) => c.slug === collection);
      return found ? found.name : "Curated Collection";
    }
    if (metal !== "All") return `${metal} Creations`;
    return "Complete Jewellery Catalogue";
  }, [onlyWishlist, gender, category, collection, metal, store.collections]);

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Luxury Page Header Banner */}
      <section className="bg-burgundy-950 text-ivory-100 py-14 sm:py-18 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,168,78,0.18),transparent_48%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.26em] text-gold-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Swarn Mahal • Ambikapur
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-semibold text-white mt-2">
                {pageHeading}
              </h1>
              <p className="text-sm text-ivory-200/75 mt-2 max-w-xl">
                Every creation is BIS 916 HUID hallmarked and available for
                in-person viewing near Joda Pipal, Ambikapur.
              </p>
            </div>

            {/* Quick Gender Pill Switcher */}
            <div className="inline-flex p-1 rounded-full bg-white/10 backdrop-blur-md border border-gold-400/25 self-start md:self-auto">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    gender === g
                      ? "bg-gold-400 text-burgundy-950 shadow-sm"
                      : "text-ivory-100/80 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Ribbon */}
      <div className="bg-white border-b border-ivory-200 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-burgundy-900 text-gold-100 shadow-sm"
                  : "bg-ivory-100 text-ink-700 hover:bg-ivory-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {/* Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ring, kada, bridal, SKU..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-ivory-300 text-xs font-semibold text-burgundy-900"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setOnlyWishlist(!onlyWishlist)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                onlyWishlist
                  ? "bg-burgundy-900 text-white border-burgundy-900"
                  : "bg-white text-ink-700 border-ivory-300 hover:border-burgundy-800"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyWishlist ? "fill-current" : ""}`} />
              Wishlist ({wishlist.length})
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full bg-white border border-ivory-300 text-xs font-semibold text-ink-700 focus:outline-none focus:border-gold-500"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="weight-desc">Weight: Heaviest First</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            <span className="text-xs text-ink-500 font-medium">
              {filtered.length} {filtered.length === 1 ? "creation" : "creations"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              showMobileFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-sm space-y-6 sticky top-36">
              <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                <h2 className="font-display text-xl font-semibold text-burgundy-950">
                  Refine Selection
                </h2>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-burgundy-800"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Metal Filter */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-500 font-semibold mb-2.5">
                  Metal & Stone
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {METALS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMetal(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        metal === m
                          ? "bg-burgundy-900 text-gold-100"
                          : "bg-ivory-100 text-ink-700 hover:bg-ivory-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collection Filter */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-500 font-semibold mb-2.5">
                  Collection
                </p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setCollection("All")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      collection === "All"
                        ? "bg-gold-100 text-burgundy-950 font-semibold"
                        : "text-ink-700 hover:bg-ivory-100"
                    }`}
                  >
                    All Collections
                  </button>
                  {store.collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCollection(c.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        collection === c.slug
                          ? "bg-gold-100 text-burgundy-950 font-semibold"
                          : "text-ink-700 hover:bg-ivory-100"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Budget Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink-500 font-semibold">
                    Max Budget
                  </p>
                  <span className="text-xs font-bold text-burgundy-900">
                    ₹{(maxPrice / 100000).toFixed(1)} Lakh
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={600000}
                  step={10000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-burgundy-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-ink-500 mt-1">
                  <span>₹50K</span>
                  <span>₹6L+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {/* Active Filter Pills */}
            {(category !== "All" ||
              gender !== "All" ||
              metal !== "All" ||
              collection !== "All" ||
              onlyWishlist) && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {[
                  category !== "All" && {
                    label: `Category: ${category}`,
                    clear: () => setCategory("All"),
                  },
                  gender !== "All" && {
                    label: `Gender: ${gender}`,
                    clear: () => setGender("All"),
                  },
                  metal !== "All" && {
                    label: `Metal: ${metal}`,
                    clear: () => setMetal("All"),
                  },
                  collection !== "All" && {
                    label: `Collection: ${collection}`,
                    clear: () => setCollection("All"),
                  },
                  onlyWishlist && {
                    label: "Wishlist Only",
                    clear: () => setOnlyWishlist(false),
                  },
                ]
                  .filter(Boolean)
                  .map((chip) => {
                    const c = chip as { label: string; clear: () => void };
                    return (
                      <button
                        key={c.label}
                        onClick={c.clear}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 border border-gold-300 text-burgundy-950 text-xs font-medium hover:bg-gold-200 transition-colors"
                      >
                        {c.label}
                        <X className="w-3 h-3" />
                      </button>
                    );
                  })}
              </div>
            )}

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-14 rounded-3xl bg-white border border-ivory-200 text-center"
              >
                <Sparkles className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                <h3 className="font-display text-2xl font-semibold text-burgundy-950">
                  No jewellery matches these filters
                </h3>
                <p className="text-sm text-ink-500 mt-1">
                  Try widening your budget or clearing one of the active filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 px-6 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold hover:bg-burgundy-800"
                >
                  Show All Jewellery
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JewelleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory-50 flex items-center justify-center text-burgundy-900 font-display text-2xl">
          Loading Swarn Mahal Catalogue...
        </div>
      }
    >
      <JewelleryCatalogueContent />
    </Suspense>
  );
}
