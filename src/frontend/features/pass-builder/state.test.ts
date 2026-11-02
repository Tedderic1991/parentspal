import { describe, expect, it } from "vitest";
import { demoVenues } from "@/shared/catalog";
import { createDemoPass, demoReducer, initialState, validateFamily } from "./state";

describe("demo pass lifecycle", () => {
  it("does not fabricate a pass before purchase", () => {
    expect(initialState(demoVenues).pass).toBeNull();
  });
  it("keeps a purchased snapshot intact while editing another bundle", () => {
    const state = initialState(demoVenues);
    state.email = "parent@example.com";
    const pass = createDemoPass(state, demoVenues, new Date("2026-11-02T12:00:00Z"), "PP-DEMO-TEST");
    const purchased = demoReducer(state, { type: "purchase", pass });
    const edited = demoReducer(purchased, { type: "quantity", venueId: "jump", delta: 2 });
    state.family.childAges[0] = "6";
    expect(edited.quantities.jump).toBe(3);
    expect(edited.pass?.quantities.jump).toBe(1);
    expect(edited.pass?.family.childAges).toEqual(["2"]);
    expect(edited.pass?.totalCents).toBe(5400);
    expect(edited.visit.venueId).toBe("sprout");
  });
  it("refuses purchase with invalid email or too few admissions", () => {
    const state = initialState(demoVenues);
    expect(() => createDemoPass(state, demoVenues, new Date(), "test")).toThrow("email");
    state.email = "parent@example.com";
    state.quantities = { sprout: 1 };
    expect(() => createDemoPass(state, demoVenues, new Date(), "test")).toThrow("3 admissions");
  });
  it("rejects empty groups and missing or out-of-range child ages", () => {
    expect(validateFamily({ adults: 0, childAges: [], gift: false })).not.toBeNull();
    for (const age of ["", "-1", "18", "2.5"]) {
      expect(validateFamily({ adults: 2, childAges: [age], gift: false })).not.toBeNull();
    }
    expect(validateFamily({ adults: 0, childAges: ["0", "17"], gift: true })).toBeNull();
  });
  it("clamps quantity controls without mutating the current state", () => {
    const state = initialState(demoVenues);
    expect(demoReducer(state, { type: "quantity", venueId: "sprout", delta: -5 }).quantities.sprout).toBe(0);
    expect(demoReducer(state, { type: "quantity", venueId: "sprout", delta: 200 }).quantities.sprout).toBe(99);
    expect(state.quantities.sprout).toBe(1);
  });
});
