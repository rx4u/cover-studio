import { accent, brandLogo, tile, url } from "../look.ts";
import { screens, k } from "./shared.ts";
import type { Ctx, Pattern } from "./types.ts";

type Cell = { x: number; y: number; w: number; h: number };

function logoTile(c: Ctx["c"], w: number, b: Cell, logo: string): string {
  const r = 10 * k(w);
  return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${r}px;background:${accent(c)};display:flex;align-items:center;justify-content:center"><img src="${url(logo)}" style="max-width:55%;max-height:40%"></div>`;
}

function statTile(c: Ctx["c"], w: number, b: Cell, photo: string | null): string {
  const s = c.bento.stat!;
  const r = 10 * k(w);
  const bg = photo ? `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,0) 60%), url('${url(photo)}') center / cover` : accent(c);
  return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${r}px;background:${bg};color:#fff;font-family:system-ui,sans-serif;padding:${Math.round(b.w * 0.08)}px"><div style="font-size:${Math.round(b.h * 0.26)}px;font-weight:500;letter-spacing:-.03em;line-height:1">${s.value}</div><div style="margin-top:${Math.round(b.h * 0.04)}px;font-size:${Math.round(b.h * 0.06)}px;opacity:.85">${s.label}</div></div>`;
}

function coloursTile(c: Ctx["c"], w: number, b: Cell): string {
  const r = 10 * k(w);
  const n = c.bento.colours.length;
  const sw = c.bento.colours
    .map((col) => `<div style="flex:1;background:${col.hex};display:flex;flex-direction:column;justify-content:flex-end;padding:${Math.round(b.w * 0.04)}px;font:500 ${Math.round(b.h * 0.05)}px/1.3 system-ui,sans-serif;color:${parseInt(col.hex.slice(1, 3), 16) * 0.3 + parseInt(col.hex.slice(3, 5), 16) * 0.59 + parseInt(col.hex.slice(5, 7), 16) * 0.11 > 150 ? "#111" : "#fff"}">${col.name}<span style="opacity:.7">${col.hex.toUpperCase()}</span></div>`)
    .join("");
  return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${r}px;overflow:hidden;display:flex;flex-direction:${n > 3 ? "row" : "column"}">${sw}</div>`;
}

/**
 * A 3x2 grid: one dominant hero tile and four supporting tiles.
 * Supporting tiles only use real inputs: brand logo, bento.stat, bento.colours, components, photo, screens.
 */
export const bento: Pattern = {
  id: "bento",
  render(ctx, w, h) {
    const { c, m, top } = ctx;
    const gap = Math.round(12 * k(w));
    const mx = Math.round(w * 0.05);
    const y0 = Math.max(Math.round(h * 0.06), top);
    const cw = Math.floor((w - mx * 2 - gap * 2) / 3);
    const ch = Math.floor((h - y0 - Math.round(h * 0.06) - gap) / 2);
    const cell = (col: number, row: number, span = 1): Cell => ({ x: mx + col * (cw + gap), y: y0 + row * (ch + gap), w: cw * span + gap * (span - 1), h: ch });
    const views = screens(m);
    const logo = brandLogo(c);
    const pool: ((b: Cell) => string)[] = [];
    if (logo) pool.push((b) => logoTile(c, w, b, logo));
    if (c.bento.stat) pool.push((b) => statTile(c, w, b, m.photo));
    for (const el of m.elements ?? []) pool.push((b) => tile(w, el, b, { fit: "contain", bg: "#FFFFFF", pad: 20, radius: 10, shadow: false }));
    if (c.bento.colours.length) pool.push((b) => coloursTile(c, w, b));
    if (m.photo && !c.bento.stat) pool.push((b) => tile(w, m.photo!, b, { radius: 10, shadow: false, pos: "50% 50%" }));
    for (const v of views.slice(1)) pool.push((b) => tile(w, v, b, { radius: 10, shadow: false }));
    const hero = tile(w, views[0], cell(1, 0, 2), { radius: 10, shadow: false });
    const slots = [cell(0, 0), cell(0, 1), cell(1, 1), cell(2, 1)];
    return hero + slots.map((b, i) => (pool[i] ? pool[i](b) : "")).join("");
  },
};
