import "server-only";
import { demoVenues } from "@/shared/catalog";
import type { DataMode, Venue } from "@/shared/types";
import { readBackendConfig } from "../config";
import { createCatalogClient } from "../supabase/client";
import { mapVenue } from "./map-venue";

export async function getVenueCatalog(): Promise<{ venues: Venue[]; mode: DataMode }> {
  const config = readBackendConfig();
  if (config.mode === "demo") return { venues: demoVenues, mode: "demo" };
  const { data, error } = await createCatalogClient(config)
    .from("venues").select("*").eq("published", true).order("sort_order").order("id");
  if (error) throw new Error("Unable to load the Supabase venue catalog.", { cause: error });
  if (!data?.length) throw new Error("Supabase catalog is empty. Apply the migrations and seed data.");
  return { venues: data.map(mapVenue), mode: "supabase" };
}
