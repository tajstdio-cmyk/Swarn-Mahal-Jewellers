"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { HeroBanner } from "@/lib/types";

interface HeroSliderProps {
  banners: HeroBanner[];
}

const SLIDE_DURATION = 6500;

export default function HeroSlider({ banners }: HeroSliderProps) {
  const activeBanners = banners
    .filter((b) => b.active)
    .sort((a, b) => a.order - b.order);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = activeBanners.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (current >= total && total > 0) {
      setCurrent(0);
    }
  }, [total, current]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [paused, total, nextSlide]);

  if (total === 0) return null;

  const slide = activeBanners[current] || activeBanners[0];

  const themeOverlay: Record<HeroBanner["theme"], string> = {
    maroon:
      "from-burgundy-950/92 via-burgundy-950/55 to-burgundy-950/15",
    champagne:
      "from-ink-900/85 via-ink-900/45 to-transparent",
    obsidian:
      "from-[#120d0b]/92 via-[#1a120e]/60 to-transparent",
  };

  return (
    <section
      className="relative w-full h-[560px] sm:h-[620px] lg:h-[680px] overflow-hidden bg-burgundy-950 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Ken Burns animated background photo */}
          <motion.img
            src={slide.image}
            alt={slide.title}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 7, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Luxury Editorial Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${themeOverlay[slide.theme]}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />

          {/* Content Container */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 flex items-center">
            <div className="max-w-xl lg:max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.55 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/15 border border-gold-300/40 backdrop-blur-md text-gold-200 text-[11px] uppercase tracking-[0.24em] font-semibold mb-5"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                {slide.badge}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.65 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.08] tracking-tight drop-shadow-sm"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.6 }}
                className="mt-5 text-sm sm:text-base lg:text-lg text-ivory-100/90 leading-relaxed max-w-lg"
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.55 }}
                className="mt-8 flex flex-wrap items-center gap-3.5"
              >
                <Link
                  href={slide.ctaLink || "/jewellery"}
                  className="btn-luxury inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-burgundy-950 font-semibold text-sm tracking-wide shadow-lg"
                >
                  {slide.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {slide.secondaryCtaText && (
                  <Link
                    href={slide.secondaryCtaLink || "/contact"}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/35 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 text-sm font-medium transition-all"
                  >
                    {slide.secondaryCtaText}
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous banner"
            className="hidden sm:flex absolute left-4 lg:left-7 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-burgundy-900/85 border border-white/25 backdrop-blur-md text-white items-center justify-center transition-all hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next banner"
            className="hidden sm:flex absolute right-4 lg:right-7 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-burgundy-900/85 border border-white/25 backdrop-blur-md text-white items-center justify-center transition-all hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Bottom Slide Progress Bars & Mini Thumbnails */}
      {total > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              {activeBanners.map((b, idx) => {
                const isActive = idx === current;
                return (
                  <button
                    key={b.id}
                    onClick={() => setCurrent(idx)}
                    className="group text-left focus:outline-none"
                    aria-label={`Go to slide ${idx + 1}: ${b.badge}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] tracking-[0.18em] uppercase font-semibold transition-colors ${
                          isActive ? "text-gold-300" : "text-white/55 group-hover:text-white/80"
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span
                        className={`hidden md:inline text-[11px] truncate max-w-[130px] transition-colors ${
                          isActive ? "text-white font-medium" : "text-white/50 group-hover:text-white/75"
                        }`}
                      >
                        {b.badge}
                      </span>
                    </div>
                    <div className="w-16 sm:w-28 md:w-36 h-[3px] rounded-full bg-white/25 overflow-hidden">
                      {isActive ? (
                        <motion.div
                          key={`${slide.id}-${paused ? "paused" : "run"}`}
                          initial={{ width: "0%" }}
                          animate={{ width: paused ? "50%" : "100%" }}
                          transition={{
                            duration: paused ? 0.2 : SLIDE_DURATION / 1000,
                            ease: "linear",
                          }}
                          className="h-full bg-gradient-to-r from-gold-300 to-gold-500 rounded-full"
                        />
                      ) : (
                        <div className="h-full w-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/75 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <span>BIS 916 Certified</span>
              <span className="text-gold-400">•</span>
              <span>Joda Pipal, Ambikapur</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
