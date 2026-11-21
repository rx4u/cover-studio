import { chromium, type Browser, type Page } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { captureViewports } from "./devices.ts";
import type { Config } from "./config.ts";

export const VIEWPORT = { width: 1440, height: 900 };
export const SCALE = 2;

export type Shot = {
  page: string;
  y: number;
  file: string;
  /** Background colour at the top of the page, for the status bar band. */
  topColor?: string;
  /** Mobile shots: the viewport width they were captured at, and the colour scheme. */
  w?: number;
  scheme?: "light" | "dark";
  /** Section shots: height of the sticky header covering the top, in CSS px. */
  nav?: number;
};
export type Tall = { page: string; file: string };
export type Manifest = {
  key: string;
  url: string;
  shots: Shot[];
  talls: Tall[];
  /** Full-page captures (capped at FULL_HEIGHT) for strips. */
  full: Tall[];
  /** For each desktop page: section start offsets in CSS px, so crops can open on a section, never mid-sentence. */
  sections?: number[][];
  /** Mobile viewport shots and tall mobile captures. */
  mobile: Shot[];
  mobileTalls: Tall[];
  /** For each mobile tall capture: section start offsets in CSS px, so phone crops never open mid-sentence. */
  mobileSections: number[][];
  /** The site's own logo, transparent, when source.logo is set, and the header colour it sits on. */
  logo?: string | null;
  logoBg?: string | null;
  /** The site's own photographs, largest first. */
  images?: string[];
  /** Component captures, one per source.elements selector that matched. */
  elements: string[];
  /** Capture of source.before, for before-after. */
  before: string | null;
  photo: string | null;
  /** Largest image below the first screen, for the clear photo ground (so it differs from the hero). */
  photoAlt: string | null;
  capturedAt: string;
};

/** Height of the tall capture, in CSS px, used when a frame runs off the canvas. */
export const TALL_HEIGHT = 2400;
export const FULL_HEIGHT = 16000;
export const MOBILE = { width: 390, height: 844 };

export function cacheDir(c: Config): string {
  return resolve(process.cwd(), ".cover-cache", c.name);
}

function cacheKey(c: Config): string {
  return createHash("sha1").update(JSON.stringify([c.source, c.source.mobile ? captureViewports(c) : []])).digest("hex").slice(0, 12);
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

/**
 * Full-page screenshots paint the whole page at once, so reveal animations that re-hide content outside the viewport
 * (Framer Motion, GSAP and similar set inline opacity 0, translate and visibility hidden) leave blank sections. Before a
 * full-page shot, every element hidden by an inline reveal style is set to its revealed state. Elements hidden by the
 * site's own stylesheet (menus, modals) are left alone, because their hiding is not inline.
 */
async function forceRevealed(page: Page): Promise<number> {
  const n = await page.evaluate(() => {
    let count = 0;
    for (const e of document.querySelectorAll<HTMLElement>("body *")) {
      const st = e.style;
      if (e.hasAttribute("data-cs-hide")) continue;
      // Line reveals slide a line of text out of a clipping parent (SplitText and similar): put it back in place.
      // Text only: images and layers moved out of view on purpose stay where they are.
      const parent = e.parentElement;
      const textLine = !!e.textContent?.trim() && !e.querySelector("img, video, canvas, picture, svg") && e.getBoundingClientRect().height < 200;
      if (textLine && st.transform && st.transform !== "none" && parent && getComputedStyle(parent).overflow === "hidden" && getComputedStyle(e).transform !== "none") {
        st.setProperty("transform", "none", "important");
        count++;
      }
      const inlineHidden = (st.opacity !== "" && parseFloat(st.opacity) < 0.99) || st.visibility === "hidden";
      if (!inlineHidden) continue;
      if (e.closest("[role='dialog'], [aria-hidden='true'], nav [aria-expanded='false']")) continue;
      st.setProperty("opacity", "1", "important");
      st.setProperty("visibility", "visible", "important");
      if (st.transform) st.setProperty("transform", "none", "important");
      if (st.filter) st.setProperty("filter", "none", "important");
      if (st.clipPath) st.setProperty("clip-path", "none", "important");
      count++;
    }
    return count;
  });
  await page.waitForTimeout(300);
  return n;
}

/**
 * The page as a visitor sees it, screen by screen: scroll one viewport at a time, let each screen's reveals play,
 * screenshot it, then join the screens. A single full-page screenshot paints everything at once, so sites whose
 * reveals only run in view (or re-hide out of view) come out blank below the hero. Fixed and sticky bars (under 30%
 * of the screen tall) show on the first screen only. Writes `tallFile` (the first `tallH` CSS px at 2x) and `fullFile` (up to `fullH` at 1x).
 */
async function stitchPage(page: Page, tallFile: string, fullFile: string, tallH: number, fullH: number): Promise<number[]> {
  const vh = VIEWPORT.height;
  // Pinned sections would repeat in every screen they stay pinned for, so lay them out in normal flow: GSAP pins
  // (a .pin-spacer around the pinned element, re-applied on every scroll, so a stylesheet rule with !important beats
  // its inline styles) and CSS sticky sections.
  await page.addStyleTag({
    content: "[data-cs-hide]{visibility:hidden!important}.pin-spacer{padding:0!important;height:auto!important;max-height:none!important}.pin-spacer>*{position:relative!important;top:auto!important;left:auto!important;bottom:auto!important;transform:none!important;width:auto!important;max-width:none!important}",
  });
  await page.evaluate(() => {
    for (const e of document.querySelectorAll<HTMLElement>("body *")) {
      const r = e.getBoundingClientRect();
      if (getComputedStyle(e).position === "sticky" && r.height >= window.innerHeight * 0.3) e.style.setProperty("position", "relative", "important");
    }
  });
  // Let scroll libraries re-measure the unpinned layout, then show anything their reveals left hidden.
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await page.waitForTimeout(700);
  const height = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), fullH);
  // Section starts in the unpinned layout; mapped below onto the joined image, which drops blank screens.
  const rawSections = await page.evaluate(() => {
    const tops = [...document.querySelectorAll("section, main > *, article, footer, [class*='section']")]
      .map((e) => Math.round(e.getBoundingClientRect().top + window.scrollY))
      .filter((t) => t > 200);
    return [...new Set(tops)].sort((a, b) => a - b);
  });
  const frames: { y: number; data: string }[] = [];
  for (let y = 0; ; y += vh) {
    const top = Math.min(y, Math.max(0, height - vh));
    await scrollTo(page, top);
    await page.waitForTimeout(500);
    await forceRevealed(page);
    const buf = await page.screenshot({ type: "png", timeout: 120_000 });
    frames.push({ y: top, data: buf.toString("base64") });
    if (frames.length === 1)
      await page.evaluate(() => {
        for (const e of document.querySelectorAll<HTMLElement>("body *")) {
          // Only bars (headers, banners, chat buttons): a fixed wrapper holding the whole page must stay.
          const p = getComputedStyle(e).position;
          const r = e.getBoundingClientRect();
          if ((p === "fixed" || p === "sticky") && r.height < window.innerHeight * 0.3) e.setAttribute("data-cs-hide", "");
        }
      });
    if (top + vh >= height) break;
  }
  await page.evaluate(() => {
    for (const e of document.querySelectorAll<HTMLElement>("[data-cs-hide]")) e.removeAttribute("data-cs-hide");
  });
  await scrollTo(page, 0);
  // Join in a blank page: tall at 2x, full at 1x (a 2x canvas past 16k px would fail).
  const joiner = await page.context().newPage();
  const join = async (h: number, scale: number) =>
    joiner.evaluate(
      async ({ frames, w, h, vh, scale }) => {
        const cv = document.createElement("canvas");
        cv.width = w * scale;
        cv.height = h * scale;
        const g = cv.getContext("2d", { willReadFrequently: true })!;
        // Screens that are one flat colour (scroll spacers, sections that never revealed) are dropped and the rest
        // close up, so the joined page has no empty bands. The canvas is then trimmed to what was drawn.
        const probe = document.createElement("canvas");
        probe.width = 48;
        probe.height = 30;
        const pg = probe.getContext("2d", { willReadFrequently: true })!;
        let at = 0;
        const map: [number, number, number][] = [];
        for (const [i, f] of frames.entries()) {
          if (f.y >= h) break;
          const img = new Image();
          img.src = "data:image/png;base64," + f.data;
          await img.decode();
          pg.drawImage(img, 0, 0, 48, 30);
          const d = pg.getImageData(0, 0, 48, 30).data;
          let mean = 0, sq = 0;
          for (let j = 0; j < d.length; j += 4) { const l = (d[j] + d[j + 1] + d[j + 2]) / 3; mean += l; sq += l * l; }
          const n = d.length / 4;
          const sd = Math.sqrt(sq / n - (mean / n) ** 2);
          if (i > 0 && sd < 4) continue;
          // The last screen is aligned to the page end, so it may overlap the one before: draw only its new part.
          const prevEnd = i > 0 ? frames[i - 1].y + vh : 0;
          const skip = i > 0 && f.y < prevEnd ? prevEnd - f.y : 0;
          g.drawImage(img, 0, skip * (img.height / vh), img.width, (vh - skip) * (img.height / vh), 0, at * scale, w * scale, (vh - skip) * scale);
          map.push([f.y + skip, at, vh - skip]);
          at += vh - skip;
          if (at >= h) break;
        }
        const out = document.createElement("canvas");
        out.width = w * scale;
        out.height = Math.min(at, h) * scale;
        out.getContext("2d")!.drawImage(cv, 0, 0);
        return { data: out.toDataURL("image/png").split(",")[1], map };
      },
      { frames, w: VIEWPORT.width, h, vh, scale },
    );
  writeFileSync(tallFile, Buffer.from((await join(Math.min(height, tallH), SCALE)).data, "base64"));
  const full = await join(height, 1);
  writeFileSync(fullFile, Buffer.from(full.data, "base64"));
  await joiner.close();
  const mapped: number[] = [];
  for (const t of rawSections) {
    const seg = full.map.find(([src, , len]) => t >= src && t < src + len) ?? full.map.find(([src]) => src >= t);
    if (!seg) continue;
    const y = t >= seg[0] ? seg[1] + (t - seg[0]) : seg[1];
    if (!mapped.includes(y)) mapped.push(y);
  }
  return mapped;
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

async function saveAltPhoto(page: Page, dir: string): Promise<string | null> {
  const src = await page.evaluate(() => {
    let best: { src: string; area: number } | null = null;
    for (const img of document.images) {
      const r = img.getBoundingClientRect();
      const top = r.top + window.scrollY;
      if (top < window.innerHeight * 1.1 || r.width < 500) continue;
      const area = r.width * r.height;
      const s = img.currentSrc || img.src;
      // Inline data: and blob: images cannot be fetched by URL; only http(s) photos are candidates.
      if (s && /^https?:/.test(s) && (!best || area > best.area)) best = { src: s, area };
    }
    return best ? best.src : null;
  });
  if (!src) return null;
  const res = await page.request.get(src);
  if (!res.ok()) return null;
  const file = join(dir, "photo-alt.img");
  await writeFile(file, await res.body());
  return file;
}

/**
 * The site's own photographs, for tiles that show imagery rather than page fragments: every <img> on the page with a
 * natural width of at least 800 px, distinct by source, largest first, up to 8. Logos, icons and small thumbnails are
 * left out by size. Downloaded at their original resolution.
 */
async function saveImages(page: Page, dir: string): Promise<string[]> {
  const srcs = await page.evaluate(() => {
    const seen = new Map<string, number>();
    for (const img of document.querySelectorAll("img")) {
      const s = img.currentSrc || img.src;
      if (!s || s.startsWith("data:") || /\.svg(\?|$)/i.test(s) || img.naturalWidth < 800 || img.naturalHeight < 500) continue;
      const area = img.naturalWidth * img.naturalHeight;
      if (!seen.has(s) || seen.get(s)! < area) seen.set(s, area);
    }
    return [...seen.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([s]) => s);
  });
  const out: string[] = [];
  for (const [i, src] of srcs.entries()) {
    try {
      const res = await page.request.get(src, { timeout: 30_000 });
      if (!res.ok()) continue;
      const file = join(dir, `img${i}.img`);
      await writeFile(file, await res.body());
      out.push(file);
    } catch {}
  }
  return out;
}

async function savePhoto(page: Page, c: Config, dir: string): Promise<string | null> {
  const ref = c.source.photo;
  if (!ref) return null;
  let src: string | null = null;
  if (/^https?:\/\//.test(ref)) src = ref;
  else {
    // Largest matching image in the first 1.5 screens: the first <img> is often a logo or a product cut-out.
    src = await page.evaluate((sel) => {
      let best: { src: string; area: number } | null = null;
      for (const el of document.querySelectorAll(sel)) {
        const img = el instanceof HTMLImageElement ? el : el.querySelector("img");
        const target = img ?? el;
        const r = target.getBoundingClientRect();
        if (r.top > window.innerHeight * 1.5 || r.width < 300) continue;
        const area = r.width * r.height;
        let s: string | null = null;
        if (img) s = img.currentSrc || img.src;
        else {
          const bg = getComputedStyle(el).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
          if (bg) s = new URL(bg[1], location.href).href;
        }
        if (s && (!best || area > best.area)) best = { src: s, area };
      }
      return best ? best.src : null;
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
      await el.screenshot({ path: file, type: "png", timeout: 120_000 });
      return file;
    }
  }
  console.warn(`  photo: could not find "${ref}", photo-ground will be skipped`);
  return null;
}

/** Average colour of the top rows of the current viewport, read from real pixels. */
async function topPixelColor(page: Page): Promise<string> {
  const buf = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: page.viewportSize()!.width, height: 3 } });
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const cv = document.createElement("canvas");
    cv.width = img.width;
    cv.height = img.height;
    const g = cv.getContext("2d")!;
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, img.width, img.height).data;
    let r = 0, gr = 0, bl = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; gr += d[i + 1]; bl += d[i + 2]; n++; }
    return `rgb(${Math.round(r / n)},${Math.round(gr / n)},${Math.round(bl / n)})`;
  }, buf.toString("base64"));
}

/** Opens a page. Heavy WebGL pages can miss the load event under software rendering: fall back to DOM ready, then skip. */
async function open(page: Page, url: string): Promise<{ status(): number } | null> {
  try {
    return await page.goto(url, { waitUntil: "load", timeout: 90_000 });
  } catch {
    try {
      console.warn(`  slow load, continuing from DOM ready: ${url}`);
      return await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
    } catch {
      console.warn(`  skipped, did not load: ${url}`);
      return null;
    }
  }
}

export async function capture(c: Config, fresh = false): Promise<Manifest> {
  const dir = cacheDir(c);
  const manifestPath = join(dir, "manifest.json");
  const key = cacheKey(c);
  if (!fresh && existsSync(manifestPath)) {
    const m = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest;
    if (m.key === key && m.full && "photoAlt" in m && m.mobileSections && [...m.shots, ...m.talls, ...m.full, ...m.mobile, ...m.mobileTalls].every((s) => existsSync(s.file))) {
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
  const full: Tall[] = [];
  const mobile: Shot[] = [];
  const mobileTalls: Tall[] = [];
  const mobileSections: number[][] = [];
  const sections: number[][] = [];
  const elements: string[] = [];
  let before: string | null = null;
  let photoAlt: string | null = null;
  let photo: string | null = null;
  let images: string[] = [];
  let logo: string | null = null;
  let logoBg: string | null = null;
  try {
    for (const [pi, path] of c.source.pages.entries()) {
      const url = new URL(path, c.source.url).href;
      console.log(`capture: ${url}`);
      const res = await open(page, url);
      if (!res || res.status() >= 400) {
        if (res) console.warn(`  skipped: ${url} returned ${res.status()}`);
        continue;
      }
      await settle(page, c);
      if (c.source.finishReveals) await finishReveals(page);
      if (pi === 0) {
        photo = await savePhoto(page, c, dir);
        photoAlt = await saveAltPhoto(page, dir);
      }
      for (const y of c.source.scrollPositions) {
        await scrollTo(page, y);
        const file = join(dir, `p${pi}-y${y}.png`);
        await page.screenshot({ path: file, type: "png", timeout: 120_000 });
        shots.push({ page: path, y, file });
      }
      await scrollTo(page, 0);

      const tall = join(dir, `p${pi}-tall.png`);
      const fullFile = join(dir, `p${pi}-full.png`);
      sections.push(await stitchPage(page, tall, fullFile, TALL_HEIGHT, FULL_HEIGHT));
      // After the stitch every lazy image has loaded.
      if (pi === 0) images = await saveImages(page, dir);
      if (pi === 0 && c.source.logo) {
        await scrollTo(page, 0);
        const el = await page.$(c.source.logo);
        if (el) {
          logo = join(dir, "logo.png");
          // The surface the logo was designed for: the header colour around it.
          logoBg = await topPixelColor(page);
          await page.addStyleTag({ content: "[data-cs-hide]{visibility:hidden!important}[data-cs-bg]::before,[data-cs-bg]::after{display:none!important}" });
          // Transparent: clear the backgrounds of the logo's ancestors (a header bar, the page) for the shot only.
          await el.evaluate((t) => {
            // Everything outside the logo's own line of ancestors is hidden (header blur layers are often siblings).
            for (const o of document.querySelectorAll<HTMLElement>("body *"))
              if (!o.contains(t) && !t.contains(o) && o !== t) o.setAttribute("data-cs-hide", "");
            document.documentElement.style.setProperty("background", "transparent", "important");
            for (let e: HTMLElement | null = t as HTMLElement; e; e = e.parentElement) {
              e.setAttribute("data-cs-bg", e.style.background);
              e.style.setProperty("background", "transparent", "important");
              e.style.setProperty("backdrop-filter", "none", "important");
              e.style.setProperty("box-shadow", "none", "important");
              // Headers often animate their background: without this the shot lands mid-transition.
              e.style.setProperty("transition", "none", "important");
            }
          });
          await page.waitForTimeout(150);
          await el.screenshot({ path: logo, type: "png", omitBackground: true, timeout: 60_000 });
          await el.evaluate((t) => {
            for (let e: HTMLElement | null = t as HTMLElement; e; e = e.parentElement) {
              e.style.removeProperty("background");
              e.style.removeProperty("backdrop-filter");
              e.style.removeProperty("box-shadow");
              e.style.removeProperty("transition");
              const old = e.getAttribute("data-cs-bg");
              if (old) e.style.background = old;
              e.removeAttribute("data-cs-bg");
            }
            document.documentElement.style.removeProperty("background");
            document.querySelectorAll("[data-cs-hide]").forEach((o) => o.removeAttribute("data-cs-hide"));
          });
        } else console.warn(`  logo not found: ${c.source.logo}`);
      }
      talls.push({ page: path, file: tall });
      full.push({ page: path, file: fullFile });
      if (pi === 0) {
        for (const [ei, sel] of c.source.elements.entries()) {
          const el = await page.$(sel);
          if (!el) {
            console.warn(`  element not found: ${sel}`);
            continue;
          }
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(600);
          await forceRevealed(page);
          // Fixed layers that do not hold the component (headers, a pinned hero) would sit over it in the shot.
          await el.evaluate((target) => {
            for (const e of document.querySelectorAll<HTMLElement>("body *"))
              if (getComputedStyle(e).position === "fixed" && !e.contains(target)) e.setAttribute("data-cs-hide", "");
          });
          const file = join(dir, `el${ei}.png`);
          // A margin of the page's own surface around the component (32 CSS px), so nothing touches the card edge.
          const b = await el.boundingBox();
          if (b) {
            const pad = 32;
            const vw = page.viewportSize()!.width;
            const x = Math.max(0, b.x - pad);
            await page.screenshot({ path: file, type: "png", timeout: 120_000, fullPage: true, clip: { x, y: Math.max(0, b.y + (await page.evaluate(() => window.scrollY)) - pad), width: Math.min(vw, b.x + b.width + pad) - x, height: b.height + pad * 2 } });
          } else await el.screenshot({ path: file, type: "png", timeout: 120_000 });
          await page.evaluate(() => document.querySelectorAll("[data-cs-hide]").forEach((e) => e.removeAttribute("data-cs-hide")));
          elements.push(file);
        }
        await scrollTo(page, 0);
      }
    }

    if (c.source.mobile) {
      // One pass per device viewport (real screen width, height below the status bar) and per colour scheme.
      const schemes: ("light" | "dark")[] = c.source.colorScheme === "both" ? ["light", "dark"] : [c.source.colorScheme];
      for (const [vi, vp] of captureViewports(c).entries()) {
        for (const scheme of schemes) {
          const mctx = await browser.newContext({ viewport: vp, deviceScaleFactor: SCALE, isMobile: vp.width < 800, hasTouch: true, colorScheme: scheme });
          await mctx.addInitScript("window.__name = (f) => f;");
          const mp = await mctx.newPage();
          const tag = `w${vp.width}-${scheme}`;
          for (const [pi, path] of c.source.pages.entries()) {
            const url = new URL(path, c.source.url).href;
            const res = await open(mp, url);
            if (!res || res.status() >= 400) continue;
            await settle(mp, c);
            if (c.source.finishReveals) await finishReveals(mp);
            const file = join(dir, `m${pi}-${tag}-y0.png`);
            await mp.screenshot({ path: file, type: "png", timeout: 120_000 });
            mobile.push({ page: path, y: 0, file, topColor: await topPixelColor(mp), w: vp.width, scheme });
            const sections = await mp.evaluate(() => {
              const tops = [...document.querySelectorAll("section, main > *, article, [class*='section']")]
                .map((e) => Math.round(e.getBoundingClientRect().top + window.scrollY))
                .filter((t) => t > 400);
              return [...new Set(tops)].sort((a, b) => a - b);
            });
            // On the first page, also capture four sections by really scrolling to them, so their reveals play.
            // Each opens with the section's top just below any sticky header, and sections closer than 60% of a
            // screen to the last one are skipped, so no two shots show the same content.
            if (pi === 0) {
              const navH = await mp.evaluate(() => {
                let h = 0;
                for (const e of document.querySelectorAll("header, nav, [class*='header'], [class*='nav']")) {
                  const cs = getComputedStyle(e);
                  const r = e.getBoundingClientRect();
                  if ((cs.position === "fixed" || cs.position === "sticky") && r.top <= 1 && r.height < 160) h = Math.max(h, r.bottom);
                }
                return Math.round(h);
              });
              const picked: number[] = [];
              for (const t of sections.filter((t) => t > vp.height * 0.9)) {
                if (picked.length && t - picked[picked.length - 1] < vp.height * 0.6) continue;
                picked.push(t);
                if (picked.length === 4) break;
              }
              for (const top of picked) {
                await scrollTo(mp, Math.max(0, top - navH));
                const sf = join(dir, `m${pi}-${tag}-y${top}.png`);
                await mp.screenshot({ path: sf, type: "png", timeout: 120_000 });
                mobile.push({ page: path, y: top, file: sf, topColor: await topPixelColor(mp), w: vp.width, scheme, nav: navH });
              }
              await scrollTo(mp, 0);
            }
            if (vi === 0 && scheme === schemes[0]) {
              mobileSections.push(sections);
              const h = await mp.evaluate(() => document.documentElement.scrollHeight);
              await forceRevealed(mp);
              const tall = join(dir, `m${pi}-tall.png`);
              await mp.screenshot({ path: tall, type: "png", timeout: 120_000, fullPage: true, clip: { x: 0, y: 0, width: vp.width, height: Math.min(h, vp.height * 4) } });
              mobileTalls.push({ page: path, file: tall });
            }
          }
          await mctx.close();
        }
      }
      console.log(`capture: ${mobile.length} mobile shots`);
    }

    if (c.source.before) {
      const res = await page.goto(c.source.before, { waitUntil: "load", timeout: 90_000 });
      if (res && res.status() < 400) {
        await settle(page, c);
        // Stitched like the new design's tall capture, so both sides can be shown at the same height.
        before = join(dir, "before.png");
        await stitchPage(page, before, join(dir, "before-full.png"), TALL_HEIGHT, TALL_HEIGHT);
      } else console.warn(`  before: ${c.source.before} did not load`);
    }
  } finally {
    await browser.close();
  }
  const m: Manifest = { key, url: c.source.url, shots, talls, full, mobile, mobileTalls, mobileSections, sections, images, logo, logoBg, elements, before, photo, photoAlt, capturedAt: new Date().toISOString() };
  await writeFile(manifestPath, JSON.stringify(m, null, 2));
  console.log(`capture: ${shots.length} shots${photo ? " + photo" : ""} in ${dir}`);
  return m;
}
