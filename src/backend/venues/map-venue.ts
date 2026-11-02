import type { VenueRow } from "../supabase/database.types";
import type { Venue } from "@/shared/types";

export function mapVenue(row: VenueRow): Venue {
  return {
    id: row.id, name: row.name, area: row.area,
    priceCents: row.price_cents, icon: row.icon,
    minAge: row.min_age, maxAge: row.max_age,
    description: row.description, window: row.pass_window,
    surchargeCents: row.surcharge_cents, walkIn: row.walk_in,
  };
}
