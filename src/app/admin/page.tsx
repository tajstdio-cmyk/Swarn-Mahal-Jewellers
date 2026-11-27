"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Gem,
  Layers,
  TrendingUp,
  MessageSquare,
  Settings,
  Megaphone,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Crown,
  Lock,
  CheckCircle2,
  Calculator,
  Edit3,
  X,
  RefreshCw,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import {
  Category,
  CollectionItem,
  Gender,
  HeroBanner,
  MetalType,
  Product,
  StoreDatabase,
} from "@/lib/types";
import { calculatePriceBreakdown, formatINR, slugify } from "@/lib/format";
import ImageUploader from "@/components/admin/ImageUploader";

type AdminTab =
  | "overview"
  | "topbar"
  | "banners"
  | "products"
  | "collections"
  | "rates"
  | "inquiries"
  | "settings";

const CATEGORIES: Category[] = [
  "Rings",
  "Bracelets",
  "Necklaces",
  "Earrings",
  "Bangles",
  "Chains",
  "Mangalsutra",
  "Pendants",
];

const GENDERS: Gender[] = ["Women", "Men", "Unisex"];

const METALS: MetalType[] = [
  "22K Gold",
  "18K Gold",
  "Diamond",
  "Rose Gold",
  "Platinum",
  "Silver",
];

export default function AdminDashboardPage() {
  const { store, saveStore, showToast } = useStore();
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const [tab, setTab] = useState<AdminTab>("overview");
  const [draft, setDraft] = useState<StoreDatabase>(store);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Modal editors
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCollection, setEditingCollection] =
    useState<CollectionItem | null>(null);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    setDraft(store);
  }, [store]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("smj_admin_auth") === "true") {
        setUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = store.storeInfo.adminPin || "1234";
    if (pinInput.trim() === expected) {
      setUnlocked(true);
      setPinError("");
      try {
        sessionStorage.setItem("smj_admin_auth", "true");
      } catch {
        // ignore
      }
    } else {
      setPinError("Incorrect Admin PIN. Default demo PIN is 1234.");
    }
  };

  const persistChanges = async (nextState: StoreDatabase, msg = "Changes saved live!") => {
    setSaving(true);
    const ok = await saveStore(nextState);
    setSaving(false);
    if (ok) {
      setDraft(nextState);
      setDirty(false);
      showToast(msg);
    } else {
      showToast("Failed to save changes. Please retry.", "error");
    }
  };

  // --- Banner CRUD ---
  const createNewBanner = () => {
    const nextOrder = draft.banners.length + 1;
    setEditingBanner({
      id: `banner-${Date.now()}`,
      badge: "NEW FESTIVE EDITION",
      title: "Timeless Gold Crafted for Ambikapur",
      subtitle:
        "Experience exquisite 22K BIS hallmarked gold and certified diamond creations at our Joda Pipal showroom.",
      ctaText: "Explore Collection",
      ctaLink: "/jewellery",
      secondaryCtaText: "Book Showroom Visit",
      secondaryCtaLink: "/contact",
      image: "/images/banner-bridal.jpg",
      theme: "maroon",
      active: true,
      order: nextOrder,
    });
  };

  const saveBanner = async (banner: HeroBanner) => {
    const exists = draft.banners.some((b) => b.id === banner.id);
    const banners = exists
      ? draft.banners.map((b) => (b.id === banner.id ? banner : b))
      : [...draft.banners, banner];
    setEditingBanner(null);
    await persistChanges({ ...draft, banners }, "Hero banner updated!");
  };

  const deleteBanner = async (id: string) => {
    const banners = draft.banners
      .filter((b) => b.id !== id)
      .map((b, i) => ({ ...b, order: i + 1 }));
    await persistChanges({ ...draft, banners }, "Hero banner deleted");
  };

  const moveBanner = async (index: number, dir: -1 | 1) => {
    const sorted = [...draft.banners].sort((a, b) => a.order - b.order);
    const target = index + dir;
    if (target < 0 || target >= sorted.length) return;
    [sorted[index], sorted[target]] = [sorted[target], sorted[index]];
    const reordered = sorted.map((b, i) => ({ ...b, order: i + 1 }));
    await persistChanges({ ...draft, banners: reordered }, "Banner order updated");
  };

  // --- Product CRUD ---
  const createNewProduct = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      slug: "",
      sku: `SMJ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      category: "Rings",
      gender: "Women",
      metal: "22K Gold",
      purity: "22K (916 BIS Hallmarked)",
      weightGrams: 8.5,
      makingChargePercent: 11,
      gstPercent: 3,
      stonePrice: 0,
      price: 70500,
      collectionSlug: draft.collections[0]?.slug || "royal-bridal",
      image: "/images/prod-ring-women.jpg",
      gallery: ["/images/prod-ring-women.jpg"],
      description: "",
      highlights: [
        "BIS 916 HUID Hallmarked Purity",
        "100% Lifetime Exchange Guarantee",
      ],
      badge: "New Arrival",
      inStock: true,
      featured: true,
      bestseller: false,
      isNew: true,
    });
  };

  const saveProduct = async (product: Product) => {
    const cleanProduct: Product = {
      ...product,
      slug: product.slug.trim() || slugify(product.name) || `item-${Date.now()}`,
      gallery:
        product.gallery && product.gallery.length > 0
          ? [product.image, ...product.gallery.filter((g) => g !== product.image)]
          : [product.image],
    };
    const exists = draft.products.some((p) => p.id === cleanProduct.id);
    const products = exists
      ? draft.products.map((p) => (p.id === cleanProduct.id ? cleanProduct : p))
      : [cleanProduct, ...draft.products];
    setEditingProduct(null);
    await persistChanges({ ...draft, products }, "Jewellery item saved!");
  };

  const deleteProduct = async (id: string) => {
    const products = draft.products.filter((p) => p.id !== id);
    await persistChanges({ ...draft, products }, "Jewellery item deleted");
  };

  // --- Collection CRUD ---
  const createNewCollection = () => {
    setEditingCollection({
      id: `col-${Date.now()}`,
      slug: "",
      name: "",
      tagline: "Handcrafted Luxury",
      description: "",
      image: "/images/prod-necklace.jpg",
      badge: "Exclusive",
      featured: true,
    });
  };

  const saveCollection = async (col: CollectionItem) => {
    const clean: CollectionItem = {
      ...col,
      slug: col.slug.trim() || slugify(col.name) || `col-${Date.now()}`,
    };
    const exists = draft.collections.some((c) => c.id === clean.id);
    const collections = exists
      ? draft.collections.map((c) => (c.id === clean.id ? clean : c))
      : [...draft.collections, clean];
    setEditingCollection(null);
    await persistChanges({ ...draft, collections }, "Collection saved!");
  };

  const deleteCollection = async (id: string) => {
    const collections = draft.collections.filter((c) => c.id !== id);
    await persistChanges({ ...draft, collections }, "Collection removed");
  };

  // --- Recalculate all product prices from current gold rates ---
  const recalculateAllPrices = async () => {
    const products = draft.products.map((p) => {
      const calc = calculatePriceBreakdown(p, draft.goldRates);
      return { ...p, price: calc.calculatedTotal };
    });
    await persistChanges(
      { ...draft, products },
      "All jewellery prices synced with live metal rates!"
    );
  };

  // --- Lock Screen ---
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-burgundy-950 flex items-center justify-center p-5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,168,78,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(122,33,53,0.45),transparent_50%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative z-10 w-full max-w-md bg-ivory-50 rounded-3xl p-8 sm:p-10 shadow-2xl border border-gold-400/40"
        >
          <div className="w-14 h-14 rounded-2xl bg-burgundy-900 border border-gold-400/60 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Crown className="w-7 h-7 text-gold-300" />
          </div>

          <h1 className="font-display text-3xl font-bold text-burgundy-950 text-center">
            Swarn Mahal Admin
          </h1>
          <p className="text-xs text-ink-500 text-center mt-1">
            Ambikapur Showroom Management Portal
          </p>

          <form onSubmit={handleUnlock} className="mt-7 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-ink-700 mb-2">
                Enter Admin PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4-digit PIN (default: 1234)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                  autoFocus
                />
              </div>
              {pinError && (
                <p className="text-xs text-red-600 mt-1.5">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-luxury w-full py-3.5 rounded-full bg-burgundy-900 text-gold-100 text-sm font-semibold shadow-lg"
            >
              Unlock Admin Dashboard
            </button>

            <div className="flex items-center justify-between pt-2 text-xs text-ink-500">
              <span>Demo PIN: <strong className="text-burgundy-900">1234</strong></span>
              <Link href="/" className="text-gold-600 font-semibold hover:underline">
                ← Back to Storefront
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "topbar",
      label: "Top Sliding Bar",
      icon: Megaphone,
      count: (draft.storeInfo.announcements || []).filter((a) => a.active).length,
    },
    { id: "banners", label: "Hero Banners", icon: ImageIcon, count: draft.banners.length },
    { id: "products", label: "Jewellery Items", icon: Gem, count: draft.products.length },
    { id: "collections", label: "Collections", icon: Layers, count: draft.collections.length },
    { id: "rates", label: "Live Gold Rates", icon: TrendingUp },
    {
      id: "inquiries",
      label: "Appointments",
      icon: MessageSquare,
      count: draft.inquiries.filter((i) => i.status === "new").length,
    },
    { id: "settings", label: "Store Settings", icon: Settings },
  ];

  const sortedBanners = [...draft.banners].sort((a, b) => a.order - b.order);
  const filteredProducts = draft.products.filter(
    (p) =>
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.gender.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f3ec] flex flex-col md:flex-row">
      {/* Left Admin Sidebar */}
      <aside className="md:w-64 bg-burgundy-950 text-ivory-100 flex flex-col shrink-0 border-r border-gold-500/20">
        <div className="p-6 border-b border-gold-400/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400/25 to-burgundy-800 border border-gold-400/50 flex items-center justify-center">
              <Crown className="w-5 h-5 text-gold-300" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-gold-200 leading-none">
                Swarn Mahal
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold-300/70 mt-1">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        <nav className="p-3.5 flex-1 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  active
                    ? "bg-gold-400 text-burgundy-950 font-semibold shadow-md"
                    : "text-ivory-200/80 hover:bg-white/8 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </span>
                {typeof item.count === "number" && item.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      active
                        ? "bg-burgundy-950/20 text-burgundy-950"
                        : "bg-white/10 text-gold-200"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gold-400/15 space-y-2">
          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-gold-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Header */}
        <header className="bg-white border-b border-ivory-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-burgundy-950 capitalize">
              {navItems.find((n) => n.id === tab)?.label}
            </h1>
            <p className="text-xs text-ink-500">
              {draft.storeInfo.brandName} • {draft.storeInfo.landmark}, Ambikapur
            </p>
          </div>

          <div className="flex items-center gap-3">
            {dirty && (
              <button
                onClick={() => persistChanges(draft)}
                disabled={saving}
                className="btn-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold shadow-md"
              >
                <Save className="w-3.5 h-3.5 text-gold-300" />
                {saving ? "Saving..." : "Save All Changes"}
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live DB Connected
            </span>
          </div>
        </header>

        <div className="p-6 sm:p-8 flex-1">
          {/* 1. OVERVIEW TAB */}
          {tab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {[
                  {
                    label: "Active Hero Banners",
                    value: draft.banners.filter((b) => b.active).length,
                    sub: `${draft.banners.length} total slides`,
                    action: () => setTab("banners"),
                  },
                  {
                    label: "Jewellery Catalogue",
                    value: draft.products.length,
                    sub: `${draft.products.filter((p) => p.gender === "Men").length} Men • ${draft.products.filter((p) => p.gender === "Women").length} Women`,
                    action: () => setTab("products"),
                  },
                  {
                    label: "22K Gold Rate (10g)",
                    value: formatINR(draft.goldRates.gold22k),
                    sub: `24K: ${formatINR(draft.goldRates.gold24k)}`,
                    action: () => setTab("rates"),
                  },
                  {
                    label: "Pending Inquiries",
                    value: draft.inquiries.filter((i) => i.status === "new").length,
                    sub: `${draft.inquiries.length} total bookings`,
                    action: () => setTab("inquiries"),
                  },
                ].map((card) => (
                  <button
                    key={card.label}
                    onClick={card.action}
                    className="text-left p-6 rounded-2xl bg-white border border-ivory-200 hover:border-gold-400 shadow-sm hover:shadow-md transition-all"
                  >
                    <p className="text-xs uppercase tracking-wider font-semibold text-ink-500">
                      {card.label}
                    </p>
                    <p className="font-display text-3xl font-bold text-burgundy-950 mt-2">
                      {card.value}
                    </p>
                    <p className="text-xs text-gold-600 font-medium mt-1">
                      {card.sub}
                    </p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-sm space-y-4">
                  <h2 className="font-display text-2xl font-semibold text-burgundy-950">
                    Quick Showroom Actions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setTab("banners");
                        createNewBanner();
                      }}
                      className="p-4 rounded-xl bg-ivory-50 hover:bg-gold-100/70 border border-ivory-200 text-left transition-colors"
                    >
                      <ImageIcon className="w-5 h-5 text-burgundy-800 mb-2" />
                      <p className="font-semibold text-sm text-burgundy-950">
                        Add Sliding Banner
                      </p>
                      <p className="text-xs text-ink-500">
                        Upload festive campaign slide
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setTab("products");
                        createNewProduct();
                      }}
                      className="p-4 rounded-xl bg-ivory-50 hover:bg-gold-100/70 border border-ivory-200 text-left transition-colors"
                    >
                      <Gem className="w-5 h-5 text-burgundy-800 mb-2" />
                      <p className="font-semibold text-sm text-burgundy-950">
                        Add Jewellery Piece
                      </p>
                      <p className="text-xs text-ink-500">
                        Rings, Kadas, Bridal Sets
                      </p>
                    </button>

                    <button
                      onClick={() => setTab("rates")}
                      className="p-4 rounded-xl bg-ivory-50 hover:bg-gold-100/70 border border-ivory-200 text-left transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-burgundy-800 mb-2" />
                      <p className="font-semibold text-sm text-burgundy-950">
                        Update Gold Rates
                      </p>
                      <p className="text-xs text-ink-500">
                        Instant update across header & pricing
                      </p>
                    </button>

                    <button
                      onClick={() => setTab("topbar")}
                      className="p-4 rounded-xl bg-ivory-50 hover:bg-gold-100/70 border border-ivory-200 text-left transition-colors"
                    >
                      <Megaphone className="w-5 h-5 text-burgundy-800 mb-2" />
                      <p className="font-semibold text-sm text-burgundy-950">
                        Edit Top Sliding Bar
                      </p>
                      <p className="text-xs text-ink-500">
                        Location, live ticker text &amp; scroll speed
                      </p>
                    </button>
                  </div>
                </div>

                {/* Recent Inquiries */}
                <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold text-burgundy-950">
                      Latest Customer Inquiries
                    </h2>
                    <button
                      onClick={() => setTab("inquiries")}
                      className="text-xs font-semibold text-gold-600 hover:underline"
                    >
                      Manage All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {draft.inquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200 flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="font-semibold text-sm text-burgundy-950">
                            {inq.name}{" "}
                            <span className="text-xs font-normal text-ink-500">
                              • {inq.phone}
                            </span>
                          </p>
                          <p className="text-xs text-ink-700 mt-0.5 line-clamp-1">
                            {inq.message}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            inq.status === "new"
                              ? "bg-amber-100 text-amber-800"
                              : inq.status === "contacted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1B. TOP SLIDING BAR MANAGER */}
          {tab === "topbar" && (
            <div className="max-w-4xl space-y-6">
              {/* Live Right-to-Left Preview */}
              <div className="rounded-2xl overflow-hidden border border-gold-400/40 shadow-sm">
                <div className="px-4 py-2 bg-white border-b border-ivory-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-burgundy-950">
                    Live Right-to-Left Ticker Preview (hover to pause)
                  </span>
                  <span className="text-ink-500">
                    Speed: {draft.storeInfo.topBarSpeedSeconds || 36}s / loop
                  </span>
                </div>
                <div className="ticker-container bg-burgundy-950 text-gold-100 overflow-hidden">
                  <div className="ticker-mask h-10 flex items-center overflow-hidden">
                    <div
                      className="animate-marquee text-xs"
                      style={
                        {
                          "--ticker-duration": `${Math.max(10, draft.storeInfo.topBarSpeedSeconds || 36)}s`,
                        } as React.CSSProperties
                      }
                    >
                      {["prev-a", "prev-b"].map((k) => (
                        <div
                          key={k}
                          className="flex items-center shrink-0 gap-10 pr-10 whitespace-nowrap"
                        >
                          {(draft.storeInfo.topBarShowLocation ?? true) && (
                            <span className="text-gold-100 font-medium">
                              📍{" "}
                              {draft.storeInfo.topBarLocationText ||
                                `${draft.storeInfo.landmark}, ${draft.storeInfo.city}`}
                            </span>
                          )}
                          {(draft.storeInfo.topBarShowRates ?? true) && (
                            <span>
                              🟢{" "}
                              <strong className="text-gold-300">
                                {draft.storeInfo.topBarRatesLabel ||
                                  "Today's Live Rate (10g):"}
                              </strong>{" "}
                              24K {formatINR(draft.goldRates.gold24k)} | 22K{" "}
                              {formatINR(draft.goldRates.gold22k)} | 18K{" "}
                              {formatINR(draft.goldRates.gold18k)}
                            </span>
                          )}
                          {(draft.storeInfo.announcements || [])
                            .filter((a) => a.active && a.text.trim())
                            .map((a) => (
                              <span key={`${k}-${a.id}`}>
                                {a.badge && (
                                  <strong className="text-gold-300 mr-2">
                                    [{a.badge}]
                                  </strong>
                                )}
                                {a.text}
                              </span>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location, Gold Rate & Speed Controls */}
              <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ivory-200 pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-burgundy-950">
                      Top Bar Text &amp; Scroll Speed
                    </h2>
                    <p className="text-xs text-ink-500">
                      Customize every single text scrolling smoothly from right to left at the top of your website.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      persistChanges(draft, "Top sliding bar updated live!")
                    }
                    disabled={saving}
                    className="btn-luxury inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold"
                  >
                    <Save className="w-3.5 h-3.5 text-gold-300" />
                    {saving ? "Saving..." : "Save Top Bar Live"}
                  </button>
                </div>

                {/* Scroll Speed Slider */}
                <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                      Right-to-Left Scroll Speed
                    </label>
                    <span className="text-xs font-bold text-burgundy-900">
                      {draft.storeInfo.topBarSpeedSeconds || 36} seconds per full loop
                    </span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={65}
                    step={2}
                    value={draft.storeInfo.topBarSpeedSeconds || 36}
                    onChange={(e) => {
                      setDirty(true);
                      setDraft({
                        ...draft,
                        storeInfo: {
                          ...draft.storeInfo,
                          topBarSpeedSeconds: Number(e.target.value),
                        },
                      });
                    }}
                    className="w-full accent-burgundy-800 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-ink-500 mt-1">
                    <span>Faster (12s)</span>
                    <span>Smooth Luxury (36s)</span>
                    <span>Ultra Slow (65s)</span>
                  </div>
                </div>

                {/* Location Text Control */}
                <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                      Showroom Location Ticker Text
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-burgundy-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.storeInfo.topBarShowLocation ?? true}
                        onChange={(e) => {
                          setDirty(true);
                          setDraft({
                            ...draft,
                            storeInfo: {
                              ...draft.storeInfo,
                              topBarShowLocation: e.target.checked,
                            },
                          });
                        }}
                        className="accent-burgundy-800"
                      />
                      Show in Top Bar
                    </label>
                  </div>
                  <input
                    type="text"
                    value={
                      draft.storeInfo.topBarLocationText ??
                      `${draft.storeInfo.landmark}, ${draft.storeInfo.city} • ${draft.storeInfo.phone}`
                    }
                    onChange={(e) => {
                      setDirty(true);
                      setDraft({
                        ...draft,
                        storeInfo: {
                          ...draft.storeInfo,
                          topBarLocationText: e.target.value,
                        },
                      });
                    }}
                    placeholder="e.g., Visit Our Showroom Near Joda Pipal, Ambikapur • +91 98261 47900"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* Gold Rates Label Control */}
                <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                      Live Gold Rate Prefix Text
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-burgundy-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.storeInfo.topBarShowRates ?? true}
                        onChange={(e) => {
                          setDirty(true);
                          setDraft({
                            ...draft,
                            storeInfo: {
                              ...draft.storeInfo,
                              topBarShowRates: e.target.checked,
                            },
                          });
                        }}
                        className="accent-burgundy-800"
                      />
                      Show Live Rates in Top Bar
                    </label>
                  </div>
                  <input
                    type="text"
                    value={
                      draft.storeInfo.topBarRatesLabel ??
                      "Today's Live Rate (10g):"
                    }
                    onChange={(e) => {
                      setDirty(true);
                      setDraft({
                        ...draft,
                        storeInfo: {
                          ...draft.storeInfo,
                          topBarRatesLabel: e.target.value,
                        },
                      });
                    }}
                    placeholder="e.g., Today's Live Rate (10g):"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[11px] text-ink-500">
                    To edit the actual 24K / 22K / 18K / Silver numbers, use the{" "}
                    <button
                      type="button"
                      onClick={() => setTab("rates")}
                      className="text-gold-600 font-semibold underline"
                    >
                      Live Gold Rates
                    </button>{" "}
                    tab.
                  </p>
                </div>
              </div>

              {/* Custom Announcement Items List */}
              <div className="p-6 rounded-2xl bg-white border border-ivory-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-burgundy-950">
                      Custom Announcement Texts
                    </h3>
                    <p className="text-xs text-ink-500">
                      Add, edit, toggle, or remove any announcement message flowing in the top bar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDirty(true);
                      const nextList = [
                        ...(draft.storeInfo.announcements || []),
                        {
                          id: `ann-${Date.now()}`,
                          badge: "FESTIVE OFFER",
                          text: "New 22K Gold & Diamond Collection Now Available Near Joda Pipal, Ambikapur",
                          link: "/jewellery",
                          linkText: "Shop Now",
                          active: true,
                        },
                      ];
                      setDraft({
                        ...draft,
                        storeInfo: {
                          ...draft.storeInfo,
                          announcements: nextList,
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-100 hover:bg-gold-200 border border-gold-400/50 text-burgundy-950 text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Announcement Text
                  </button>
                </div>

                <div className="space-y-3">
                  {(draft.storeInfo.announcements || []).map((ann, idx) => (
                    <div
                      key={ann.id}
                      className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-gold-600">
                          Announcement #{idx + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ann.active}
                              onChange={(e) => {
                                setDirty(true);
                                const updated = (
                                  draft.storeInfo.announcements || []
                                ).map((item) =>
                                  item.id === ann.id
                                    ? { ...item, active: e.target.checked }
                                    : item
                                );
                                setDraft({
                                  ...draft,
                                  storeInfo: {
                                    ...draft.storeInfo,
                                    announcements: updated,
                                  },
                                });
                              }}
                              className="accent-burgundy-800"
                            />
                            Active
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setDirty(true);
                              const updated = (
                                draft.storeInfo.announcements || []
                              ).filter((item) => item.id !== ann.id);
                              setDraft({
                                ...draft,
                                storeInfo: {
                                  ...draft.storeInfo,
                                  announcements: updated,
                                },
                              });
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            title="Delete announcement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={ann.badge}
                          onChange={(e) => {
                            setDirty(true);
                            const updated = (
                              draft.storeInfo.announcements || []
                            ).map((item) =>
                              item.id === ann.id
                                ? { ...item, badge: e.target.value }
                                : item
                            );
                            setDraft({
                              ...draft,
                              storeInfo: {
                                ...draft.storeInfo,
                                announcements: updated,
                              },
                            });
                          }}
                          placeholder="Badge (optional, e.g. BRIDAL)"
                          className="px-3 py-2 rounded-xl bg-white border border-ivory-300 text-xs font-semibold"
                        />
                        <input
                          type="text"
                          value={ann.linkText || ""}
                          onChange={(e) => {
                            setDirty(true);
                            const updated = (
                              draft.storeInfo.announcements || []
                            ).map((item) =>
                              item.id === ann.id
                                ? { ...item, linkText: e.target.value }
                                : item
                            );
                            setDraft({
                              ...draft,
                              storeInfo: {
                                ...draft.storeInfo,
                                announcements: updated,
                              },
                            });
                          }}
                          placeholder="Link Text (optional)"
                          className="px-3 py-2 rounded-xl bg-white border border-ivory-300 text-xs"
                        />
                        <input
                          type="text"
                          value={ann.link || ""}
                          onChange={(e) => {
                            setDirty(true);
                            const updated = (
                              draft.storeInfo.announcements || []
                            ).map((item) =>
                              item.id === ann.id
                                ? { ...item, link: e.target.value }
                                : item
                            );
                            setDraft({
                              ...draft,
                              storeInfo: {
                                ...draft.storeInfo,
                                announcements: updated,
                              },
                            });
                          }}
                          placeholder="Link URL (e.g. /jewellery)"
                          className="px-3 py-2 rounded-xl bg-white border border-ivory-300 text-xs"
                        />
                      </div>

                      <input
                        type="text"
                        value={ann.text}
                        onChange={(e) => {
                          setDirty(true);
                          const updated = (
                            draft.storeInfo.announcements || []
                          ).map((item) =>
                            item.id === ann.id
                              ? { ...item, text: e.target.value }
                              : item
                          );
                          setDraft({
                            ...draft,
                            storeInfo: {
                              ...draft.storeInfo,
                              announcements: updated,
                            },
                          });
                        }}
                        placeholder="Announcement message..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-sm"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() =>
                      persistChanges(draft, "All top bar texts saved live!")
                    }
                    disabled={saving}
                    className="btn-luxury inline-flex items-center gap-2 px-7 py-3 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold"
                  >
                    <Save className="w-4 h-4 text-gold-300" />
                    {saving ? "Saving..." : "Publish Top Sliding Bar Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. HERO BANNERS MANAGER */}
          {tab === "banners" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-ink-700">
                  Manage the sliding full-width hero banners shown on the home
                  page. Upload images, edit text, reorder slides, or toggle visibility.
                </p>
                <button
                  onClick={createNewBanner}
                  className="btn-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold shadow-md"
                >
                  <Plus className="w-4 h-4 text-gold-300" />
                  Add New Banner Slide
                </button>
              </div>

              <div className="space-y-4">
                {sortedBanners.map((b, idx) => (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-ivory-200 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center"
                  >
                    <div className="relative w-full md:w-56 h-32 rounded-xl overflow-hidden bg-ivory-100 shrink-0">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.active
                            ? "bg-emerald-600 text-white"
                            : "bg-ink-700 text-white"
                        }`}
                      >
                        {b.active ? "Active" : "Hidden"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-600">
                        Slide #{idx + 1} • {b.badge} • Theme: {b.theme}
                      </span>
                      <h3 className="font-display text-2xl font-semibold text-burgundy-950 mt-0.5">
                        {b.title}
                      </h3>
                      <p className="text-xs text-ink-700 mt-1 line-clamp-2">
                        {b.subtitle}
                      </p>
                      <p className="text-[11px] text-ink-500 mt-2">
                        Button: <strong>{b.ctaText}</strong> → {b.ctaLink}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => moveBanner(idx, -1)}
                        disabled={idx === 0}
                        className="p-2 rounded-lg border border-ivory-300 hover:bg-ivory-100 disabled:opacity-35"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveBanner(idx, 1)}
                        disabled={idx === sortedBanners.length - 1}
                        className="p-2 rounded-lg border border-ivory-300 hover:bg-ivory-100 disabled:opacity-35"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingBanner(b)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-ivory-100 hover:bg-gold-100 text-burgundy-950 text-xs font-semibold"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => deleteBanner(b.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. JEWELLERY PRODUCTS MANAGER */}
          {tab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by name, SKU, Men/Women, category..."
                  className="px-4 py-2.5 rounded-full bg-white border border-ivory-300 text-sm w-full sm:w-80 focus:outline-none focus:border-gold-500"
                />
                <button
                  onClick={createNewProduct}
                  className="btn-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold shadow-md"
                >
                  <Plus className="w-4 h-4 text-gold-300" />
                  Add New Jewellery Item
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-ivory-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-ivory-100/80 border-b border-ivory-200 text-[11px] uppercase tracking-wider text-ink-500">
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category & Gender</th>
                      <th className="py-3.5 px-4">Purity & Weight</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-100 text-sm">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-ivory-50/70">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-ivory-100 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-burgundy-950">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-ink-500">{p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-ink-900">
                            {p.category}
                          </span>
                          <span className="block text-xs text-ink-500">
                            {p.gender} • {p.metal}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-ink-700">
                          <span className="font-semibold">{p.weightGrams}g</span>
                          <span className="block text-ink-500">{p.purity}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-burgundy-900">
                          {formatINR(p.price)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              p.inStock
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {p.inStock ? "In Stock" : "Made to Order"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="px-3 py-1.5 rounded-lg bg-ivory-100 hover:bg-gold-100 text-burgundy-950 text-xs font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. COLLECTIONS MANAGER */}
          {tab === "collections" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-700">
                  Curate themed collections displayed on the Home & Collections pages.
                </p>
                <button
                  onClick={createNewCollection}
                  className="btn-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold"
                >
                  <Plus className="w-4 h-4 text-gold-300" />
                  Add Collection
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {draft.collections.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-white border border-ivory-200 shadow-sm flex gap-4 items-center"
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-gold-600">
                        {c.badge}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-burgundy-950">
                        {c.name}
                      </h3>
                      <p className="text-xs text-ink-500 line-clamp-2 mt-0.5">
                        {c.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => setEditingCollection(c)}
                          className="px-3 py-1 rounded-lg bg-ivory-100 hover:bg-gold-100 text-burgundy-950 text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCollection(c.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. LIVE GOLD & SILVER RATES */}
          {tab === "rates" && (
            <div className="max-w-3xl space-y-6">
              <div className="p-7 rounded-2xl bg-white border border-ivory-200 shadow-sm space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-burgundy-950">
                    Today&apos;s Ambikapur Bullion Rates (per 10 grams)
                  </h2>
                  <p className="text-xs text-ink-500 mt-1">
                    Updates the live top header ticker, footer rate board, and
                    product price-breakdown calculator immediately.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { key: "gold24k", label: "24K Pure Gold (999) — ₹ / 10g" },
                    { key: "gold22k", label: "22K Hallmarked Gold (916) — ₹ / 10g" },
                    { key: "gold18k", label: "18K Diamond Gold (750) — ₹ / 10g" },
                    { key: "silver", label: "Pure Silver (999) — ₹ / 10g" },
                  ].map((field) => {
                    const k = field.key as keyof typeof draft.goldRates;
                    const val = Number(draft.goldRates[k] || 0);
                    return (
                      <div key={field.key} className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700">
                          {field.label}
                        </label>
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => {
                            setDirty(true);
                            setDraft({
                              ...draft,
                              goldRates: {
                                ...draft.goldRates,
                                [k]: Number(e.target.value),
                              },
                            });
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-ivory-50 border border-ivory-300 text-base font-bold text-burgundy-950 focus:outline-none focus:border-gold-500"
                        />
                        <p className="text-[11px] text-ink-500">
                          Per gram: <strong>{formatINR(val / 10)}</strong>
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() =>
                      persistChanges(draft, "Live Gold & Silver rates updated!")
                    }
                    disabled={saving}
                    className="btn-luxury inline-flex items-center gap-2 px-6 py-3 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold"
                  >
                    <Save className="w-4 h-4 text-gold-300" />
                    Publish Live Rates
                  </button>

                  <button
                    onClick={recalculateAllPrices}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gold-500/60 bg-ivory-100 hover:bg-gold-100 text-burgundy-950 text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-gold-600" />
                    Auto-Recalculate All Product Prices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. INQUIRIES & APPOINTMENTS */}
          {tab === "inquiries" && (
            <div className="space-y-4">
              {draft.inquiries.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white border border-ivory-200 text-center text-ink-500">
                  No appointments or customer inquiries yet.
                </div>
              ) : (
                draft.inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl bg-white border border-ivory-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-ivory-200 text-burgundy-900 text-[10px] font-bold uppercase">
                          {inq.type.replace("_", " ")}
                        </span>
                        <h3 className="font-semibold text-base text-burgundy-950">
                          {inq.name}
                        </h3>
                        <span className="text-xs text-ink-500">
                          {inq.phone} {inq.email ? `• ${inq.email}` : ""}
                        </span>
                      </div>
                      {inq.productName && (
                        <p className="text-xs font-semibold text-gold-600">
                          Jewellery: {inq.productName}
                        </p>
                      )}
                      <p className="text-sm text-ink-700">{inq.message}</p>
                      {inq.preferredDate && (
                        <p className="text-xs text-ink-500">
                          Preferred Visit Date: <strong>{inq.preferredDate}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={inq.status}
                        onChange={(e) => {
                          const nextStatus = e.target.value as
                            | "new"
                            | "contacted"
                            | "completed";
                          const inquiries = draft.inquiries.map((item) =>
                            item.id === inq.id
                              ? { ...item, status: nextStatus }
                              : item
                          );
                          persistChanges(
                            { ...draft, inquiries },
                            "Inquiry status updated"
                          );
                        }}
                        className="px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs font-semibold"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() => {
                          const inquiries = draft.inquiries.filter(
                            (i) => i.id !== inq.id
                          );
                          persistChanges(
                            { ...draft, inquiries },
                            "Inquiry removed"
                          );
                        }}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 7. STORE SETTINGS */}
          {tab === "settings" && (
            <div className="max-w-3xl bg-white rounded-2xl border border-ivory-200 shadow-sm p-7 space-y-5">
              <h2 className="font-display text-2xl font-semibold text-burgundy-950">
                Showroom Branding & Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  [
                    ["brandName", "Showroom Brand Name"],
                    ["tagline", "Tagline"],
                    ["landmark", "Landmark"],
                    ["city", "City & State"],
                    ["phone", "Phone Number"],
                    ["whatsapp", "WhatsApp Number (digits only e.g. 919826147900)"],
                    ["email", "Contact Email"],
                    ["timings", "Opening Hours"],
                    ["heritageYears", "Years of Heritage (e.g., 25+)"],
                    ["happyFamilies", "Happy Families Stat (e.g., 18,000+)"],
                    ["mapEmbedQuery", "Google Map Search Query"],
                    ["adminPin", "Admin Dashboard PIN"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={draft.storeInfo[key]}
                      onChange={(e) => {
                        setDirty(true);
                        setDraft({
                          ...draft,
                          storeInfo: {
                            ...draft.storeInfo,
                            [key]: e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                  Full Showroom Address
                </label>
                <input
                  type="text"
                  value={draft.storeInfo.address}
                  onChange={(e) => {
                    setDirty(true);
                    setDraft({
                      ...draft,
                      storeInfo: {
                        ...draft.storeInfo,
                        address: e.target.value,
                      },
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-burgundy-950">
                    Top Right-to-Left Sliding Announcement Bar
                  </p>
                  <p className="text-xs text-ink-500">
                    Edit scrolling location text, gold rate prefix, announcements &amp; scroll speed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("topbar")}
                  className="px-4 py-2 rounded-full bg-gold-100 hover:bg-gold-200 border border-gold-400/50 text-burgundy-950 text-xs font-semibold"
                >
                  Open Top Bar Manager →
                </button>
              </div>

              <button
                onClick={() =>
                  persistChanges(draft, "Store details updated live!")
                }
                disabled={saving}
                className="btn-luxury inline-flex items-center gap-2 px-7 py-3 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold"
              >
                <Save className="w-4 h-4 text-gold-300" />
                Save Showroom Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BANNER EDITOR MODAL */}
      <AnimatePresence>
        {editingBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingBanner(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
                <h2 className="font-display text-2xl font-semibold text-burgundy-950">
                  Edit Hero Sliding Banner
                </h2>
                <button
                  onClick={() => setEditingBanner(null)}
                  className="p-2 rounded-full hover:bg-ivory-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ImageUploader
                label="Banner Landscape Image"
                value={editingBanner.image}
                onChange={(url) =>
                  setEditingBanner({ ...editingBanner, image: url })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Top Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingBanner.badge}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Overlay Theme
                  </label>
                  <select
                    value={editingBanner.theme}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        theme: e.target.value as HeroBanner["theme"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  >
                    <option value="maroon">Royal Burgundy Maroon</option>
                    <option value="champagne">Warm Champagne Dark</option>
                    <option value="obsidian">Obsidian Men&apos;s Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                  Subtitle / Campaign Description
                </label>
                <textarea
                  rows={3}
                  value={editingBanner.subtitle}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      subtitle: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={editingBanner.ctaText}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        ctaText: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={editingBanner.ctaLink}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        ctaLink: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingBanner.active}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      active: e.target.checked,
                    })
                  }
                  className="accent-burgundy-800 w-4 h-4"
                />
                Show this banner in the home page slider
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-ivory-200">
                <button
                  onClick={() => setEditingBanner(null)}
                  className="px-5 py-2.5 rounded-full border border-ivory-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveBanner(editingBanner)}
                  className="btn-luxury px-6 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold"
                >
                  Save Banner Slide
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCT EDITOR MODAL */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
                <h2 className="font-display text-2xl font-semibold text-burgundy-950">
                  {editingProduct.name ? `Edit: ${editingProduct.name}` : "Add New Jewellery Piece"}
                </h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 rounded-full hover:bg-ivory-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ImageUploader
                label="Product Primary Photo"
                value={editingProduct.image}
                onChange={(url) =>
                  setEditingProduct({ ...editingProduct, image: url })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Jewellery Name *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Royal Kundan Bridal Haar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sku: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as Category,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs font-medium"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={editingProduct.gender}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        gender: e.target.value as Gender,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs font-medium"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Metal
                  </label>
                  <select
                    value={editingProduct.metal}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        metal: e.target.value as MetalType,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs font-medium"
                  >
                    {METALS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Collection
                  </label>
                  <select
                    value={editingProduct.collectionSlug}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        collectionSlug: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs font-medium"
                  >
                    {draft.collections.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Weight (grams)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.weightGrams}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        weightGrams: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Making Charge %
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingProduct.makingChargePercent}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        makingChargePercent: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Stone / Diamond ₹
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stonePrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stonePrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Final Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm font-bold text-burgundy-900"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-ivory-100 border border-gold-300/40">
                <span className="text-xs text-ink-700">
                  Live rate estimate:{" "}
                  <strong>
                    {formatINR(
                      calculatePriceBreakdown(editingProduct, draft.goldRates)
                        .calculatedTotal
                    )}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const est = calculatePriceBreakdown(
                      editingProduct,
                      draft.goldRates
                    ).calculatedTotal;
                    setEditingProduct({ ...editingProduct, price: est });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-burgundy-900 text-gold-100 text-xs font-semibold"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Apply Live Gold Rate Price
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Purity Label
                  </label>
                  <input
                    type="text"
                    value={editingProduct.purity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        purity: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.badge || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        badge: e.target.value,
                      })
                    }
                    placeholder="e.g., Bestseller, Bridal Pick"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-5 text-xs font-semibold text-ink-700">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        inStock: e.target.checked,
                      })
                    }
                    className="accent-burgundy-800"
                  />
                  In Stock
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        featured: e.target.checked,
                      })
                    }
                    className="accent-burgundy-800"
                  />
                  Featured on Home
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.bestseller}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        bestseller: e.target.checked,
                      })
                    }
                    className="accent-burgundy-800"
                  />
                  Bestseller
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-ivory-200">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-full border border-ivory-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveProduct(editingProduct)}
                  disabled={!editingProduct.name.trim()}
                  className="btn-luxury px-6 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold disabled:opacity-50"
                >
                  Save Jewellery Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COLLECTION EDITOR MODAL */}
      <AnimatePresence>
        {editingCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingCollection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                <h2 className="font-display text-2xl font-semibold text-burgundy-950">
                  Edit Collection
                </h2>
                <button
                  onClick={() => setEditingCollection(null)}
                  className="p-2 rounded-full hover:bg-ivory-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ImageUploader
                label="Collection Cover Image"
                value={editingCollection.image}
                onChange={(url) =>
                  setEditingCollection({ ...editingCollection, image: url })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    value={editingCollection.name}
                    onChange={(e) =>
                      setEditingCollection({
                        ...editingCollection,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={editingCollection.badge}
                    onChange={(e) =>
                      setEditingCollection({
                        ...editingCollection,
                        badge: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editingCollection.tagline}
                  onChange={(e) =>
                    setEditingCollection({
                      ...editingCollection,
                      tagline: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCollection.description}
                  onChange={(e) =>
                    setEditingCollection({
                      ...editingCollection,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-ivory-200">
                <button
                  onClick={() => setEditingCollection(null)}
                  className="px-5 py-2.5 rounded-full border border-ivory-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveCollection(editingCollection)}
                  disabled={!editingCollection.name.trim()}
                  className="btn-luxury px-6 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-xs font-semibold disabled:opacity-50"
                >
                  Save Collection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
