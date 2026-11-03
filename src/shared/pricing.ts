import type { Locale, Quantities, Venue } from "./types";
import { demoOptions } from "./options";

export const MIN_ADMISSIONS = demoOptions.bundle.minimumAdmissions;

export function calculateBundle(venues: Venue[], quantities: Quantities) {
  let count = 0;
  let subtotalCents = 0;
  for (const venue of venues) {
    const quantity = quantities[venue.id] ?? 0;
    if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > demoOptions.bundle.maximumQuantity) {
      throw new Error(`Admission quantities must be integers between 0 and ${demoOptions.bundle.maximumQuantity}.`);
    }
    count += quantity;
    subtotalCents += venue.priceCents * quantity;
  }
  const discountCents = Math.round(subtotalCents * demoOptions.bundle.discountPercent / 100);
  return {
    count, subtotalCents, discountCents,
    totalCents: subtotalCents - discountCents,
    meetsMinimum: count >= MIN_ADMISSIONS,
  };
}

export function money(cents: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency", currency: demoOptions.currency,
  }).format(cents / 100);
}

export function visitSurcharge(venue: Venue, slot: string) {
  const option = demoOptions.visitSlots.find(option => option.time === slot);
  if (!option) throw new Error("Unknown demo time slot.");
  return venue.walkIn || !option.outsideWindow ? 0 : venue.surchargeCents;
}
