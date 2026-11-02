import { describe, expect, it } from "vitest";
import { readBackendConfig } from "./config";

describe("backend configuration", () => {
  it("runs explicitly in demo mode without keys or a network connection", () => {
    expect(readBackendConfig({})).toEqual({ mode: "demo" });
    expect(readBackendConfig({ PARENTSPAL_DATA_MODE: "demo", SUPABASE_URL: "bad" })).toEqual({ mode: "demo" });
  });
  it("reports missing keys and invalid modes rather than silently reverting to demo", () => {
    expect(() => readBackendConfig({ PARENTSPAL_DATA_MODE: "supabase" })).toThrow("requires");
    expect(() => readBackendConfig({ PARENTSPAL_DATA_MODE: "typo" })).toThrow("demo or supabase");
  });
  it("accepts hosted HTTPS and local HTTP but refuses remote plaintext connections", () => {
    const env = { PARENTSPAL_DATA_MODE: "supabase", SUPABASE_PUBLISHABLE_KEY: "public-test-key" };
    expect(readBackendConfig({ ...env, SUPABASE_URL: "https://example.supabase.co" }).mode).toBe("supabase");
    expect(readBackendConfig({ ...env, SUPABASE_URL: "http://127.0.0.1:54321" }).mode).toBe("supabase");
    expect(() => readBackendConfig({ ...env, SUPABASE_URL: "http://example.com" })).toThrow("HTTPS");
  });
});
