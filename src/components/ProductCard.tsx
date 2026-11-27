"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, ShieldCheck } from "lucide-react";
import { Product } from "@/lib/types";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } =
    useStore();
  const liked = isWishlisted(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
      className="group relative bg-white rounded-2xl border border-ivory-200/90 overflow-hidden shadow-[0_6px_24px_rgba(43,7,16,0.04)] hover:shadow-[0_20px_48px_rgba(92,22,37,0.12)] hover:border-gold-300/70 transition-all duration-400 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-ivory-100">
        <Link href={`/jewellery/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Subtle gradient bottom sheen on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-burgundy-950/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full bg-burgundy-900/90 backdrop-blur-sm text-gold-200 text-[10px] font-semibold uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          <span className="w-fit px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-ink-700 text-[10px] font-semibold border border-ivory-200">
            {product.gender}
          </span>
        </div>

        {/* Top Right Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={() => toggleWishlist(product.id)}
            aria-label="Toggle wishlist"
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm transition-all ${
              liked
                ? "bg-burgundy-800 text-white"
                : "bg-white/90 text-ink-700 hover:bg-burgundy-900 hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setQuickViewProduct(product)}
            aria-label="Quick view"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-ink-700 hover:bg-gold-500 hover:text-burgundy-950 flex items-center justify-center shadow-sm transition-all sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 duration-300"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Quick Add Slide-Up Bar */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => addToCart(product.id)}
            disabled={!product.inStock}
            className="w-full py-2.5 px-4 rounded-xl bg-burgundy-900/95 hover:bg-burgundy-800 text-gold-100 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-gold-300" />
            {product.inStock ? "Add to Jewellery Bag" : "Made to Order"}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-[11px] text-ink-500 mb-1">
          <span className="uppercase tracking-wider font-medium text-gold-600">
            {product.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            {product.weightGrams}g
          </span>
        </div>

        <Link
          href={`/jewellery/${product.slug}`}
          className="font-display text-lg font-semibold text-ink-900 group-hover:text-burgundy-800 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <p className="text-xs text-ink-500 mt-0.5 line-clamp-1">
          {product.purity}
        </p>

        <div className="mt-auto pt-3 flex items-baseline justify-between border-t border-ivory-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-burgundy-900">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-ink-500 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
          <Link
            href={`/jewellery/${product.slug}`}
            className="text-[11px] font-semibold text-gold-600 hover:text-burgundy-800 transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
