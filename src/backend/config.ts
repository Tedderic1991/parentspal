export type BackendConfig =
  | { mode: "demo" }
  | { mode: "supabase"; url: string; publishableKey: string };

export function readBackendConfig(env: Record<string, string | undefined> = process.env): BackendConfig {
  const mode = env.PARENTSPAL_DATA_MODE ?? "demo";
  if (mode === "demo") return { mode };
  if (mode !== "supabase") throw new Error("PARENTSPAL_DATA_MODE must be demo or supabase.");
  const url = env.SUPABASE_URL?.trim();
  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !publishableKey) {
    throw new Error("Supabase mode requires SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.");
  }
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(parsed.hostname))) {
    throw new Error("Supabase URL must use HTTPS, or HTTP on localhost for local development.");
  }
  return { mode, url, publishableKey };
}
