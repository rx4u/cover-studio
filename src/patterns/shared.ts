import type { Manifest } from "../capture.ts";

/** Distinct desktop views: viewport shots first, then the tall captures of pages not yet shown at y 0. */
export function screens(m: Manifest): string[] {
  const out = m.shots.map((s) => s.file);
  for (const t of m.talls) if (!m.shots.some((s) => s.page === t.page && s.y === 0)) out.push(t.file);
  return out;
}

export const k = (w: number) => w / 1600;

import { CHROME, colourFor, device, drawnHeight, geometry, shotsFor, widthForScreenHeight } from "../devices.ts";
import { frame, pngSize, url } from "../look.ts";
import type { Ctx } from "./types.ts";

/** Phone screens for a model: page tops first, then sections captured by scrolling to them. */
export function phoneScreens(ctx: Ctx, model: string) {
  const pool = shotsFor(ctx.c, ctx.m.mobile, model);
  const tops = pool.filter((s) => s.y === 0);
  const sections = pool.filter((s) => s.y > 0);
  const order = [tops[0], tops[1] ?? sections[0], sections[tops[1] ? 0 : 1] ?? sections[0], ...sections].filter(Boolean);
  return [...new Set(order)];
}

/** One phone of the configured kind, `w` wide (outer). */
export function phoneAt(ctx: Ctx, cw: number, model: string, shot: { file: string; topColor?: string }, x: number, y: number, w: number, extra = ""): string {
  const { c } = ctx;
  return device(cw, shot.file, { x, y, w }, { model, colour: colourFor(c, model), band: shot.topColor, statusBar: c.phone.statusBar, frameless: c.phone.style === "frameless", extra });
}

/** Outer width of a phone whose screen is `screenH` tall, so mixed models line up by screen. */
export function phoneWidthFor(ctx: Ctx, model: string, screenH: number): number {
  const g = geometry(model);
  return ctx.c.phone.style === "frameless" ? (screenH / g.screen[3]) * g.screen[2] : widthForScreenHeight(model, screenH);
}

export function phoneHeight(ctx: Ctx, model: string, w: number): number {
  return drawnHeight(model, w, ctx.c.phone.style === "frameless");
}

/**
 * The page in its frame: the browser frame, or a MacBook or iPad from the device set. `box.w` is the outer width.
 * Returns the html and the drawn box, so a phone can be placed against it.
 */
export function pageFrame(ctx: Ctx, cw: number, box: { x: number; y: number; w: number }): { html: string; h: number } {
  const { c, m } = ctx;
  const d = c.frame.device;
  if (d === "browser") return { html: frame(c, cw, m.talls[0].file, box), h: Infinity };
  const colour = colourFor(c, d, c.frame.colour);
  const chrome = CHROME[c.frame.theme];
  const browser = c.frame.style === "browser";
  if (d === "macbook-pro") return { html: device(cw, m.talls[0].file, box, { model: d, colour, band: m.mobile[0]?.topColor, desktop: true, chrome, browser }), h: drawnHeight(d, box.w, false) };
  const shot = shotsFor(c, m.mobile, "ipad-pro")[0] ?? m.mobile[0];
  return { html: device(cw, shot.file, box, { model: d, colour, band: shot.topColor, statusBar: c.phone.statusBar, chrome, browser }), h: drawnHeight(d, box.w, false) };
}

/** A real component card: the capture whole, on its own page surface (the capture's corner colour), never cropped. */
export function componentCard(cw: number, file: string, box: { x: number; y: number; w: number; h: number }, o: { shadow?: string; radius?: number; extra?: string } = {}): string {
  const r = (o.radius ?? 16) * (cw / 1600);
  const surface = `url('${url(file)}') 0 0 / 40000% 40000% no-repeat`;
  return `<div style="position:absolute;left:${Math.round(box.x)}px;top:${Math.round(box.y)}px;width:${Math.round(box.w)}px;height:${Math.round(box.h)}px;border-radius:${r}px;overflow:hidden;background:${surface};box-shadow:${o.shadow ?? "none"};display:flex;align-items:center;justify-content:center;${o.extra ?? ""}"><img src="${url(file)}" style="display:block;max-width:100%;max-height:100%;width:auto;height:auto"></div>`;
}

/** Size of a component shown at scale `s` of its CSS size, fitted into maxW by maxH. */
export function componentSize(file: string, maxW: number, maxH: number, maxScale: number): { w: number; h: number } {
  const [iw, ih] = pngSize(file);
  const cssW = iw / 2, cssH = ih / 2;
  const s = Math.min(maxW / cssW, maxH / cssH, maxScale);
  return { w: cssW * s, h: cssH * s };
}

/**
 * A staggered page mosaic (EKON, KORDA): three rows of crops, the hero first screen in the middle at 0.52W (16:10),
 * the other tiles distinct sections of the stitched page, each opened just above a section start, then the site's own
 * photographs when sections run out. Nothing repeats. Rows bleed off every edge. `rotate` turns the whole mosaic in
 * plane (degrees) with a mild perspective; it is scaled up to keep the corners covered.
 */
export function mosaic(ctx: Ctx, w: number, h: number, rotate = 0): string {
  const { c, m } = ctx;
  const gap = w * 0.016;
  const heroW = w * 0.52;
  const heroH = heroW / 1.6;
  const midY = (h - heroH) / 2;
  const topH = midY - gap + w * 0.06;
  const botY = midY + heroH + gap;
  const botH = h - botY + w * 0.06;
  // [x0, x1] per tile in fractions of W, measured from EKON; the middle tile of the middle row is the hero.
  const rows: { y: number; h: number; xs: [number, number][] }[] = [
    { y: -w * 0.06, h: topH, xs: [[-0.25, 0.355], [0.371, 0.847], [0.863, 1.25]] },
    { y: midY, h: heroH, xs: [[-0.1, 0.238], [0.254, 0.774], [0.79, 1.2]] },
    { y: botY, h: botH, xs: [[-0.2, 0.09], [0.106, 0.597], [0.613, 1.2]] },
  ];
  const full = m.full?.[0]?.file;
  const starts = m.sections?.[0] ?? [];
  const picked: number[] = [];
  for (const t of starts) {
    if (t < 700) continue;
    if (picked.length && t - picked[picked.length - 1] < 540) continue;
    picked.push(t);
  }
  // The page's CSS height, from the PNG header (width is always 1440 CSS px), so no tile runs past the page end.
  let pageH = Infinity;
  if (full) {
    const [fw, fh] = pngSize(full);
    pageH = (fh / fw) * 1440;
  }
  const imgs = (m.images ?? []).slice(1);
  let si = 0, ii = 0;
  const r = 10 * (w / 1600);
  let out = "";
  for (const [ri, row] of rows.entries()) {
    for (const [ci, [a, b]] of row.xs.entries()) {
      const x = a * w, tw = (b - a) * w;
      const box = `position:absolute;left:${Math.round(x)}px;top:${Math.round(row.y)}px;width:${Math.round(tw)}px;height:${Math.round(row.h)}px;border-radius:${r}px;overflow:hidden;background:#fff`;
      if (ri === 1 && ci === 1) {
        out += `<div style="${box};box-shadow:0 30px 60px -30px rgba(0,0,0,.35)"><img src="${url(m.talls[0].file)}" style="display:block;width:100%;height:100%;object-fit:cover;object-position:50% ${c.focus.y * 100}%"></div>`;
        continue;
      }
      // Wide tiles show a section at page scale; for a section, the page is scaled so 1440 CSS px fill the tile.
      if (full && si < picked.length) {
        const pw = Math.max(tw, row.h * 1.6);
        const t = Math.min(picked[si++], pageH - row.h * (1440 / pw) + 24);
        out += `<div style="${box}"><img src="${url(full)}" style="display:block;width:${Math.round(pw)}px;transform:translate(${Math.round((tw - pw) / 2)}px,-${Math.round((t - 24) * (pw / 1440))}px)"></div>`;
      } else if (ii < imgs.length) {
        out += `<div style="${box}"><img src="${url(imgs[ii++])}" style="display:block;width:100%;height:100%;object-fit:cover"></div>`;
      }
    }
  }
  if (!rotate) return out;
  return `<div style="position:absolute;inset:0;perspective:${Math.round(3200 * (w / 1600))}px"><div style="position:absolute;inset:0;transform:rotateX(8deg) rotateZ(${rotate}deg) scale(1.18);transform-origin:50% 50%">${out}</div></div>`;
}
