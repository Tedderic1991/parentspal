import { describe, expect, it } from "vitest";
import { translate } from "./translate";

describe("English/French rendering", () => {
  it("translates original copy and dynamic family and quantity labels without touching the DOM", () => {
    expect(translate("Who's going to play?", "fr")).toBe("Qui vient jouer ?");
    expect(translate("Child 2 age", "fr")).toBe("Âge de l’enfant 2");
    expect(translate("1–5 years", "fr")).toBe("1–5 ans");
    expect(translate("Add 2 more admissions.", "fr")).toBe("Ajoutez encore 2 entrées.");
    expect(translate("Build a pass →", "en")).toBe("Build a pass →");
  });
});
