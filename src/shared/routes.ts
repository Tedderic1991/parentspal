import type { Venue } from "./types";

export const screenPaths = {
  home: "/",
  family: "/pass/family/",
  select: "/pass/venues/",
  review: "/pass/review/",
  checkout: "/checkout/",
  purchased: "/purchase/confirmation/",
  account: "/account/",
  passes: "/passes/",
  booking: "/visits/plan/",
  walkin: "/visits/walk-in/",
  booked: "/visits/confirmation/",
} as const;

export type Screen = keyof typeof screenPaths | "detail";
export type PageRoute = { screen: keyof typeof screenPaths } | { screen: "detail"; venueId: string };

export function venuePath(venue: Venue): string {
  const slug = venue.name.normalize("NFKD").replace(/\p{Diacritic}/gu, "")
    .toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) throw new Error("Venue names must produce a nonempty URL slug.");
  return `/venues/${slug}/`;
}

export function pagePaths(venues: Venue[]): string[] {
  const paths = [...Object.values(screenPaths), ...venues.map(venuePath)];
  if (new Set(paths).size !== paths.length) throw new Error("Venue URL slugs must be unique.");
  return paths;
}

export function resolveRoute(segments: string[] | undefined, venues: Venue[]): PageRoute | null {
  const path = `/${segments?.length ? `${segments.join("/")}/` : ""}`;
  for (const [screen, href] of Object.entries(screenPaths)) {
    if (href === path) return { screen: screen as keyof typeof screenPaths };
  }
  const matches = venues.filter(venue => venuePath(venue) === path);
  if (matches.length > 1) throw new Error("Venue URL slugs must be unique.");
  return matches.length ? { screen: "detail", venueId: matches[0].id } : null;
}
