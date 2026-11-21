import { createRequire } from "node:module";
import type { Config } from "./config.ts";
import { url } from "./look.ts";
import { androidStatus, iosStatus, ipadStatus, macMenuBar } from "./system-ui.ts";

/**
 * Device frames. The markup and CSS come from react-mockframe (MIT, vendor/react-mockframe), rendered once to static HTML
 * by the generator so no React is needed at render time. Geometry is measured in CSS px at the library's natural size.
 */
const generated = createRequire(import.meta.url)("./devices.generated.json") as Record<
  string,
  { name: string; colours: Record<string, string>; geometry: { box: number[]; root: number[]; screen: number[] } }
>;

export const DEVICE_CSS = createRequire(import.meta.url).resolve("../vendor/react-mockframe/mockframe.min.css");

type Spec = {
  os: "ios" | "android" | "ipados" | "macos";
  /** Real viewport width in points; the screen's CSS width divided by this is the content scale. */
  pt: number;
  /** Status bar (or menu bar) height in points. */
  status: number;
  /** Home indicator: width and height in points, or none. */
  home: [number, number] | null;
  /** Screen corner radius in points, measured from the frame CSS; system UI keeps clear of it. */
  radius: number;
  /** Colour tone of each finish, for shadows and the auto pick. */
  tones: Record<string, "light" | "dark" | "tint">;
};

export const SPECS: Record<string, Spec> = {
  "iphone-17": { os: "ios", pt: 402, status: 62, home: [134, 5], radius: 63.5, tones: { black: "dark", white: "light", "mist-blue": "tint", sage: "tint", lavender: "tint", "deep-blue": "dark" } },
  "iphone-18-pro": { os: "ios", pt: 402, status: 62, home: [134, 5], radius: 63.6, tones: { silver: "light", glacier: "tint", black: "dark", burgundy: "dark" } },
  "pixel-10": { os: "android", pt: 412, status: 40, home: [108, 4], radius: 50, tones: { obsidian: "dark", frost: "light", indigo: "tint" } },
  "galaxy-s25": { os: "android", pt: 360, status: 36, home: [100, 4], radius: 36, tones: { "icy-blue": "tint", "silver-shadow": "light", navy: "dark", mint: "tint", "blue-black": "dark" } },
  "ipad-pro": { os: "ipados", pt: 1032, status: 24, home: [320, 5], radius: 29, tones: { "space-black": "dark", silver: "light" } },
  "macbook-pro": { os: "macos", pt: 1512, status: 37, home: null, radius: 18.7, tones: { "space-black": "dark", silver: "light" } },
};

export const PHONES = ["iphone-17", "iphone-18-pro", "pixel-10", "galaxy-s25"] as const;
export const PAGE_DEVICES = ["ipad-pro", "macbook-pro"] as const;

export function geometry(model: string) {
  const g = generated[model];
  if (!g) throw new Error(`unknown device: ${model}`);
  return g.geometry;
}

/** The viewport a screen capture needs so the page fills this device's screen below its status bar, in CSS px. */
export function viewportFor(model: string): { width: number; height: number } {
  const s = SPECS[model];
  const [, , sw, sh] = geometry(model).screen;
  const scale = sw / s.pt;
  return { width: s.pt, height: Math.round(sh / scale - s.status) };
}

/** Outer width (including buttons) that gives this device a screen of the given height in canvas px. Used to size mixed models alike. */
export function widthForScreenHeight(model: string, screenH: number): number {
  const g = geometry(model);
  return (screenH / g.screen[3]) * g.box[2];
}

/** Device height for a given outer width. */
export function heightForWidth(model: string, w: number): number {
  const g = geometry(model);
  return (w / g.box[2]) * g.box[3];
}

function rgb(color: string): [number, number, number] {
  if (color.startsWith("#")) return [0, 2, 4].map((i) => parseInt(color.slice(1 + i, 3 + i), 16)) as [number, number, number];
  const m = color.match(/\d+/g);
  return m ? (m.slice(0, 3).map(Number) as [number, number, number]) : [255, 255, 255];
}

function lum(color: string): number {
  const [r, g, b] = rgb(color);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function hue(color: string): number {
  const [r, g, b] = rgb(color).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (!d) return -1;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

/** True when the ground reads dark. */
export function darkGround(c: Config): boolean {
  const t = c.ground.type;
  if (t === "dark" || t === "photo" || t === "brand-gradient") return true;
  if (t === "mesh" || t === "photo-clear" || t === "tint") return false;
  const accent = c.ground.accent ?? c.bento.accent ?? c.ground.stops[0];
  if (t === "silk" || t === "image") return lum(accent) < 70;
  return c.ground.stops.reduce((a, s) => a + lum(s), 0) / c.ground.stops.length < 90;
}

/**
 * The finish for a model on this render. "auto" follows the ground so black frames are kept for dark grounds:
 * dark grounds take the dark finish; light grounds take a tinted finish matched to the accent hue, else the light one.
 */
export function colourFor(c: Config, model: string, requested = c.phone.colour): string {
  const tones = SPECS[model].tones;
  const names = Object.keys(tones);
  if (requested !== "auto") return names.includes(requested) ? requested : names[0];
  if (darkGround(c)) return names.find((n) => tones[n] === "dark")!;
  const accent = c.ground.accent ?? c.bento.accent ?? c.ground.stops[0];
  const h = hue(accent);
  const tinted = names.filter((n) => tones[n] === "tint");
  const byHue: [string, number][] = [["sage", 130], ["mint", 150], ["mist-blue", 205], ["glacier", 200], ["icy-blue", 200], ["indigo", 230], ["lavender", 265]];
  if (h >= 0 && tinted.length) {
    const best = byHue.filter(([n]) => tinted.includes(n)).sort((a, b) => Math.min(Math.abs(a[1] - h), 360 - Math.abs(a[1] - h)) - Math.min(Math.abs(b[1] - h), 360 - Math.abs(b[1] - h)))[0];
    if (best && Math.min(Math.abs(best[1] - h), 360 - Math.abs(best[1] - h)) < 45) return best[0];
  }
  return names.find((n) => tones[n] === "light") ?? names[0];
}

/** Chrome colours for browser bars and the macOS menu bar, from frame.theme. */
export type Chrome = { bg: string; dot: string; border: string; menu: string; ink: string };

export const CHROME = {
  light: { bg: "#F6F6F4", dot: "#D8D8D5", border: "rgba(0,0,0,.08)", menu: "#E8E8E6", ink: "#1D1D1F" },
  dark: { bg: "#1B1C1C", dot: "#3B3C3C", border: "rgba(255,255,255,.08)", menu: "#111212", ink: "#F2F2F2" },
} satisfies Record<string, Chrome>;

/**
 * Browser window bar inside a laptop or tablet screen, in the same proportions as the plain browser frame
 * (40px bar, 11px dots, 8px gap, 18px inset on a 1200px page). Grey dots are the inactive-window controls; no address text.
 */
const BAR = { h: 40 / 1200, dot: 11 / 1200, gap: 8 / 1200, pad: 18 / 1200 };

/**
 * The screen contents for one device: its platform's own system UI (system-ui.ts), the browser window bar when asked
 * for, the capture below, and the home indicator on touch devices.
 */
function screen(model: string, img: string, pageTop: string, statusBar: boolean, offset: number, imgWidth: number | null, chrome: Chrome | null, browser: boolean): string {
  const s = SPECS[model];
  const [, , sw, sh] = geometry(model).screen;
  const k = sw / s.pt;
  const scaled = (html: string, h: number) => `<div style="position:absolute;left:0;top:0;width:${s.pt}px;height:${h}px;transform:scale(${k});transform-origin:0 0;z-index:3">${html}</div>`;
  const c = chrome ?? CHROME.light;
  const tablet = s.os === "ipados";
  const laptop = s.os === "macos";
  const hasBar = browser && (tablet || laptop);
  // The band behind the system UI: the page's own top colour on phones; the browser bar colour on a tablet with a bar.
  const band = hasBar && tablet ? c.bg : pageTop;
  const ink = lum(band) > 150 ? "#000" : "#fff";
  let system = "";
  if (laptop) system = scaled(macMenuBar(s.pt, s.status, c.menu, c.ink, s.radius), s.status);
  else if (statusBar) {
    const html = s.os === "ios" ? iosStatus(s.pt, s.status, ink, s.radius) : s.os === "android" ? androidStatus(s.pt, s.status, ink, s.radius) : ipadStatus(s.pt, s.status, ink, s.radius);
    system = scaled(html, s.status);
  }
  const f = tablet ? 1.35 : 1;
  const tb = hasBar ? BAR.h * sw * f : 0;
  const d = BAR.dot * sw * f;
  const toolbar = tb
    ? `<div style="position:absolute;left:0;right:0;top:${s.status * k}px;height:${tb}px;display:flex;align-items:center;gap:${BAR.gap * sw * f}px;padding:0 ${BAR.pad * sw * f}px;background:${c.bg};border-bottom:1px solid ${c.border};box-sizing:border-box;z-index:3">${`<i style="width:${d}px;height:${d}px;border-radius:50%;background:${c.dot};display:block"></i>`.repeat(3)}</div>`
    : "";
  const home = s.home && statusBar
    ? `<div style="position:absolute;left:50%;bottom:${8 * k}px;width:${s.home[0] * k}px;height:${s.home[1] * k}px;margin-left:${(-s.home[0] * k) / 2}px;border-radius:9px;background:rgba(255,255,255,.92);box-shadow:0 0 1px rgba(0,0,0,.35);z-index:3"></div>`
    : "";
  const top = s.status * k + tb;
  const w = imgWidth ?? sw;
  return `<div style="position:relative;width:${sw}px;height:${sh}px;overflow:hidden;background:${band}">${system}${toolbar}<div style="position:absolute;left:0;right:0;top:${top}px;bottom:0;overflow:hidden"><img src="${url(img)}" style="display:block;width:${w}px;transform:translateY(-${Math.round(offset * (w / s.pt))}px)"></div>${home}</div>`;
}

export type DeviceOpts = {
  model: string;
  colour: string;
  band?: string;
  statusBar?: boolean;
  /** Crop start in CSS px of the capture. */
  offset?: number;
  extra?: string;
  /** Laptops show a desktop capture fitted to the screen width. */
  desktop?: boolean;
  /** Colours for the browser bar and the macOS menu bar (frame.theme). */
  chrome?: Chrome | null;
  /** Draw the browser window bar (frame.style "browser") on a laptop or tablet. */
  browser?: boolean;
  /** No hardware: the screen alone with rounded corners and a hairline rim (Nixtio). */
  frameless?: boolean;
};

/** A device whose outer box (buttons included) is `box.w` wide at (box.x, box.y) on the canvas. */
export function device(canvasW: number, img: string, box: { x: number; y: number; w: number }, o: DeviceOpts): string {
  const g = generated[o.model];
  if (!g) throw new Error(`unknown device: ${o.model}`);
  const markup = g.colours[o.colour] ?? Object.values(g.colours)[0];
  const [bx, by, bw, bh] = g.geometry.box;
  const s = box.w / bw;
  const k = canvasW / 1600;
  const tone = SPECS[o.model].tones[o.colour] ?? "dark";
  // Light finishes take a softer, cooler shadow so they do not look dirty on light grounds.
  const [a1, a2] = tone === "dark" ? [0.2, 0.26] : [0.12, 0.16];
  const ink = tone === "dark" ? "0,0,0" : "20,30,45";
  const shadow = `drop-shadow(0 ${Math.round(3 * k)}px ${Math.round(5 * k)}px rgba(${ink},${a1})) drop-shadow(0 ${Math.round(40 * k)}px ${Math.round(60 * k)}px rgba(${ink},${a2}))`;
  const scr = screen(o.model, img, o.band ?? "#ffffff", o.statusBar !== false, o.offset ?? 0, o.desktop ? g.geometry.screen[2] : null, o.chrome ?? null, !!o.browser);
  if (o.frameless) {
    const [, , sw, sh] = g.geometry.screen;
    const f = box.w / sw;
    const soft = `drop-shadow(0 ${Math.round(3 * k)}px ${Math.round(5 * k)}px rgba(20,30,45,.16)) drop-shadow(0 ${Math.round(40 * k)}px ${Math.round(60 * k)}px rgba(20,30,45,.24))`;
    return `<div style="position:absolute;left:${box.x}px;top:${box.y}px;width:${Math.round(box.w)}px;height:${Math.round(sh * f)}px;filter:${soft};${o.extra ?? ""}"><div style="transform:scale(${f});transform-origin:0 0;width:${sw}px;height:${sh}px;border-radius:${sw * 0.155}px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.08),inset 0 0 0 1.5px rgba(255,255,255,.55)">${scr}</div></div>`;
  }
  const inner = markup.replace(/<div id="cs-screen">__SCREEN__<\/div>/, scr);
  return `<div style="position:absolute;left:${box.x}px;top:${box.y}px;width:${Math.round(box.w)}px;height:${Math.round(bh * s)}px;filter:${shadow};${o.extra ?? ""}"><div style="position:absolute;left:${-bx * s}px;top:${-by * s}px;transform:scale(${s});transform-origin:0 0">${inner}</div></div>`;
}

/** The capture viewports this config needs: one per distinct phone width, plus the iPad if a page device uses it. */
export function captureViewports(c: Config): { width: number; height: number }[] {
  const models = new Set<string>([c.phone.model, ...(c.phone.mix ? c.phone.mixWith : [])]);
  if (c.frame.device === "ipad-pro") models.add("ipad-pro");
  const seen = new Map<number, { width: number; height: number }>();
  for (const m of models) {
    const v = viewportFor(m);
    if (!seen.has(v.width)) seen.set(v.width, v);
  }
  return [...seen.values()];
}

/** Height of what `device` draws for this width: the screen alone when frameless. */
export function drawnHeight(model: string, w: number, frameless: boolean): number {
  const g = geometry(model);
  return frameless ? (w / g.screen[2]) * g.screen[3] : heightForWidth(model, w);
}

type ShotLike = { file: string; y: number; page: string; topColor?: string; w?: number; scheme?: "light" | "dark" };

/** Mobile shots captured for this model's viewport, in the dark scheme on dark grounds when it was captured. */
export function shotsFor<T extends ShotLike>(c: Config, mobile: T[], model: string): T[] {
  const w = viewportFor(model).width;
  const sized = mobile.filter((s) => s.w === undefined || s.w === w);
  const pool = sized.length ? sized : mobile;
  const want = darkGround(c) ? "dark" : "light";
  const scheme = pool.filter((s) => (s.scheme ?? "light") === want);
  return scheme.length ? scheme : pool;
}
