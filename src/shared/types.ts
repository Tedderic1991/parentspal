export type Locale = "en" | "fr";
export type DataMode = "demo" | "supabase";

export interface Venue {
  id: string;
  name: string;
  area: string;
  priceCents: number;
  icon: string;
  minAge: number;
  maxAge: number;
  description: string;
  window: string;
  surchargeCents: number;
  walkIn: boolean;
}

export type Quantities = Record<string, number>;

export interface Family {
  adults: number;
  childAges: string[];
  gift: boolean;
}

export interface DemoPass {
  id: string;
  purchasedAt: string;
  family: Family;
  quantities: Quantities;
  email: string;
  name: string;
  totalCents: number;
}

export interface Visit {
  venueId: string;
  date: string;
  slot: string;
}
