import type { DemoPass, Family, Quantities, Venue, Visit } from "@/shared/types";
import { calculateBundle } from "@/shared/pricing";
import { demoOptions } from "@/shared/options";

export interface DemoState {
  family: Family;
  quantities: Quantities;
  email: string;
  name: string;
  payment: string;
  pass: DemoPass | null;
  visit: Visit;
  confirmedVisit: (Visit & { walkIn: boolean }) | null;
}

export function initialState(venues: Venue[]): DemoState {
  return {
    family: { adults: demoOptions.family.defaultAdults, childAges: [...demoOptions.family.defaultChildAges], gift: false },
    quantities: Object.fromEntries(venues.map((venue, index) =>
      [venue.id, index < demoOptions.bundle.defaultVenueCount ? demoOptions.bundle.defaultQuantity : 0])),
    email: "", name: "", payment: demoOptions.defaultPaymentMethod, pass: null,
    visit: { venueId: "", date: "", slot: demoOptions.defaultVisitSlot }, confirmedVisit: null,
  };
}

export function validateFamily(family: Family): string | null {
  if (family.adults + family.childAges.length === 0) return "Please add at least one adult or child.";
  if (family.childAges.some(age =>
    age.trim() === "" || !Number.isInteger(Number(age))
    || Number(age) < demoOptions.family.minimumChildAge || Number(age) > demoOptions.family.maximumChildAge
  )) return `Please enter an age from ${demoOptions.family.minimumChildAge} to ${demoOptions.family.maximumChildAge} for each child.`;
  return null;
}

export function createDemoPass(state: DemoState, venues: Venue[], now: Date, id: string): DemoPass {
  const bundle = calculateBundle(venues, state.quantities);
  const familyError = validateFamily(state.family);
  if (familyError) throw new Error(familyError);
  if (!bundle.meetsMinimum) throw new Error(`Choose at least ${demoOptions.bundle.minimumAdmissions} admissions.`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) throw new Error("Please enter a valid email address.");
  return {
    id, purchasedAt: now.toISOString(),
    family: { ...state.family, childAges: [...state.family.childAges] },
    quantities: { ...state.quantities },
    email: state.email, name: state.name, totalCents: bundle.totalCents,
  };
}

export type DemoAction =
  | { type: "patch"; value: Partial<Omit<DemoState, "pass">> }
  | { type: "quantity"; venueId: string; delta: number }
  | { type: "purchase"; pass: DemoPass };

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "patch": return { ...state, ...action.value };
    case "quantity": return { ...state, quantities: {
      ...state.quantities,
      [action.venueId]: Math.min(demoOptions.bundle.maximumQuantity,
        Math.max(0, (state.quantities[action.venueId] ?? 0) + action.delta)),
    } };
    case "purchase": return {
      ...state, pass: action.pass, confirmedVisit: null,
      visit: { ...state.visit, venueId: Object.keys(action.pass.quantities)
        .find(id => action.pass.quantities[id] > 0) ?? "" },
    };
  }
}
