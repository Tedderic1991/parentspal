import type { Locale, Quantities, Venue } from "./types";

export const MIN_ADMISSIONS = 3;

export function calculateBundle(venues: Venue[], quantities: Quantities) {
  let count = 0;
  let subtotalCents = 0;
  for (const venue of venues) {
    const quantity = quantities[venue.id] ?? 0;
    if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > 99) {
      throw new Error("Admission quantities must be integers between 0 and 99.");
    }
    count += quantity;
    subtotalCents += venue.priceCents * quantity;
  }
  const discountCents = Math.round(subtotalCents * 0.1);
  return {
    count, subtotalCents, discountCents,
    totalCents: subtotalCents - discountCents,
    meetsMinimum: count >= MIN_ADMISSIONS,
  };
}

export function money(cents: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency", currency: "CAD",
  }).format(cents / 100);
}

export const demoSlots = ["9:00 AM", "10:00 AM", "12:00 PM", "4:00 PM"];

export function visitSurcharge(venue: Venue, slot: string) {
  if (!demoSlots.includes(slot)) throw new Error("Unknown demo time slot.");
  return venue.walkIn || slot !== "4:00 PM" ? 0 : venue.surchargeCents;
}
