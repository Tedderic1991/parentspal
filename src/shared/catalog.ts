import type { Venue } from "./types";
import venues from "./data/venues.json";

export const demoVenues: Venue[] = venues;

export function venuePolicy(venue: Venue) {
  return venue.walkIn ? "Walk-in welcome" : "Advance booking required";
}
