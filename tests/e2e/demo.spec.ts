import { expect, test, type Page } from "@playwright/test";

async function selectBundle(page: Page) {
  await page.getByRole("button", { name: "Build a pass →" }).click();
  await page.getByRole("button", { name: "Next: choose playgrounds →" }).click();
}

async function buyPass(page: Page) {
  await selectBundle(page);
  await page.getByRole("button", { name: "Calculate my pass →" }).click();
  await page.getByRole("button", { name: "Continue to checkout →" }).click();
  await page.getByLabel("Email for pass delivery").fill("parent@example.com");
  await page.getByLabel("Name", { exact: true }).fill("Demo Parent");
  await page.getByRole("button", { name: /Complete purchase/ }).click();
}

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("explores venue details, translates the UI, and stays within the viewport", async ({ page }) => {
  await page.getByRole("button", { name: /Sprout & Play/ }).click();
  await expect(page.getByRole("heading", { name: "Sprout & Play" })).toBeVisible();
  await expect(page.getByText("$18.00", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Passer en français" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await page.getByRole("button", { name: "Créer mon pass" }).click();
  await expect(page.getByRole("heading", { name: "Qui vient jouer ?" })).toBeVisible();
  await expect(page.getByLabel("Âge de l’enfant 1")).toHaveValue("2");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("guards the minimum and preserves form input while switching payment methods", async ({ page }) => {
  await selectBundle(page);
  await page.getByRole("button", { name: "Decrease admissions for Jump Junction" }).click();
  await expect(page.getByRole("button", { name: "Calculate my pass →" })).toBeDisabled();
  await page.getByRole("button", { name: "Increase admissions for Sprout & Play" }).click();
  await expect(page.getByRole("button", { name: "Calculate my pass →" })).toBeEnabled();
  await page.getByRole("button", { name: "Calculate my pass →" }).click();
  await page.getByRole("button", { name: "Continue to checkout →" }).click();
  await page.getByLabel("Email for pass delivery").fill("parent@example.com");
  await page.getByRole("button", { name: "Google Pay", exact: true }).click();
  await expect(page.getByLabel("Email for pass delivery")).toHaveValue("parent@example.com");
});

test("buys a demo pass and exercises reservation and walk-in paths", async ({ page }) => {
  await buyPass(page);
  await expect(page.getByRole("heading", { name: "Let the fun begin!" })).toBeVisible();
  await expect(page.getByText("$54.00", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "My pass", exact: true }).last().click();
  await page.getByRole("button", { name: "Plan a visit" }).click();
  await expect(page.getByRole("heading", { name: "Walk-in visit", exact: true })).toBeVisible();
  await page.getByLabel("Playground", { exact: true }).selectOption("jump");
  await page.getByLabel("Visit date", { exact: true }).fill("2026-11-07");
  await page.getByRole("button", { name: /4:00 PM/ }).click();
  await expect(page.getByText("$5.00", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Confirm demo booking" }).click();
  await expect(page.getByRole("heading", { name: "You're booked!" })).toBeVisible();
  await expect(page.getByText("Illustrative QR · not valid for real admission")).toBeVisible();
  await page.getByRole("button", { name: "Back to pass" }).click();
  await page.getByRole("button", { name: "Plan a visit" }).click();
  await page.getByLabel("Playground", { exact: true }).selectOption("sprout");
  await page.getByRole("button", { name: "Show walk-in pass instructions" }).click();
  await expect(page.getByRole("heading", { name: "Ready for your visit" })).toBeVisible();
});

test("keeps an existing pass unchanged when building a new bundle and clears it on refresh", async ({ page }) => {
  await buyPass(page);
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await selectBundle(page);
  await page.getByRole("button", { name: "Increase admissions for Jump Junction" }).click();
  await page.getByRole("button", { name: "My pass", exact: true }).click();
  await expect(page.getByText("$54.00", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "My pass", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No pass yet" })).toBeVisible();
});

test("preserves gift and demo account flows in French", async ({ page }) => {
  await page.getByRole("button", { name: "Passer en français" }).click();
  await page.getByRole("button", { name: "Créer un pass →" }).click();
  await page.getByLabel("Je l’achète en cadeau").check();
  await page.getByRole("button", { name: "Suivant : choisir les lieux →" }).click();
  await page.getByRole("button", { name: "Calculer mon pass →" }).click();
  await page.getByRole("button", { name: "Passer au paiement →" }).click();
  await expect(page.getByRole("heading", { name: "Offrez des moments de jeu" })).toBeVisible();
  await page.getByLabel("Courriel pour recevoir le pass").fill("parent@example.com");
  await page.getByRole("button", { name: /Terminer l’achat/ }).click();
  await page.getByRole("button", { name: "Créer un compte pour conserver le pass" }).click();
  await expect(page.getByLabel("Courriel pour recevoir le pass")).toHaveValue("parent@example.com");
  await page.getByRole("button", { name: "Créer un compte démo" }).click();
  await expect(page.getByRole("heading", { name: "Mon pass" })).toBeVisible();
});
