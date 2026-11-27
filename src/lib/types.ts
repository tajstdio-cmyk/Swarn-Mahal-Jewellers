export type Gender = "Women" | "Men" | "Unisex";

export type Category =
  | "Rings"
  | "Bracelets"
  | "Necklaces"
  | "Earrings"
  | "Bangles"
  | "Chains"
  | "Mangalsutra"
  | "Pendants";

export type MetalType =
  | "22K Gold"
  | "18K Gold"
  | "Diamond"
  | "Rose Gold"
  | "Platinum"
  | "Silver";

export interface AnnouncementItem {
  id: string;
  badge: string;
  text: string;
  link?: string;
  linkText?: string;
  active: boolean;
}

export interface StoreInfo {
  brandName: string;
  tagline: string;
  announcement: string;
  announcements: AnnouncementItem[];
  announcementIntervalSeconds: number;
  topBarSpeedSeconds?: number;
  topBarShowLocation?: boolean;
  topBarLocationText?: string;
  topBarShowRates?: boolean;
  topBarRatesLabel?: string;
  address: string;
  landmark: string;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  timings: string;
  mapEmbedQuery: string;
  heritageYears: string;
  happyFamilies: string;
  adminPin: string;
}

export interface GoldRates {
  gold24k: number; // per 10g in INR
  gold22k: number; // per 10g in INR
  gold18k: number; // per 10g in INR
  silver: number;  // per 10g in INR
  updatedAt: string;
}

export interface HeroBanner {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  theme: "maroon" | "champagne" | "obsidian";
  active: boolean;
  order: number;
}

export interface CollectionItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  badge: string;
  featured: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: Category;
  gender: Gender;
  metal: MetalType;
  purity: string;
  weightGrams: number;
  makingChargePercent: number;
  gstPercent: number;
  stonePrice: number;
  price: number;
  originalPrice?: number;
  collectionSlug: string;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  badge?: string;
  inStock: boolean;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
}

export interface Inquiry {
  id: string;
  type: "appointment" | "product_inquiry" | "custom_order" | "contact";
  name: string;
  phone: string;
  email?: string;
  preferredDate?: string;
  productName?: string;
  message: string;
  status: "new" | "contacted" | "completed";
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  occasion: string;
}

export interface StoreDatabase {
  storeInfo: StoreInfo;
  goldRates: GoldRates;
  banners: HeroBanner[];
  collections: CollectionItem[];
  products: Product[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
}
