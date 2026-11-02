import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { BackendConfig } from "../config";
import type { Database } from "./database.types";

export function createCatalogClient(config: Extract<BackendConfig, { mode: "supabase" }>) {
  return createClient<Database>(config.url, config.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
