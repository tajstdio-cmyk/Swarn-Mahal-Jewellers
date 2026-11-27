"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Crown,
  MessageCircle,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";

export default function Footer() {
  const pathname = usePathname();
  const { store } = useStore();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const { storeInfo, goldRates } = store;

  return (
    <footer className="bg-burgundy-950 text-ivory-100 border-t border-gold-500/25 relative overflow-hidden">
      {/* Decorative subtle glow */}
      <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gold-400/15">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-400/25 to-burgundy-800 border border-gold-400/50 flex items-center justify-center">
                <Crown className="w-5 h-5 text-gold-300" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-gold-200 tracking-wide">
                  {storeInfo.brandName}
                </h2>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold-300/70">
                  {storeInfo.city}
                </p>
              </div>
            </div>

            <p className="text-sm text-ivory-200/80 leading-relaxed max-w-sm">
              Celebrating {storeInfo.heritageYears} years of trust in Ambikapur.
              Discover BIS 916 HUID hallmarked gold, bridal Polki, IGI-certified
              solitaires, and royal men&apos;s jewellery crafted to perfection.
            </p>

            {/* Live Gold Rate Card */}
            <div className="p-4 rounded-2xl bg-burgundy-900/70 border border-gold-400/25">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold-300 font-semibold mb-2">
                Ambikapur Live Gold Rate (10g)
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-ivory-200/60 block">24K Pure</span>
                  <span className="font-semibold text-white">
                    {formatINR(goldRates.gold24k)}
                  </span>
                </div>
                <div>
                  <span className="text-ivory-200/60 block">22K (916)</span>
                  <span className="font-semibold text-gold-300">
                    {formatINR(goldRates.gold22k)}
                  </span>
                </div>
                <div>
                  <span className="text-ivory-200/60 block">18K Gold</span>
                  <span className="font-semibold text-white">
                    {formatINR(goldRates.gold18k)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display text-lg font-semibold text-gold-200">
              Jewellery
            </h3>
            <ul className="space-y-2.5 text-sm text-ivory-200/75">
              {[
                ["Rings", "/jewellery?category=Rings"],
                ["Bracelets & Kadas", "/jewellery?category=Bracelets"],
                ["Bridal Necklaces", "/jewellery?category=Necklaces"],
                ["Jhumka Earrings", "/jewellery?category=Earrings"],
                ["Men's Chains", "/jewellery?category=Chains"],
                ["Mangalsutra", "/jewellery?category=Mangalsutra"],
                ["Bangles", "/jewellery?category=Bangles"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-gold-300 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop By */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display text-lg font-semibold text-gold-200">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-ivory-200/75">
              <li>
                <Link href="/jewellery?gender=Women" className="hover:text-gold-300 transition-colors">
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/jewellery?gender=Men" className="hover:text-gold-300 transition-colors">
                  Men&apos;s Royal Studio
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-gold-300 transition-colors">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link href="/jewellery?metal=Diamond" className="hover:text-gold-300 transition-colors">
                  Certified Diamonds
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Book Private Visit
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-gold-300 hover:text-white transition-colors pt-1"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Store Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Location */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display text-lg font-semibold text-gold-200">
              Flagship Showroom
            </h3>
            <div className="space-y-3 text-sm text-ivory-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={`tel:${storeInfo.phone.replace(/\s+/g, "")}`}
                  className="hover:text-gold-300 transition-colors"
                >
                  {storeInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="hover:text-gold-300 transition-colors"
                >
                  {storeInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{storeInfo.timings}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <a
                href={`https://wa.me/${storeInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Concierge
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeInfo.mapEmbedQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gold-400/40 hover:bg-gold-400/15 text-gold-200 text-xs font-semibold transition-colors"
              >
                Directions <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory-200/60">
          <p>
            © {new Date().getFullYear()} {storeInfo.brandName}, Ambikapur. All
            rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gold-300/80">
            <ShieldCheck className="w-4 h-4" />
            <span>BIS 916 HUID Hallmarked • IGI Certified Diamonds</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
