import { GoldRates, Product } from "./types";

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function calculatePriceBreakdown(product: Product, rates: GoldRates) {
  let ratePerGram = rates.gold22k / 10;
  if (product.metal === "18K Gold" || product.metal === "Rose Gold" || product.metal === "Diamond") {
    ratePerGram = rates.gold18k / 10;
  } else if (product.metal === "Silver") {
    ratePerGram = rates.silver / 10;
  } else if (product.metal === "Platinum") {
    ratePerGram = (rates.gold24k / 10) * 0.52;
  }

  const metalValue = Math.round(product.weightGrams * ratePerGram);
  const makingCharges = Math.round(
    metalValue * (product.makingChargePercent / 100)
  );
  const stoneValue = Math.round(product.stonePrice || 0);
  const subtotal = metalValue + makingCharges + stoneValue;
  const gst = Math.round(subtotal * ((product.gstPercent || 3) / 100));
  const calculatedTotal = subtotal + gst;

  return {
    ratePerGram: Math.round(ratePerGram),
    metalValue,
    makingCharges,
    stoneValue,
    subtotal,
    gst,
    calculatedTotal,
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
