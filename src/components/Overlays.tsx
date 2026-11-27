"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Search,
  MessageCircle,
  Calendar,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";

export default function Overlays() {
  const {
    store,
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateCartQty,
    cartTotal,
    searchOpen,
    setSearchOpen,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    toasts,
  } = useStore();

  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.products.slice(0, 6);
    return store.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.gender.toLowerCase().includes(q) ||
        p.metal.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [query, store.products]);

  const handleWhatsAppCart = () => {
    const itemsText = cart
      .map((item) => {
        const p = store.products.find((prod) => prod.id === item.productId);
        if (!p) return "";
        return `• ${p.name} (${p.sku}) x${item.quantity} - ${formatINR(p.price * item.quantity)}`;
      })
      .filter(Boolean)
      .join("\n");

    const msg = encodeURIComponent(
      `Namaste Swarn Mahal Jewellers (Ambikapur)! I'm interested in these pieces from your website:\n\n${itemsText}\n\nEstimated Total: ${formatINR(cartTotal)}\n\nPlease share availability and showroom visit slots near Joda Pipal.`
    );
    window.open(
      `https://wa.me/${store.storeInfo.whatsapp}?text=${msg}`,
      "_blank"
    );
  };

  return (
    <>
      {/* 1. Cart Slide-over Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-ivory-50 z-50 shadow-2xl flex flex-col"
            >
              <div className="px-6 py-5 bg-burgundy-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-gold-300" />
                  <h2 className="font-display text-xl font-semibold">
                    Your Jewellery Bag
                  </h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-ivory-200 flex items-center justify-center mb-4">
                      <Sparkles className="w-7 h-7 text-gold-600" />
                    </div>
                    <p className="font-display text-2xl text-burgundy-900 font-semibold">
                      Your bag is empty
                    </p>
                    <p className="text-sm text-ink-500 mt-1 max-w-xs">
                      Explore our BIS hallmarked gold necklaces, rings, kadas, and diamonds.
                    </p>
                    <Link
                      href="/jewellery"
                      onClick={() => setCartOpen(false)}
                      className="mt-6 px-6 py-2.5 rounded-full bg-burgundy-900 text-gold-100 text-sm font-medium hover:bg-burgundy-800 transition-colors"
                    >
                      Browse Jewellery
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => {
                    const product = store.products.find(
                      (p) => p.id === item.productId
                    );
                    if (!product) return null;
                    return (
                      <div
                        key={item.productId}
                        className="flex gap-4 p-3.5 rounded-2xl bg-white border border-ivory-200 shadow-sm"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 rounded-xl object-cover bg-ivory-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/jewellery/${product.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="font-display text-base font-semibold text-ink-900 hover:text-burgundy-800 line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <p className="text-[11px] text-ink-500">
                            {product.purity} • {product.weightGrams}g
                          </p>
                          <p className="text-sm font-bold text-burgundy-900 mt-1">
                            {formatINR(product.price * item.quantity)}
                          </p>

                          <div className="mt-2.5 flex items-center justify-between">
                            <div className="inline-flex items-center border border-ivory-300 rounded-full overflow-hidden">
                              <button
                                onClick={() =>
                                  updateCartQty(product.id, item.quantity - 1)
                                }
                                className="px-2.5 py-1 hover:bg-ivory-200 text-ink-700"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateCartQty(product.id, item.quantity + 1)
                                }
                                className="px-2.5 py-1 hover:bg-ivory-200 text-ink-700"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="p-1.5 text-ink-500 hover:text-red-600 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-5 bg-white border-t border-ivory-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink-500">
                      Estimated Total (incl. GST)
                    </span>
                    <span className="font-display text-2xl font-bold text-burgundy-900">
                      {formatINR(cartTotal)}
                    </span>
                  </div>
                  <button
                    onClick={handleWhatsAppCart}
                    className="btn-luxury w-full py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Order / Reserve on WhatsApp
                  </button>
                  <Link
                    href="/contact"
                    onClick={() => setCartOpen(false)}
                    className="w-full py-3 rounded-full border border-burgundy-900/25 text-burgundy-900 hover:bg-ivory-100 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Showroom Viewing (Joda Pipal)
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-burgundy-950/60 backdrop-blur-md z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-ivory-50 rounded-3xl shadow-2xl border border-gold-300/50 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-ivory-200 bg-white">
                <Search className="w-5 h-5 text-gold-600" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search rings, men's kada, bridal haar, diamond..."
                  className="flex-1 bg-transparent text-sm sm:text-base text-ink-900 placeholder:text-ink-500 focus:outline-none"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 rounded-full hover:bg-ivory-200 text-ink-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 max-h-[65vh] overflow-y-auto">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600 font-semibold mb-3">
                  {query ? `Matches (${searchResults.length})` : "Popular Creations"}
                </p>

                {searchResults.length === 0 ? (
                  <p className="text-sm text-ink-500 py-8 text-center">
                    No matching jewellery found. Try searching &ldquo;Ring&rdquo;, &ldquo;Kada&rdquo;, or &ldquo;Bridal&rdquo;.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        href={`/jewellery/${p.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white hover:bg-ivory-100 border border-ivory-200 transition-colors"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-display text-sm font-semibold text-ink-900 truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-ink-500">
                            {p.gender} • {p.category} • {p.weightGrams}g
                          </p>
                          <p className="text-xs font-bold text-burgundy-900 mt-0.5">
                            {formatINR(p.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Quick View Product Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-ivory-50 rounded-3xl overflow-hidden shadow-2xl border border-gold-300/40 grid grid-cols-1 md:grid-cols-2"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-burgundy-900 hover:text-white flex items-center justify-center shadow-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-square bg-ivory-100">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-gold-600">
                    <span>{quickViewProduct.category}</span>
                    <span>•</span>
                    <span>{quickViewProduct.gender}</span>
                    <span>•</span>
                    <span>{quickViewProduct.sku}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-burgundy-950 mt-1.5">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-ink-500 mt-1">
                    {quickViewProduct.purity} • Gross Weight: {quickViewProduct.weightGrams}g
                  </p>

                  <div className="mt-4 flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold text-burgundy-900">
                      {formatINR(quickViewProduct.price)}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-sm text-ink-500 line-through">
                        {formatINR(quickViewProduct.originalPrice)}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm text-ink-700 leading-relaxed line-clamp-3">
                    {quickViewProduct.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-3 py-2 rounded-xl">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    BIS 916 HUID Certified • Available at Joda Pipal Showroom
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct.id);
                        setQuickViewProduct(null);
                        setCartOpen(true);
                      }}
                      className="btn-luxury flex-1 py-3 rounded-full bg-burgundy-900 text-gold-100 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-gold-300" />
                      Add to Bag
                    </button>
                    <button
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                      className={`px-4 rounded-full border transition-colors ${
                        isWishlisted(quickViewProduct.id)
                          ? "bg-burgundy-900 text-white border-burgundy-900"
                          : "border-ivory-300 text-ink-700 hover:border-burgundy-800"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted(quickViewProduct.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <Link
                    href={`/jewellery/${quickViewProduct.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="block w-full text-center py-2.5 rounded-full border border-gold-400/60 text-burgundy-900 hover:bg-gold-100/60 text-xs font-semibold transition-colors"
                  >
                    View Full Price Breakdown & Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-burgundy-950 text-gold-100 text-xs sm:text-sm font-medium shadow-xl border border-gold-400/35"
            >
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
