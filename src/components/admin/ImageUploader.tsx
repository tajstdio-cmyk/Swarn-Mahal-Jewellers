"use client";

import React, { useRef, useState } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";

const PRESET_IMAGES = [
  { label: "Bridal Banner", url: "/images/banner-bridal.jpg" },
  { label: "Diamond Banner", url: "/images/banner-diamond.jpg" },
  { label: "Men's Banner", url: "/images/banner-mens.jpg" },
  { label: "Temple Necklace", url: "/images/prod-necklace.jpg" },
  { label: "Women's Ring", url: "/images/prod-ring-women.jpg" },
  { label: "Women's Bracelet", url: "/images/prod-bracelet-women.jpg" },
  { label: "Gold Jhumkas", url: "/images/prod-earrings.jpg" },
  { label: "Men's Ring", url: "/images/prod-ring-men.jpg" },
  { label: "Men's Kada", url: "/images/prod-bracelet-men.jpg" },
  { label: "Men's Chain", url: "/images/prod-chain-men.jpg" },
  { label: "Mangalsutra", url: "/images/prod-mangalsutra.jpg" },
];

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data.url) onChange(data.url);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="w-24 h-16 rounded-xl overflow-hidden bg-ivory-100 border border-ivory-300 shrink-0 flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-ink-500" />
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... or https://..."
            className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold-500"
          />

          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-burgundy-900 text-gold-100 text-xs font-semibold hover:bg-burgundy-800 disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              {uploading ? "Uploading..." : "Upload Image"}
            </button>

            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ivory-300 bg-white hover:bg-ivory-100 text-ink-700 text-xs font-semibold"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {showPresets ? "Hide Studio Presets" : "Choose Studio Preset"}
            </button>
          </div>
        </div>
      </div>

      {showPresets && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
          {PRESET_IMAGES.map((preset) => (
            <button
              key={preset.url}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setShowPresets(false);
              }}
              className={`group rounded-xl overflow-hidden border-2 text-left transition-all ${
                value === preset.url
                  ? "border-burgundy-800 ring-2 ring-gold-400"
                  : "border-ivory-200 hover:border-gold-400"
              }`}
            >
              <img
                src={preset.url}
                alt={preset.label}
                className="w-full h-12 object-cover"
              />
              <span className="block px-1.5 py-1 text-[10px] truncate bg-white text-ink-700">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
