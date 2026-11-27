"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  ChevronDown,
  MapPin,
  ArrowLeft,
  Check,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { calculatePriceBreakdown, formatINR } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

const RING_SIZES = ["12", "14", "16", "18", "20", "22"];
const WRIST_SIZES = ["2.4", "2.6", "2.8", "Adjustable"];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const { store, addToCart, toggleWishlist, isWishlisted, setCartOpen } =
    useStore();

  const product = useMemo(
    () => store.products.find((p) => p.slug === slug),
    [store.products, slug]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [showBreakdown, setShowBreakdown] = useState(true);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-ivory-50">
        <Sparkles className="w-10 h-10 text-gold-500 mb-3" />
        <h1 className="font-display text-3xl font-semibold text-burgundy-950">
          Creation Not Found
        </h1>
        <p className="text-sm text-ink-500 mt-2">
          This piece may have been updated or moved in our showroom catalogue.
        </p>
        <Link
          href="/jewellery"
          className="mt-6 px-6 py-3 rounded-full bg-burgundy-900 text-gold-100 text-sm font-semibold"
        >
          Back to Jewellery Catalogue
        </Link>
      </div>
    );
  }

  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];
  const liked = isWishlisted(product.id);
  const breakdown = calculatePriceBreakdown(product, store.goldRates);

  const sizeOptions =
    product.category === "Rings"
      ? RING_SIZES
      : product.category === "Bracelets" || product.category === "Bangles"
      ? WRIST_SIZES
      : null;

  const relatedProducts = store.products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.gender === product.gender)
    )
    .slice(0, 4);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Namaste Swarn Mahal Jewellers (Near Joda Pipal, Ambikapur)! I would like to inquire about:\n\n• ${product.name}\n• SKU: ${product.sku}\n• Weight: ${product.weightGrams}g (${product.purity})\n• Listed Price: ${formatINR(product.price)}\n${sizeOptions ? `• Preferred Size: ${selectedSize}\n` : ""}\nPlease confirm showroom availability.`
    );
    window.open(
      `https://wa.me/${store.storeInfo.whatsapp}?text=${text}`,
      "_blank"
    );
  };

  return (
    <div className="bg-ivory-50 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-4 flex items-center justify-between text-xs text-ink-500">
        <Link
          href="/jewellery"
          className="inline-flex items-center gap-1.5 hover:text-burgundy-800 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalogue
        </Link>
        <div className="flex items-center gap-1.5">
          <span>{product.gender}</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-burgundy-900 font-semibold">{product.sku}</span>
        </div>
      </div>

      {/* Product Main Layout */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Luxury Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-ivory-200 shadow-lg group">
            <AnimatePresence mode="wait">
              <motion.img
                key={gallery[activeImage]}
                src={gallery[activeImage] || product.image}
                alt={product.name}
                initial={{ opacity: 0.4, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.4 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 cursor-zoom-in"
              />
            </AnimatePresence>

            {product.badge && (
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-burgundy-950/90 text-gold-200 text-[11px] uppercase tracking-widest font-semibold shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === idx
                      ? "border-burgundy-800 shadow-md scale-105"
                      : "border-ivory-200 opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-gold-600">
            <span>{product.metal}</span>
            <span>•</span>
            <span>{product.gender}</span>
            <span>•</span>
            <span>SKU {product.sku}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-burgundy-950 mt-2 leading-tight">
            {product.name}
          </h1>

          <p className="text-sm text-ink-500 mt-2">
            {product.purity} • Gross Weight:{" "}
            <strong className="text-ink-900">{product.weightGrams}g</strong>
          </p>

          {/* Price Block */}
          <div className="mt-6 p-5 rounded-2xl bg-white border border-gold-300/50 shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-burgundy-900">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-ink-500 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    Save {formatINR(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-ink-500 mt-1">
              Inclusive of all taxes (GST {product.gstPercent}%) • Transparent
              Swarn Mahal Ambikapur Billing
            </p>
          </div>

          {/* Size Selector if applicable */}
          {sizeOptions && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-ink-700">
                  Select Size
                </span>
                <span className="text-xs text-gold-600">
                  Complimentary sizing at showroom
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === sz
                        ? "bg-burgundy-900 text-gold-100 border-burgundy-900 shadow-sm"
                        : "bg-white text-ink-700 border-ivory-300 hover:border-gold-500"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="mt-7 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToCart(product.id, selectedSize);
                  setCartOpen(true);
                }}
                className="btn-luxury flex-1 py-4 px-6 rounded-full bg-burgundy-900 text-gold-100 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-gold-300" />
                Add to Jewellery Bag
              </button>

              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => toggleWishlist(product.id)}
                className={`px-5 rounded-full border flex items-center justify-center transition-colors ${
                  liked
                    ? "bg-burgundy-900 text-white border-burgundy-900"
                    : "bg-white text-ink-700 border-ivory-300 hover:border-burgundy-800"
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleWhatsApp}
                className="py-3.5 px-5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Inquire on WhatsApp
              </button>

              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="py-3.5 px-5 rounded-full border border-gold-500/60 bg-ivory-100 hover:bg-gold-100 text-burgundy-950 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4 text-gold-600" />
                Book Try-On at Store
              </Link>
            </div>
          </div>

          {/* Description & Highlights */}
          <div className="mt-7 space-y-4">
            <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
              {product.description}
            </p>

            {product.highlights && product.highlights.length > 0 && (
              <ul className="space-y-2">
                {product.highlights.map((hl, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-ink-700"
                  >
                    <Check className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tanishq-style Transparent Price Breakdown Accordion */}
          <div className="mt-7 rounded-2xl bg-white border border-ivory-200 overflow-hidden">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-ivory-50 transition-colors"
            >
              <div>
                <p className="font-display text-lg font-semibold text-burgundy-950">
                  Live Price Breakdown
                </p>
                <p className="text-[11px] text-ink-500">
                  Calculated with today&apos;s Ambikapur showroom metal rate
                </p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gold-600 transition-transform ${
                  showBreakdown ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-ivory-200"
                >
                  <div className="p-5 space-y-2.5 text-sm">
                    <div className="flex justify-between text-ink-700">
                      <span>
                        Metal Value ({product.weightGrams}g ×{" "}
                        {formatINR(breakdown.ratePerGram)}/g)
                      </span>
                      <span className="font-medium">
                        {formatINR(breakdown.metalValue)}
                      </span>
                    </div>
                    {breakdown.stoneValue > 0 && (
                      <div className="flex justify-between text-ink-700">
                        <span>Certified Diamonds / Gemstones</span>
                        <span className="font-medium">
                          {formatINR(breakdown.stoneValue)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-ink-700">
                      <span>Making Charges ({product.makingChargePercent}%)</span>
                      <span className="font-medium">
                        {formatINR(breakdown.makingCharges)}
                      </span>
                    </div>
                    <div className="flex justify-between text-ink-700">
                      <span>GST ({product.gstPercent}%)</span>
                      <span className="font-medium">
                        {formatINR(breakdown.gst)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-ivory-200 flex justify-between font-bold text-burgundy-950 text-base">
                      <span>Estimated Live Value</span>
                      <span>{formatINR(breakdown.calculatedTotal)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Showroom Trust Card */}
          <div className="mt-5 p-4 rounded-2xl bg-ivory-100 border border-gold-300/40 flex items-start gap-3 text-xs text-ink-700">
            <ShieldCheck className="w-5 h-5 text-burgundy-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-burgundy-950">
                Available at Swarn Mahal Showroom, Ambikapur
              </p>
              <p className="mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold-600" />
                {store.storeInfo.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Creations */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 mt-18">
          <h2 className="font-display text-3xl font-semibold text-burgundy-950 mb-7">
            You May Also Adore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
