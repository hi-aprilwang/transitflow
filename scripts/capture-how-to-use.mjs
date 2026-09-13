import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const BASE = process.env.HOWTO_BASE_URL ?? "http://localhost:3001";
const OUT_DIR = path.resolve("public", "how-to-use");
const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 1 };
const SETTLE_MS = 7000;

const PAGES = [
  { id: "dashboard", url: "/dashboard" },
  { id: "command-center", url: "/command-center" },
  { id: "cctv", url: "/cctv" },
  { id: "kiosks", url: "/kiosks" },
  { id: "survey", url: "/survey" },
  { id: "ai-ingestion", url: "/ai-ingestion" },
  { id: "portal", url: "/portal" },
  { id: "national", url: "/national" },
  { id: "developers", url: "/developers" },
];

async function clickText(page, text) {
  const clicked = await page.evaluate((needle) => {
    const all = Array.from(document.querySelectorAll("body *"));
    const deepest = (list) =>
      list.sort((a, b) => a.childElementCount - b.childElementCount)[0];
    const exact = all.filter((el) => (el.textContent ?? "").trim() === needle);
    const target =
      deepest(exact) ??
      deepest(
        all.filter((el) =>
          (el.textContent ?? "")
            .trim()
            .toLowerCase()
            .includes(needle.toLowerCase()),
        ),
      );
    if (!target) return false;
    target.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
    return true;
  }, text);
  if (!clicked) throw new Error(`no clickable element matching "${text}"`);
}

const DASHBOARD_VARIANTS = [
  {
    id: "basemaps",
    action: (page) => page.click('button[title="Change MAPID Basemap"]'),
  },
  {
    id: "catchments",
    action: async (page) => {
      await clickText(page, "Judge Tour");
      await new Promise((resolve) => setTimeout(resolve, 900));
      await clickText(page, "1. Dukuh Atas TOD Peak Surge");
      await new Promise((resolve) => setTimeout(resolve, 6000));
    },
  },
  { id: "routing", action: (page) => clickText(page, "Rain Mode") },
  {
    id: "search",
    action: async (page) => {
      await page.click('input[placeholder*="earch"]');
      await page.keyboard.type("Dukuh Atas", { delay: 80 });
    },
  },
  { id: "tour", action: (page) => clickText(page, "Judge Tour") },
];

async function newPage(browser) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem("transit_flow_theme", "light");
    } catch {
      // storage unavailable before first paint
    }
  });
  return page;
}

async function capture(page, file) {
  await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
  await page.screenshot({ path: path.join(OUT_DIR, file) });
  console.log(`captured ${file}`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const only = process.argv.slice(2);
  const wanted = (id) => only.length === 0 || only.includes(id);
  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const target of PAGES.filter((page) => wanted(page.id))) {
      const page = await newPage(browser);
      try {
        await page.goto(BASE + target.url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        await capture(page, `${target.id}.png`);
      } catch (error) {
        console.warn(`failed ${target.id}: ${error.message}`);
      } finally {
        await page.close();
      }
    }

    for (const variant of DASHBOARD_VARIANTS.filter((item) => wanted(item.id))) {
      const page = await newPage(browser);
      try {
        await page.goto(BASE + "/dashboard", {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await variant.action(page);
        await capture(page, `${variant.id}.png`);
      } catch (error) {
        console.warn(`failed ${variant.id}: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
