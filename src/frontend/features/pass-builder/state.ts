import type { DemoPass, Family, Quantities, Venue, Visit } from "@/shared/types";
import { calculateBundle } from "@/shared/pricing";

export type Screen = "home" | "detail" | "family" | "select" | "review" | "checkout"
  | "purchased" | "account" | "passes" | "booking" | "walkin" | "booked";

export interface DemoState {
  screen: Screen;
  detailId: string;
  family: Family;
  quantities: Quantities;
  email: string;
  name: string;
  payment: string;
  pass: DemoPass | null;
  visit: Visit;
}

export function initialState(venues: Venue[]): DemoState {
  return {
    screen: "home", detailId: venues[0]?.id ?? "",
    family: { adults: 2, childAges: ["2"], gift: false },
    quantities: Object.fromEntries(venues.map((venue, index) => [venue.id, index < 3 ? 1 : 0])),
    email: "", name: "", payment: "Apple Pay", pass: null,
    visit: { venueId: "", date: "", slot: "10:00 AM" },
  };
}

export function validateFamily(family: Family): string | null {
  if (family.adults + family.childAges.length === 0) return "Please add at least one adult or child.";
  if (family.childAges.some(age =>
    age.trim() === "" || !Number.isInteger(Number(age)) || Number(age) < 0 || Number(age) > 17
  )) return "Please enter an age from 0 to 17 for each child.";
  return null;
}

export function createDemoPass(state: DemoState, venues: Venue[], now: Date, id: string): DemoPass {
  const bundle = calculateBundle(venues, state.quantities);
  const familyError = validateFamily(state.family);
  if (familyError) throw new Error(familyError);
  if (!bundle.meetsMinimum) throw new Error("Choose at least 3 admissions.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) throw new Error("Please enter a valid email address.");
  return {
    id, purchasedAt: now.toISOString(),
    family: { ...state.family, childAges: [...state.family.childAges] },
    quantities: { ...state.quantities },
    email: state.email, name: state.name, totalCents: bundle.totalCents,
  };
}

export type DemoAction =
  | { type: "navigate"; screen: Screen }
  | { type: "patch"; value: Partial<Omit<DemoState, "pass">> }
  | { type: "quantity"; venueId: string; delta: number }
  | { type: "purchase"; pass: DemoPass };

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "navigate": return { ...state, screen: action.screen };
    case "patch": return { ...state, ...action.value };
    case "quantity": return { ...state, quantities: {
      ...state.quantities,
      [action.venueId]: Math.min(99, Math.max(0, (state.quantities[action.venueId] ?? 0) + action.delta)),
    } };
    case "purchase": return {
      ...state, pass: action.pass, screen: "purchased",
      visit: { ...state.visit, venueId: Object.keys(action.pass.quantities)
        .find(id => action.pass.quantities[id] > 0) ?? "" },
    };
  }
}
