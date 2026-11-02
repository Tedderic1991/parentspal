import { describe, expect, it } from "vitest";
import { demoVenues } from "./catalog";
import { calculateBundle, visitSurcharge } from "./pricing";

describe("bundle pricing", () => {
  it("preserves the original three-admission discount using integer cents", () => {
    expect(calculateBundle(demoVenues, { sprout: 1, jump: 1, cloud: 1 })).toEqual({
      count: 3, subtotalCents: 6000, discountCents: 600, totalCents: 5400, meetsMinimum: true,
    });
  });
  it("requires three admissions, not three distinct venues", () => {
    expect(calculateBundle(demoVenues, { sprout: 3 }).meetsMinimum).toBe(true);
    expect(calculateBundle(demoVenues, { sprout: 2 }).meetsMinimum).toBe(false);
  });
  it.each([-1, 0.5, NaN, 100])("rejects invalid admission quantities: %s", quantity => {
    expect(() => calculateBundle(demoVenues, { sprout: quantity })).toThrow();
  });
  it("keeps walk-ins free of time-slot fees and charges outside-window reservations", () => {
    expect(visitSurcharge(demoVenues[0], "4:00 PM")).toBe(0);
    expect(visitSurcharge(demoVenues[1], "10:00 AM")).toBe(0);
    expect(visitSurcharge(demoVenues[1], "4:00 PM")).toBe(500);
    expect(() => visitSurcharge(demoVenues[1], "unknown")).toThrow();
  });
});
