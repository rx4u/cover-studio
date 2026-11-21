import { chromium, type Browser, type Page } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import type { Config } from "./config.ts";

export const VIEWPORT = { width: 1440, height: 900 };
export const SCALE = 2;

export type Shot = { page: string; y: number; file: string };
export type Tall = { page: string; file: string };
export type Manifest = { key: string; url: string; shots: Shot[]; talls: Tall[]; photo: string | null; capturedAt: string };

/** Height of the tall capture, in CSS px, used when a frame runs off the canvas. */
export const TALL_HEIGHT = 2400;

export function cacheDir(c: Config): string {
  return resolve(process.cwd(), ".cover-cache", c.name);
}

function cacheKey(c: Config): string {
  return createHash("sha1").update(JSON.stringify(c.source)).digest("hex").slice(0, 12);
}

export async function launch(): Promise<Browser> {
  const candidates = [process.env.CHROME_PATH, "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];
  const executablePath = candidates.find((p) => p && existsSync(p));
  return chromium.launch({ executablePath, args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
}

/** Scroll through the whole page once so scroll-driven reveals reach their end state, then return to the top. */
async function finishReveals(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const h = () => document.documentElement.scrollHeight;
    const max = Math.min(h(), 40000);
    for (let y = 0; y < max; y += Math.round(window.innerHeight * 0.6)) {
      window.scrollTo(0, y);
      await sleep(140);
    }
    window.scrollTo(0, h());
    await sleep(400);
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

async function scrollTo(page: Page, y: number): Promise<void> {
  await page.evaluate((top) => {
    const w = window as unknown as { lenis?: { scrollTo: (y: number, o: object) => void }; __lenis?: { scrollTo: (y: number, o: object) => void } };
    const lenis = w.lenis ?? w.__lenis;
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    window.scrollTo(0, top);
  }, y);
  await page.waitForTimeout(900);
}

async function settle(page: Page, c: Config): Promise<void> {
  if (c.source.waitFor) await page.waitForFunction(c.source.waitFor, null, { timeout: 60_000 });
  // Every wait is capped: lazy images and some font loaders never resolve.
  await page.evaluate(async () => {
    const cap = (p: Promise<unknown>, ms: number) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
    await cap(document.fonts.ready, 5000);
    await cap(Promise.all([...document.images].filter((i) => i.loading !== "lazy" && !i.complete).map((i) => i.decode().catch(() => null))), 8000);
  });
  await page.waitForTimeout(1200);
}

async function savePhoto(page: Page, c: Config, dir: string): Promise<string | null> {
  const ref = c.source.photo;
  if (!ref) return null;
  let src: string | null = null;
  if (/^https?:\/\//.test(ref)) src = ref;
  else {
    src = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      if (el instanceof HTMLImageElement) return el.currentSrc || el.src;
      const img = el.querySelector("img");
      if (img) return img.currentSrc || img.src;
      const bg = getComputedStyle(el).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      return bg ? new URL(bg[1], location.href).href : null;
    }, ref);
  }
  if (src) {
    const res = await page.request.get(src);
    if (res.ok()) {
      const file = join(dir, "photo.img");
      await writeFile(file, await res.body());
      return file;
    }
  }
  if (!/^https?:\/\//.test(ref)) {
    const el = await page.$(ref);
    if (el) {
      const file = join(dir, "photo.img");
      await el.screenshot({ path: file, type: "png" });
      return file;
    }
  }
  console.warn(`  photo: could not find "${ref}", photo-ground will be skipped`);
  return null;
}

export async function capture(c: Config, fresh = false): Promise<Manifest> {
  const dir = cacheDir(c);
  const manifestPath = join(dir, "manifest.json");
  const key = cacheKey(c);
  if (!fresh && existsSync(manifestPath)) {
    const m = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest;
    if (m.key === key && m.talls && [...m.shots, ...m.talls].every((s) => existsSync(s.file))) {
      console.log(`capture: using cache (${m.shots.length} shots). Pass --fresh to recapture.`);
      return m;
    }
  }
  await mkdir(dir, { recursive: true });
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE, reducedMotion: "no-preference" });
  // tsx (esbuild) wraps named functions in __name(); define it inside the page so evaluate() works.
  await ctx.addInitScript("window.__name = (f) => f;");
  const page = await ctx.newPage();
  const shots: Shot[] = [];
  const talls: Tall[] = [];
  let photo: string | null = null;
  try {
    for (const [pi, path] of c.source.pages.entries()) {
      const url = new URL(path, c.source.url).href;
      console.log(`capture: ${url}`);
      const res = await page.goto(url, { waitUntil: "load", timeout: 90_000 });
      if (res && res.status() >= 400) {
        console.warn(`  skipped: ${url} returned ${res.status()}`);
        continue;
      }
      await settle(page, c);
      if (c.source.finishReveals) await finishReveals(page);
      if (pi === 0) photo = await savePhoto(page, c, dir);
      for (const y of c.source.scrollPositions) {
        await scrollTo(page, y);
        const file = join(dir, `p${pi}-y${y}.png`);
        await page.screenshot({ path: file, type: "png" });
        shots.push({ page: path, y, file });
      }
      await scrollTo(page, 0);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      const tall = join(dir, `p${pi}-tall.png`);
      await page.screenshot({ path: tall, type: "png", fullPage: true, clip: { x: 0, y: 0, width: VIEWPORT.width, height: Math.min(height, TALL_HEIGHT) } });
      talls.push({ page: path, file: tall });
    }
  } finally {
    await browser.close();
  }
  const m: Manifest = { key, url: c.source.url, shots, talls, photo, capturedAt: new Date().toISOString() };
  await writeFile(manifestPath, JSON.stringify(m, null, 2));
  console.log(`capture: ${shots.length} shots${photo ? " + photo" : ""} in ${dir}`);
  return m;
}
