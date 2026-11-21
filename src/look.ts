import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import type { Config } from "./config.ts";
import { fromConfig } from "./config.ts";
import { pastel, shade, tint, type ShaderSpec } from "./grounds.ts";

export const url = (file: string) => pathToFileURL(file).href;

const ORIGIN: Record<string, string> = {
  "top-left": "0% 0%",
  "top-right": "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right": "100% 100%",
  center: "50% 50%",
};

/** The brand accent for derived grounds: ground.accent, else bento.accent, else the first stop. */
export function groundAccent(c: Config): string {
  return c.ground.accent ?? c.bento.accent ?? c.ground.stops[0];
}

/**
 * The ground as an HTML layer covering the canvas. Specs measured from reference shots (docs/patterns.md, Grounds).
 * `photo` is the cached hero photo; `shaderFile` is the pre-rendered still for mesh and silk.
 */
export function groundLayer(c: Config, photo: string | null, shaderFile: string | null, w: number, heroShot: string | null = null, photoAlt: string | null = null): string {
  const g = c.ground;
  const k = w / 1600;
  const layer = (css: string) => `<div style="position:absolute;inset:0;${css}"></div>`;
  const stops = g.stops.length === 1 ? [g.stops[0], g.stops[0]] : g.stops;
  const acc = groundAccent(c);
  switch (g.type) {
    case "solid":
      return layer(`background:${g.stops[0]}`);
    case "linear":
      return layer(`background:linear-gradient(${g.angle}deg, ${stops.join(", ")})`);
    case "radial":
      return layer(`background:radial-gradient(ellipse 130% 110% at ${ORIGIN[g.origin]}, ${stops.join(", ")})`);
    case "image":
    case "photo-clear": {
      // Clear photo prefers an image from further down the page, so the ground never duplicates the hero (Growly ref).
      const src = g.type === "image" ? fromConfig(c, g.image!) : (photoAlt ?? photo);
      if (!src) return layer(`background:${g.stops[0]}`);
      const dim = g.dim > 0 ? layer(`background:rgba(0,0,0,${g.dim})`) : "";
      return layer(`background:url('${url(src)}') center / cover no-repeat`) + dim;
    }
    case "photo": {
      // Atmospheric: the site photo blurred and darkened, darker towards the bottom (Phenomenon refs: edge luminance 30 to 70).
      // Sites without a usable photo use their own hero screenshot, which is always on-brand.
      const src = photo ?? heroShot;
      if (!src) return layer(`background:${shade(acc, 0.78)}`);
      return (
        `<div style="position:absolute;inset:-8%;background:url('${url(src)}') center / cover no-repeat;filter:blur(${Math.round(g.blur * k)}px) brightness(${g.brightness}) saturate(1.15)"></div>` +
        layer("background:linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,.5) 100%)")
      );
    }
    case "brand-gradient":
      // Ramotion Borea: light accent into deep accent into near black, on the diagonal.
      return layer(`background:linear-gradient(155deg, ${tint(acc, 0.35)} 0%, ${acc} 34%, ${shade(acc, 0.7)} 70%, #0A0A0B 100%)`);
    case "dark":
      // Zajno: a flat, deep, tinted dark (measured #09161C for a navy accent).
      return layer(`background:${shade(acc, 0.8)}`);
    case "mesh":
    case "silk":
      return shaderFile ? layer(`background:url('${url(shaderFile)}') center / cover no-repeat`) : layer(`background:${tint(acc, 0.85)}`);
  }
}

/** Shader settings for mesh and silk grounds, tuned against Afterglow, Clearbit and BL/S references. */
export function shaderSpec(c: Config): ShaderSpec | null {
  const g = c.ground;
  const acc = groundAccent(c);
  if (g.type === "mesh") {
    // Afterglow and Clearbit: clean pastels of the brand hue plus a neighbouring hue, with white, never grey.
    const colors = g.stops.length >= 3 ? g.stops : [pastel(acc, 0.55, 0.93), pastel(acc, 0.6, 0.8), "#FFFFFF", pastel(acc, 0.5, 0.88, 40), pastel(acc, 0.65, 0.72), pastel(acc, 0.45, 0.95, -30)];
    return { kind: "static-mesh", colors, seed: g.seed, params: { mixing: 0.8, waveX: 0.55, waveXShift: 0.5, waveY: 0.45, waveYShift: 0.3 } };
  }
  if (g.type === "silk") {
    // BL/S silk: folds need a wide tonal range. Dark brand colours get lighter highlights so the folds still read.
    const lum = (() => { const n = parseInt(acc.slice(1, 7), 16); return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255); })();
    const lift = lum < 70 ? 0.25 : 0;
    const colors = g.stops.length >= 3 ? g.stops : [shade(acc, 0.6), tint(acc, 0.15 + lift), tint(acc, 0.55 + lift), shade(acc, 0.8), tint(acc, Math.min(0.92, 0.72 + lift))];
    return { kind: "mesh", colors, seed: g.seed, params: { distortion: 1, swirl: 0.85 } };
  }
  return null;
}

/** Full-canvas SVG pattern layer with a fade mask. Empty string when pattern.type is none. */
export function patternLayer(c: Config, w: number, h: number): string {
  const p = c.pattern;
  if (p.type === "none") return "";
  const k = w / 1600;
  const s = (n: number) => +(n * p.scale * k).toFixed(2);
  const stroke = `stroke="${p.color}" stroke-width="${Math.max(1, s(1))}" fill="none"`;
  let defs = "";
  let body = `<rect width="100%" height="100%" fill="url(#pt)"/>`;
  const rot = p.angle ? ` patternTransform="rotate(${p.angle})"` : "";
  switch (p.type) {
    case "grid":
      defs = `<pattern id="pt" width="${s(48)}" height="${s(48)}" patternUnits="userSpaceOnUse"${rot}><path d="M ${s(48)} 0 L 0 0 0 ${s(48)}" ${stroke}/></pattern>`;
      break;
    case "dots":
      defs = `<pattern id="pt" width="${s(24)}" height="${s(24)}" patternUnits="userSpaceOnUse"${rot}><circle cx="${s(12)}" cy="${s(12)}" r="${s(1.6)}" fill="${p.color}"/></pattern>`;
      break;
    case "lines":
      defs = `<pattern id="pt" width="${s(18)}" height="${s(18)}" patternUnits="userSpaceOnUse" patternTransform="rotate(${p.angle || 45})"><line x1="0" y1="0" x2="0" y2="${s(18)}" ${stroke}/></pattern>`;
      break;
    case "rings": {
      const [ox, oy] = (ORIGIN[p.fade === "none" ? "top-right" : p.fade] ?? "100% 0%").split(" ").map((v) => parseFloat(v) / 100);
      const cx = ox * w, cy = oy * h, step = s(56);
      const max = Math.hypot(w, h);
      body = "";
      for (let r = step; r < max; r += step) body += `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" ${stroke}/>`;
      break;
    }
    case "svg":
      defs = `<pattern id="pt" width="${s(200)}" height="${s(200)}" patternUnits="userSpaceOnUse"${rot}><image href="${url(fromConfig(c, p.svg!))}" width="${s(200)}" height="${s(200)}"/></pattern>`;
      break;
  }
  const mask = p.fade === "none" ? "" : `-webkit-mask-image: radial-gradient(ellipse 75% 65% at ${ORIGIN[p.fade]}, #000 15%, transparent 72%); mask-image: radial-gradient(ellipse 75% 65% at ${ORIGIN[p.fade]}, #000 15%, transparent 72%);`;
  return `<svg class="pattern" width="${w}" height="${h}" style="position:absolute;inset:0;opacity:${p.opacity};${mask}"><defs>${defs}</defs>${body}</svg>`;
}

const SHADOW: Record<string, string> = {
  none: "none",
  soft: "0 40px 80px -30px rgba(0,0,0,.28), 0 12px 28px -14px rgba(0,0,0,.18)",
  lifted: "0 60px 120px -30px rgba(0,0,0,.45), 0 20px 40px -18px rgba(0,0,0,.3)",
};

export type Box = { x: number; y: number; w: number; h?: number };

/**
 * A browser frame (or a bare rounded image) positioned on the canvas.
 * When `box.h` is omitted, the frame is as tall as the image and may run off the canvas.
 * `focus` anchors object-position for cropped images.
 */
export function frame(c: Config, canvasW: number, img: string, box: Box, focus = "0% 0%", extra = ""): string {
  const k = canvasW / 1600;
  const f = c.frame;
  const r = f.radius * k;
  const bar = f.style === "browser" ? Math.round(40 * k) : 0;
  const dark = f.theme === "dark";
  const barBg = dark ? "#1B1C1C" : "#F6F6F4";
  const dot = dark ? "#3B3C3C" : "#D8D8D5";
  const border = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
  const d = Math.round(11 * k);
  const dots = bar ? `<div style="height:${bar}px;background:${barBg};display:flex;align-items:center;gap:${Math.round(8 * k)}px;padding:0 ${Math.round(18 * k)}px;border-bottom:1px solid ${border}">${`<i style="width:${d}px;height:${d}px;border-radius:50%;background:${dot};display:block"></i>`.repeat(3)}</div>` : "";
  const imgCss = box.h
    ? `display:block;width:100%;height:${box.h - bar}px;object-fit:cover;object-position:${focus}`
    : `display:block;width:100%;height:auto`;
  return `<div style="position:absolute;left:${box.x}px;top:${box.y}px;width:${box.w}px;border-radius:${r}px;overflow:hidden;border:1px solid ${border};box-shadow:${SHADOW[f.shadow]};background:${barBg};${extra}">${dots}<img src="${url(img)}" style="${imgCss}"></div>`;
}

/** Branding header. Returns the html and the height it reserves at the top of the canvas. */
export function branding(c: Config, w: number, h: number, isCover: boolean): { html: string; top: number } {
  const b = c.branding;
  if (!b.enabled || (isCover && !b.onCover) || (!b.left && !b.right)) return { html: "", top: 0 };
  const k = w / 1600;
  const y = Math.round(h * 0.05);
  const side = (slot: typeof b.left, align: "left" | "right") =>
    slot ? `<img src="${url(fromConfig(c, slot.logo))}" style="position:absolute;top:${y}px;${align}:${Math.round(w * 0.065)}px;height:${Math.round(slot.height * k)}px">` : "";
  const tallest = Math.max(b.left?.height ?? 0, b.right?.height ?? 0) * k;
  return { html: side(b.left, "left") + side(b.right, "right"), top: Math.round(y + tallest + h * 0.04) };
}

/**
 * A modern phone: thin black bezel with a metal edge, side buttons and an island.
 * The page starts below a status bar band in the page's own top colour, so the island never covers content.
 * `offset` is the crop start in CSS px of the 390-wide capture. No fake clock, battery or badges.
 */
export function phone(canvasW: number, img: string, box: { x: number; y: number; w: number }, offset = 0, band = "#ffffff", extra = ""): string {
  const k = canvasW / 1600;
  const W = box.w;
  const bezel = Math.max(4, Math.round(W * 0.03));
  const sw = W - bezel * 2;
  const sh = Math.round(sw * 2.165);
  const H = sh + bezel * 2;
  const r = Math.round(W * 0.16);
  const sr = r - bezel;
  const barH = Math.round(sw * 0.13);
  const scale = sw / 390;
  const islandW = Math.round(sw * 0.31), islandH = Math.round(sw * 0.088);
  const btn = (side: "left" | "right", top: number, h: number) =>
    `<i style="position:absolute;${side}:-${Math.max(2, Math.round(W * 0.011))}px;top:${Math.round(H * top)}px;width:${Math.max(2, Math.round(W * 0.012))}px;height:${Math.round(H * h)}px;border-radius:2px;background:linear-gradient(${side === "left" ? 90 : 270}deg,#5a5a5f,#2a2a2d);display:block"></i>`;
  const shadow = `0 ${Math.round(2 * k)}px ${Math.round(4 * k)}px rgba(0,0,0,.25), 0 ${Math.round(24 * k)}px ${Math.round(40 * k)}px -${Math.round(12 * k)}px rgba(0,0,0,.28), 0 ${Math.round(70 * k)}px ${Math.round(120 * k)}px -${Math.round(30 * k)}px rgba(0,0,0,.35)`;
  return `<div style="position:absolute;left:${box.x}px;top:${box.y}px;width:${W}px;height:${H}px;${extra}">
${btn("left", 0.175, 0.035)}${btn("left", 0.245, 0.065)}${btn("left", 0.325, 0.065)}${btn("right", 0.27, 0.1)}
<div style="position:relative;width:${W}px;height:${H}px;padding:${bezel}px;border-radius:${r}px;background:#0b0b0c;box-shadow:${shadow}, inset 0 0 0 ${Math.max(1, Math.round(1.5 * k))}px #4b4b50, inset 0 0 0 ${Math.max(2, Math.round(3 * k))}px #161618">
<div style="position:relative;width:${sw}px;height:${sh}px;border-radius:${sr}px;overflow:hidden;background:${band}">
<div style="height:${barH}px;background:${band}"></div>
<div style="height:${sh - barH}px;overflow:hidden"><img src="${url(img)}" style="display:block;width:${sw}px;transform:translateY(-${Math.round(offset * scale)}px)"></div>
<i style="position:absolute;top:${Math.round(sw * 0.032)}px;left:50%;transform:translateX(-50%);width:${islandW}px;height:${islandH}px;border-radius:99px;background:#000;display:block"></i>
</div></div></div>`;
}

/** A borderless rounded image tile with a soft shadow, cover-fit inside its box. */
export function tile(canvasW: number, img: string, box: { x: number; y: number; w: number; h: number }, opts: { fit?: "cover" | "contain"; pos?: string; bg?: string; radius?: number; shadow?: boolean; pad?: number } = {}): string {
  const k = canvasW / 1600;
  const r = (opts.radius ?? 12) * k;
  const pad = (opts.pad ?? 0) * k;
  const sh = opts.shadow === false ? "none" : SHADOW.soft;
  return `<div style="position:absolute;left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px;border-radius:${r}px;overflow:hidden;background:${opts.bg ?? "transparent"};box-shadow:${sh};padding:${pad}px"><img src="${url(img)}" style="display:block;width:100%;height:100%;object-fit:${opts.fit ?? "cover"};object-position:${opts.pos ?? "50% 0%"}"></div>`;
}

/** The accent colour for brand tiles: bento.accent, else the darkest ground stop. */
export function accent(c: Config): string {
  if (c.bento.accent) return c.bento.accent;
  const lum = (h: string) => {
    const n = parseInt(h.slice(1, 7).padEnd(6, "0"), 16);
    return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  };
  const darkest = [...c.ground.stops].sort((a, b) => lum(a) - lum(b))[0];
  return lum(darkest) < 90 ? darkest : "#1F2A2C";
}

/** The logo used inside brand tiles: bento.logo, else branding.left. */
export function brandLogo(c: Config): string | null {
  const p = c.bento.logo ?? c.branding.left?.logo ?? null;
  return p ? fromConfig(c, p) : null;
}

/** Width and height of a PNG from its header (all captures are PNG). */
export function pngSize(file: string): [number, number] {
  const b = readFileSync(file);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}
