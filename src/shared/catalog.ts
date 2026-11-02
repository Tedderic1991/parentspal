import type { Venue } from "./types";

export const demoVenues: Venue[] = [
  {
    id: "sprout", name: "Sprout & Play", area: "Brossard",
    priceCents: 1800, icon: "🌱", minAge: 1, maxAge: 5,
    description: "A cozy sensory play space for little explorers.",
    window: "Weekdays, 9am–2pm", surchargeCents: 400, walkIn: true,
  },
  {
    id: "jump", name: "Jump Junction", area: "Saint-Hubert",
    priceCents: 2200, icon: "🛝", minAge: 2, maxAge: 8,
    description: "Big slides, climbing and energetic indoor fun.",
    window: "Weekdays, 10am–3pm", surchargeCents: 500, walkIn: false,
  },
  {
    id: "cloud", name: "Cloud Castle", area: "Brossard",
    priceCents: 2000, icon: "☁️", minAge: 1, maxAge: 7,
    description: "Soft-play castle and imaginative pretend zones.",
    window: "Mon–Thu, 9am–4pm", surchargeCents: 300, walkIn: true,
  },
  {
    id: "mini", name: "Mini Makers Club", area: "Longueuil",
    priceCents: 1600, icon: "🎨", minAge: 2, maxAge: 6,
    description: "Creative play, building corners and mini workshops.",
    window: "Tue–Fri, 9am–1pm", surchargeCents: 300, walkIn: false,
  },
  {
    id: "ninja", name: "Little Ninja Loft", area: "La Prairie",
    priceCents: 2400, icon: "🥷", minAge: 3, maxAge: 10,
    description: "A mini obstacle course for brave little movers.",
    window: "Weekdays, 11am–3pm", surchargeCents: 600, walkIn: false,
  },
];

export function venuePolicy(venue: Venue) {
  return venue.walkIn ? "Walk-in welcome" : "Advance booking required";
}
