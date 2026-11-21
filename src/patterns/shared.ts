import type { Manifest } from "../capture.ts";

/** Distinct desktop views: viewport shots first, then the tall captures of pages not yet shown at y 0. */
export function screens(m: Manifest): string[] {
  const out = m.shots.map((s) => s.file);
  for (const t of m.talls) if (!m.shots.some((s) => s.page === t.page && s.y === 0)) out.push(t.file);
  return out;
}

export const k = (w: number) => w / 1600;

import { colourFor, device, drawnHeight, geometry, shotsFor, widthForScreenHeight } from "../devices.ts";
import { frame } from "../look.ts";
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
  if (d === "macbook-pro") return { html: device(cw, m.talls[0].file, box, { model: d, colour, band: m.mobile[0]?.topColor, desktop: true }), h: drawnHeight(d, box.w, false) };
  const shot = shotsFor(c, m.mobile, "ipad-pro")[0] ?? m.mobile[0];
  return { html: device(cw, shot.file, box, { model: d, colour, band: shot.topColor, statusBar: c.phone.statusBar }), h: drawnHeight(d, box.w, false) };
}
