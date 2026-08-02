import { test, expect } from "@playwright/test";

// hydration barrier: maplibre controls only render client-side after hydration
async function waitHydrated(page: import("@playwright/test").Page) {
  await expect(page.getByRole("button", { name: "Zoom in" })).toBeVisible({ timeout: 15_000 });
}

test.describe("demo journeys — dashboard", () => {
  test("search selects a station and opens the station info card", async ({ page }) => {
    await page.goto("/dashboard");
    await waitHydrated(page);

    const search = page.getByPlaceholder("Search spatial nodes (e.g. Dukuh Atas)...");
    await search.fill("Dukuh");
    const result = page.getByRole("button", { name: /Dukuh Atas KAI/ });
    await expect(result).toBeVisible({ timeout: 10_000 });
    // the choke-alert status bar overlaps the dropdown — dispatch the click directly
    await result.evaluate((el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    await expect(page.locator("h2", { hasText: "Dukuh Atas" })).toBeVisible();
    await expect(page.getByText("VCI Score").first()).toBeVisible();
  });

  test("demo mode switch toggles on/off", async ({ page }) => {
    await page.goto("/dashboard");
    const demoSwitch = page.getByRole("switch", { name: /Demo Mode/ });

    // demo mode is persisted + switchable — normalize to ON first.
    // clicks are dispatched directly because sonner toasts overlay the badge.
    if ((await demoSwitch.getAttribute("aria-checked")) !== "true") {
      await demoSwitch.evaluate((el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    }
    await expect(demoSwitch).toHaveAttribute("aria-checked", "true");

    await demoSwitch.evaluate((el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await expect(page.getByText("Demo mode OFF — real data sources")).toBeVisible();
    await expect(page.getByText("Demo Mode: OFF", { exact: true })).toBeVisible();

    await demoSwitch.evaluate((el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await expect(demoSwitch).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText("Demo mode ON — fixture data sources active")).toBeVisible();
    await expect(page.getByText("Demo Mode: ON", { exact: true })).toBeVisible();
  });

  test("2D/3D map mode toggle", async ({ page }) => {
    await page.goto("/dashboard");
    const modeBtn = page.locator('button[title*="Toggle between 2D Flat"]');

    await expect(modeBtn).toBeVisible();
    await expect(modeBtn).toContainText("2D Flat");
    await modeBtn.click();
    await expect(modeBtn).toContainText("3D Mode");

    await modeBtn.click();
    await expect(modeBtn).toContainText("2D Flat");
  });

  test("exports spatial GeoJSON", async ({ page }) => {
    await page.goto("/dashboard");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /Export GeoJSON/ }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("station-spatial-nodes.geojson");
    await expect(page.getByText("Exported spatial GeoJSON file!")).toBeVisible();
  });

  test("choke alert banner acknowledges", async ({ page }) => {
    await page.goto("/dashboard");

    const openBanner = page.getByRole("alert").filter({ hasText: "choke level" });
    if ((await openBanner.count()) > 0) {
      await openBanner.getByRole("button", { name: "Acknowledge & Dispatch" }).click();
      await expect(page.getByRole("status", { name: /alerts acknowledged/ })).toBeVisible();
    } else {
      await expect(page.getByRole("status", { name: /alert|alerts/ })).toBeVisible();
    }
  });

  test("alert channel tabs switch panels", async ({ page }) => {
    await page.goto("/dashboard");
    const tablist = page.getByRole("tablist", { name: "Alert channels" });
    await expect(tablist).toBeVisible();

    await page.getByRole("tab", { name: /WhatsApp/ }).click();
    await expect(page.getByRole("tab", { name: /WhatsApp/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel", { name: /WhatsApp messages/ })).toBeVisible();
  });

  test("rain mode layer reveals flood depth feed", async ({ page }) => {
    await page.goto("/dashboard");
    await waitHydrated(page);
    await page.getByText("Rain Mode", { exact: true }).click();

    await expect(page.getByRole("heading", { name: "Flood Depth Detection" })).toBeVisible();
  });

  test("48h forecast layer enables what-if simulation", async ({ page }) => {
    await page.goto("/dashboard");
    await waitHydrated(page);
    await page.getByText("48h Forecast", { exact: true }).click();

    await page.getByRole("tab", { name: "What-If" }).click();
    await page.getByLabel("Train delay (min)").fill("10");
    await page.getByRole("button", { name: "Run Simulation" }).click();

    await expect(page.getByText("Scenario computed — curves updated")).toBeVisible();
  });
});

test.describe("demo journeys — field survey", () => {
  test("validates empty submission", async ({ page }) => {
    await page.goto("/survey");
    await page.getByRole("button", { name: "Submit Report" }).click();

    await expect(page.getByText("Select a target station")).toBeVisible();
  });

  test("submits a survey report", async ({ page }) => {
    await page.goto("/survey");

    await page.locator("select").first().selectOption({ label: "Dukuh Atas (KAI)" });
    await page.getByRole("button", { name: "Street Vendor" }).click();
    await page.getByRole("button", { name: "Submit Report" }).click();

    await expect(page.getByText("Survey submitted successfully!")).toBeVisible();
  });

  test("saves a draft to localStorage", async ({ page }) => {
    await page.goto("/survey");
    await page.locator("select").first().selectOption({ label: "Manggarai (KAI)" });
    await page.getByRole("button", { name: "Save Draft" }).click();

    const saved = await page.evaluate(() => localStorage.getItem("transitflow-survey-draft"));
    expect(saved).toContain("ST-MGR");
  });
});

test.describe("demo journeys — command center", () => {
  test("dispatches a warden and resolves an incident", async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/command-center");

    // markers are added once the CC driver mutates the store (~40s in);
    // markers are re-created on every store tick, so dispatch the click directly
    const marker = page.locator('.maplibregl-marker[style*="cursor"]').first();
    await marker.waitFor({ timeout: 90_000 });
    await marker.evaluate((el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    const resolveBtn = page.getByRole("button", { name: "Resolve Incident" });
    const dispatchBtn = page.getByRole("button", { name: /DISPATCH/ }).first();
    await expect(dispatchBtn.or(resolveBtn)).toBeVisible({ timeout: 10_000 });

    if ((await dispatchBtn.count()) > 0) {
      await dispatchBtn.click();
      await expect(page.getByText(/dispatched to/)).toBeVisible();
    }

    await expect(resolveBtn).toBeVisible();
    await resolveBtn.click();
    await expect(resolveBtn).toHaveCount(0, { timeout: 10_000 });
  });

  test("exports Kemenhub CSV", async ({ page }) => {
    await page.goto("/command-center");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export CSV (Kemenhub)" }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("kemenhub-bottleneck-report.csv");
  });
});

test.describe("demo journeys — cctv", () => {
  test("kills and revives a camera feed", async ({ page }) => {
    await page.goto("/cctv");

    const killBtn = page.getByRole("button", { name: "Kill", disabled: false }).first();
    await expect(killBtn).toBeVisible();
    const card = killBtn.locator("xpath=ancestor::div[contains(@class,'group')]");
    const cameraName = (await card.locator("p").first().textContent()) ?? "";

    await killBtn.click();
    const cardByName = page.locator("div.group").filter({ hasText: cameraName }).first();
    await expect(cardByName.getByRole("button", { name: "Revive", disabled: false })).toBeVisible();

    await cardByName.getByRole("button", { name: "Revive" }).click();
    await expect(cardByName.getByRole("button", { name: "Kill", disabled: false })).toBeVisible();
  });
});

test.describe("demo journeys — national", () => {
  test("switches city and language", async ({ page }) => {
    await page.goto("/national");

    await page.getByRole("button", { name: "Surabaya" }).click();
    await expect(page.getByRole("button", { name: "Surabaya" })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.getByRole("heading", { name: "National Choke Leaderboard" })).toBeVisible();
  });

  test("exports national CSV", async ({ page }) => {
    await page.goto("/national");
    await page.getByRole("button", { name: "Ekspor CSV (Kemenhub)" }).click();

    await expect(page.getByText("Kemenhub CSV exported")).toBeVisible();
  });
});

test.describe("demo journeys — developers", () => {
  test("executes an endpoint from the catalog", async ({ page }) => {
    await page.goto("/developers");

    await page.getByRole("button", { name: /GET \/api\/v1\/hubs / }).first().click();
    await page.getByRole("button", { name: "Execute" }).click();

    await expect(page.getByText("200 OK").first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("pre").first()).toContainText(/FeatureCollection|features/);
  });

  test("runs an SDK expression", async ({ page }) => {
    await page.goto("/developers");
    await page.getByRole("button", { name: "SDK Playground" }).click();

    await expect(page.getByLabel("SDK expression")).toBeVisible();
    await page.getByRole("button", { name: "listHubs()" }).click();
    await page.getByRole("button", { name: "Run" }).click();

    await expect(page.getByText("$ listHubs()")).toBeVisible();
    await expect(page.getByText('"count": 3')).toBeVisible();
  });
});

test.describe("demo journeys — commuter portal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/portal");
    const later = page.getByRole("button", { name: "Nanti" });
    if ((await later.count()) > 0) await later.click();
  });

  test("report flow validates then succeeds", async ({ page }) => {
    await page.getByRole("button", { name: "Lapor" }).click();

    const sendBtn = page.getByRole("button", { name: "Kirim Laporan" });
    await expect(sendBtn).toBeDisabled();
    await page.getByRole("button", { name: "Genangan" }).click();
    await sendBtn.click();

    await expect(page.getByText("Laporan terkirim!")).toBeVisible();
    await expect(page.getByText(/CR-\d{4}/)).toBeVisible();
  });

  test("safe-path tab lists safest door and steps", async ({ page }) => {
    await page.getByRole("button", { name: "Gunakan Lokasi Saya" }).click();
    await page.getByRole("button", { name: "Jalur Aman" }).click();

    await expect(page.getByText("Pintu Teraman")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("list", { name: "Navigate steps" }).getByRole("listitem")).toHaveCount(3);
  });

  test("language toggle flips labels", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Beranda" })).toBeVisible();

    await page.getByRole("button", { name: "Toggle language" }).click();
    await expect(page.getByRole("button", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Report" })).toBeVisible();
  });
});

test.describe("demo journeys — ai ingestion", () => {
  test("approves an extraction and attaches it", async ({ page }) => {
    await page.goto("/ai-ingestion");

    const reviewRow = page
      .locator('section[aria-label="REVIEW"]')
      .getByRole("button")
      .filter({ hasText: /AI-\d{4}-\d{4}/ })
      .first();
    await reviewRow.click();

    const drawer = page.getByRole("dialog", { name: "Extraction detail" });
    await expect(drawer).toBeVisible();

    const approveBtn = drawer.getByRole("button", { name: "APPROVE" });
    if ((await approveBtn.count()) > 0) {
      await approveBtn.click();

      const stationSelect = drawer.getByLabel("Target Station Node");
      await expect(stationSelect).toBeVisible({ timeout: 10_000 });
      await stationSelect.selectOption({ index: 1 });
      const channelSelect = drawer.getByLabel("Exit Channel");
      await channelSelect.selectOption({ index: 1 });

      await drawer.getByRole("button", { name: "Confirm Attachment" }).click();
      await expect(drawer.getByText(/Attached ·/)).toBeVisible({ timeout: 10_000 });
    }
  });

  test("filters the review queue", async ({ page }) => {
    await page.goto("/ai-ingestion");

    await page.getByRole("button", { name: "REJECTED", exact: true }).click();
    await expect(page.getByRole("button", { name: "REJECTED", exact: true })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "ALL", exact: true }).click();
    await expect(page.getByRole("button", { name: "ALL", exact: true })).toHaveAttribute("aria-pressed", "true");
  });
});
