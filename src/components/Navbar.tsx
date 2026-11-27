"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  Crown,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";

const CATEGORIES = [
  { name: "Rings", desc: "Solitaires, Bands & Signets", href: "/jewellery?category=Rings" },
  { name: "Bracelets", desc: "Tennis, Filigree & Royal Kadas", href: "/jewellery?category=Bracelets" },
  { name: "Necklaces", desc: "Bridal Haars & Chokers", href: "/jewellery?category=Necklaces" },
  { name: "Earrings", desc: "Jhumkas, Chandbalis & Studs", href: "/jewellery?category=Earrings" },
  { name: "Chains", desc: "Italian Franco & Classic Gold", href: "/jewellery?category=Chains" },
  { name: "Bangles", desc: "Antique Nakshi & Daily Wear", href: "/jewellery?category=Bangles" },
  { name: "Mangalsutra", desc: "Modern Diamond & Heritage", href: "/jewellery?category=Mangalsutra" },
  { name: "All Jewellery", desc: "Explore Complete Catalogue", href: "/jewellery" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { store, cartCount, wishlist, setCartOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { storeInfo, goldRates } = store;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const showLocation = storeInfo.topBarShowLocation ?? true;
  const showRates = storeInfo.topBarShowRates ?? true;
  const locationText =
    storeInfo.topBarLocationText?.trim() ||
    `${storeInfo.landmark}, ${storeInfo.city} • ${storeInfo.phone}`;
  const ratesLabel =
    storeInfo.topBarRatesLabel?.trim() || "Today's Live Rate (10g):";
  const activeAnnouncements = (storeInfo.announcements || []).filter(
    (a) => a.active && a.text.trim()
  );
  const tickerDuration = `${Math.max(10, storeInfo.topBarSpeedSeconds || 36)}s`;

  const renderTickerContent = (dupKey: string) => (
    <div
      key={dupKey}
      className="flex items-center shrink-0 gap-10 pr-10 text-[11px] sm:text-xs"
    >
      {showLocation && (
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-gold-100 hover:text-white transition-colors whitespace-nowrap"
        >
          <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span className="font-medium">{locationText}</span>
        </Link>
      )}

      {showRates && (
        <div className="inline-flex items-center gap-2.5 whitespace-nowrap font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="uppercase tracking-wider text-[10px] text-gold-300 font-semibold">
            {ratesLabel}
          </span>
          <span className="text-white">
            <strong className="text-gold-300">24K</strong>{" "}
            {formatINR(goldRates.gold24k)}
          </span>
          <span className="text-gold-500/50">|</span>
          <span className="text-white">
            <strong className="text-gold-300">22K</strong>{" "}
            {formatINR(goldRates.gold22k)}
          </span>
          <span className="text-gold-500/50">|</span>
          <span className="text-white">
            <strong className="text-gold-300">18K</strong>{" "}
            {formatINR(goldRates.gold18k)}
          </span>
          <span className="text-gold-500/50">|</span>
          <span className="text-white">
            <strong className="text-gold-300">Silver</strong>{" "}
            {formatINR(goldRates.silver)}
          </span>
        </div>
      )}

      {activeAnnouncements.map((ann) => (
        <div
          key={`${dupKey}-${ann.id}`}
          className="inline-flex items-center gap-2.5 whitespace-nowrap"
        >
          {ann.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5" />
              {ann.badge}
            </span>
          )}
          <span className="text-ivory-100">{ann.text}</span>
          {ann.link && ann.linkText && (
            <Link
              href={ann.link}
              className="text-gold-300 hover:text-white underline underline-offset-4 font-semibold"
            >
              {ann.linkText} →
            </Link>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Top Smooth Continuous Right-to-Left Auto-Sliding Bar */}
      <div className="ticker-container bg-burgundy-950 text-gold-100 border-b border-gold-500/25 relative z-50 overflow-hidden">
        <div className="ticker-mask h-10 flex items-center overflow-hidden">
          <div
            className="animate-marquee"
            style={{ "--ticker-duration": tickerDuration } as React.CSSProperties}
          >
            {renderTickerContent("track-a")}
            {renderTickerContent("track-b")}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-ivory-50/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(43,7,16,0.08)] border-b border-gold-300/30"
            : "bg-ivory-50 border-b border-ivory-200"
        }`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Menu & Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-ivory-200/70 text-burgundy-900 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/" className="group flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-800 to-burgundy-950 border border-gold-400/60 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Crown className="w-5 h-5 text-gold-300" />
                </div>
                <div className="leading-none">
                  <span className="block font-display text-xl sm:text-2xl font-bold tracking-wide text-burgundy-900">
                    {storeInfo.brandName.split(" ")[0]}{" "}
                    <span className="text-gold-600">
                      {storeInfo.brandName.split(" ").slice(1).join(" ")}
                    </span>
                  </span>
                  <span className="block text-[10px] tracking-[0.22em] uppercase text-ink-500 mt-0.5">
                    Ambikapur • Est. Heritage
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide text-ink-700">
              <Link
                href="/"
                className={`py-2 transition-colors relative hover:text-burgundy-800 ${
                  pathname === "/" ? "text-burgundy-800 font-semibold" : ""
                }`}
              >
                Home
                {pathname === "/" && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full"
                  />
                )}
              </Link>

              {/* Jewellery Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
              >
                <Link
                  href="/jewellery"
                  className={`py-2 inline-flex items-center gap-1 transition-colors hover:text-burgundy-800 ${
                    pathname === "/jewellery" ? "text-burgundy-800 font-semibold" : ""
                  }`}
                >
                  Jewellery
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      megaOpen ? "rotate-180 text-gold-600" : ""
                    }`}
                  />
                </Link>
              </div>

              <Link
                href="/jewellery?gender=Women"
                className="py-2 hover:text-burgundy-800 transition-colors"
              >
                Women
              </Link>
              <Link
                href="/jewellery?gender=Men"
                className="py-2 hover:text-burgundy-800 transition-colors"
              >
                Men
              </Link>
              <Link
                href="/collections"
                className={`py-2 transition-colors relative hover:text-burgundy-800 ${
                  pathname === "/collections" ? "text-burgundy-800 font-semibold" : ""
                }`}
              >
                Collections
              </Link>
              <Link
                href="/contact"
                className={`py-2 transition-colors relative hover:text-burgundy-800 ${
                  pathname === "/contact" ? "text-burgundy-800 font-semibold" : ""
                }`}
              >
                Showroom
              </Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-ivory-200/80 text-ink-700 hover:text-burgundy-800 transition-colors"
                aria-label="Search jewellery"
              >
                <Search className="w-[19px] h-[19px]" />
              </button>

              <Link
                href="/jewellery?wishlist=true"
                className="relative p-2.5 rounded-full hover:bg-ivory-200/80 text-ink-700 hover:text-burgundy-800 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-[19px] h-[19px]" />
                {wishlist.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-burgundy-800 text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-ivory-200/80 text-ink-700 hover:text-burgundy-800 transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-[19px] h-[19px]" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-500 text-burgundy-950 text-[10px] font-bold flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 ml-1 px-3.5 py-2 rounded-full border border-gold-400/60 bg-ivory-100 hover:bg-burgundy-900 hover:text-gold-100 hover:border-burgundy-900 text-burgundy-900 text-xs font-semibold transition-all duration-200"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="hidden lg:block absolute left-0 right-0 top-full bg-ivory-50/98 backdrop-blur-2xl border-b border-gold-300/40 shadow-2xl"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
                <div className="col-span-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600 font-semibold mb-4">
                    Shop By Category
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setMegaOpen(false)}
                        className="group p-2.5 rounded-xl hover:bg-ivory-200/70 transition-colors"
                      >
                        <p className="font-display text-base font-semibold text-burgundy-900 group-hover:text-gold-600 transition-colors">
                          {cat.name}
                        </p>
                        <p className="text-xs text-ink-500">{cat.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="col-span-3 border-l border-ivory-200 pl-6">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600 font-semibold mb-4">
                    Shop By Gender & Metal
                  </p>
                  <div className="space-y-2.5 text-sm">
                    <Link
                      href="/jewellery?gender=Women"
                      onClick={() => setMegaOpen(false)}
                      className="block py-1.5 text-ink-700 hover:text-burgundy-800 hover:translate-x-1 transition-all"
                    >
                      Women&apos;s Luxury Edit →
                    </Link>
                    <Link
                      href="/jewellery?gender=Men"
                      onClick={() => setMegaOpen(false)}
                      className="block py-1.5 text-ink-700 hover:text-burgundy-800 hover:translate-x-1 transition-all"
                    >
                      Men&apos;s Royal Studio →
                    </Link>
                    <Link
                      href="/jewellery?metal=22K%20Gold"
                      onClick={() => setMegaOpen(false)}
                      className="block py-1.5 text-ink-700 hover:text-burgundy-800 hover:translate-x-1 transition-all"
                    >
                      22K BIS Hallmarked Gold →
                    </Link>
                    <Link
                      href="/jewellery?metal=Diamond"
                      onClick={() => setMegaOpen(false)}
                      className="block py-1.5 text-ink-700 hover:text-burgundy-800 hover:translate-x-1 transition-all"
                    >
                      IGI Certified Diamonds →
                    </Link>
                  </div>
                </div>

                <div className="col-span-4">
                  <Link
                    href="/jewellery?collection=royal-bridal"
                    onClick={() => setMegaOpen(false)}
                    className="group relative block h-full min-h-[210px] rounded-2xl overflow-hidden shadow-md"
                  >
                    <img
                      src="/images/banner-bridal.jpg"
                      alt="Bridal Collection"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/90 via-burgundy-950/30 to-transparent p-5 flex flex-col justify-end">
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-gold-300 font-semibold">
                        <Sparkles className="w-3 h-3" /> Ambikapur Bridal Studio
                      </span>
                      <p className="font-display text-2xl text-white font-semibold mt-1">
                        Rajwada Wedding Edit
                      </p>
                      <span className="text-xs text-gold-200 mt-1 underline underline-offset-4">
                        Explore Trousseau →
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-ivory-50 z-50 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-5 bg-burgundy-950 text-white flex items-center justify-between">
                <div>
                  <p className="font-display text-xl font-bold text-gold-200">
                    {storeInfo.brandName}
                  </p>
                  <p className="text-[11px] text-gold-200/70">
                    {storeInfo.landmark}, Ambikapur
                  </p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 flex-1 overflow-y-auto space-y-6">
                <div className="space-y-1">
                  {[
                    { label: "Home", href: "/" },
                    { label: "All Jewellery", href: "/jewellery" },
                    { label: "Women's Collection", href: "/jewellery?gender=Women" },
                    { label: "Men's Royal Studio", href: "/jewellery?gender=Men" },
                    { label: "Curated Collections", href: "/collections" },
                    { label: "Ambikapur Showroom", href: "/contact" },
                    { label: "Admin Panel", href: "/admin" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-base font-medium text-ink-900 hover:bg-ivory-200/80 hover:text-burgundy-800 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-ivory-200 pt-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600 font-semibold mb-3 px-3">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.slice(0, 6).map((c) => (
                      <Link
                        key={c.name}
                        href={c.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2 rounded-lg bg-ivory-100 text-xs font-medium text-burgundy-900 hover:bg-gold-100"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-ivory-200 bg-ivory-100 flex items-center gap-2 text-xs text-ink-700">
                <ShieldCheck className="w-4 h-4 text-burgundy-800 shrink-0" />
                <span>100% BIS 916 HUID Hallmarked Purity</span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
