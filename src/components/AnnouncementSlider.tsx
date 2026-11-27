"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { AnnouncementItem } from "@/lib/types";

interface AnnouncementSliderProps {
  items: AnnouncementItem[];
  intervalSeconds?: number;
}

export default function AnnouncementSlider({
  items,
  intervalSeconds = 4,
}: AnnouncementSliderProps) {
  const activeItems = items.filter((item) => item.active && item.text.trim());
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const total = activeItems.length;

  const next = useCallback(() => {
    if (total <= 1) return;
    setDirection(1);
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total <= 1) return;
    setDirection(-1);
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (index >= total && total > 0) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const ms = Math.max(2, intervalSeconds) * 1000;
    const timer = setInterval(next, ms);
    return () => clearInterval(timer);
  }, [paused, total, intervalSeconds, next]);

  if (total === 0) return null;

  const current = activeItems[index] || activeItems[0];

  return (
    <div
      className="relative bg-gradient-to-r from-ivory-100 via-gold-100/60 to-ivory-100 border-y border-gold-300/50 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
        {/* Left Arrow */}
        {total > 1 ? (
          <button
            onClick={prev}
            aria-label="Previous announcement"
            className="w-7 h-7 rounded-full border border-gold-400/50 bg-white/70 hover:bg-burgundy-900 hover:text-gold-100 hover:border-burgundy-900 text-burgundy-900 flex items-center justify-center shrink-0 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-7 shrink-0" />
        )}

        {/* Sliding Announcement Viewport */}
        <div className="flex-1 min-w-0 relative min-h-[28px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center px-2"
            >
              {current.badge && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-burgundy-900 text-gold-200 text-[10px] font-bold uppercase tracking-[0.18em] shrink-0">
                  <Sparkles className="w-2.5 h-2.5 text-gold-300" />
                  {current.badge}
                </span>
              )}

              <p className="text-xs sm:text-[13px] font-medium text-burgundy-950 tracking-wide">
                {current.text}
              </p>

              {current.link && current.linkText && (
                <Link
                  href={current.link}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gold-600 hover:text-burgundy-900 underline underline-offset-4 transition-colors shrink-0"
                >
                  {current.linkText}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Controls: Dots + Next Arrow */}
        <div className="flex items-center gap-2 shrink-0">
          {total > 1 && (
            <div className="hidden md:flex items-center gap-1.5 mr-1">
              {activeItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setDirection(idx > index ? 1 : -1);
                    setIndex(idx);
                  }}
                  aria-label={`Announcement ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === index
                      ? "w-5 bg-burgundy-900"
                      : "w-1.5 bg-gold-400/60 hover:bg-gold-600"
                  }`}
                />
              ))}
            </div>
          )}

          {total > 1 && (
            <button
              onClick={next}
              aria-label="Next announcement"
              className="w-7 h-7 rounded-full border border-gold-400/50 bg-white/70 hover:bg-burgundy-900 hover:text-gold-100 hover:border-burgundy-900 text-burgundy-900 flex items-center justify-center shrink-0 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
