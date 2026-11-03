import { describe, expect, it } from "vitest";
import { demoVenues } from "./catalog";
import { pagePaths, resolveRoute, screenPaths, venuePath } from "./routes";

describe("page routing", () => {
  it("resolves every generated screen and venue URL", () => {
    for (const path of pagePaths(demoVenues)) {
      expect(resolveRoute(path.split("/").filter(Boolean), demoVenues)).not.toBeNull();
    }
    expect(resolveRoute(undefined, demoVenues)).toEqual({ screen: "home" });
    expect(resolveRoute(["pass", "family"], demoVenues)).toEqual({ screen: "family" });
    expect(resolveRoute(["venues", "sprout-and-play"], demoVenues))
      .toEqual({ screen: "detail", venueId: "sprout" });
  });

  it("uses readable name-based venue slugs without changing venue IDs", () => {
    const venue = { ...demoVenues[0], id: "original-id", name: "Jungle Gym" };
    expect(venuePath(venue)).toBe("/venues/jungle-gym/");
    expect(resolveRoute(["venues", "jungle-gym"], [venue]))
      .toEqual({ screen: "detail", venueId: "original-id" });
    expect(venuePath({ ...venue, name: "Jeux & Café!" })).toBe("/venues/jeux-and-cafe/");
  });

  it("rejects unknown paths and ambiguous or empty venue slugs", () => {
    expect(resolveRoute(["venues", "missing"], demoVenues)).toBeNull();
    expect(resolveRoute(["pass", "missing"], demoVenues)).toBeNull();
    const duplicate = { ...demoVenues[0], id: "other" };
    expect(() => pagePaths([...demoVenues, duplicate])).toThrow("unique");
    expect(() => resolveRoute(["venues", "sprout-and-play"], [...demoVenues, duplicate])).toThrow("unique");
    expect(() => venuePath({ ...duplicate, name: "🎈" })).toThrow("nonempty");
    expect(pagePaths([])).toContain(screenPaths.passes);
  });
});
