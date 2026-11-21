import { accent, brandLogo, pngSize, tile, url } from "../look.ts";
import { shotsFor } from "../devices.ts";
import { componentCard, componentSize, k } from "./shared.ts";
import type { Ctx, Pattern } from "./types.ts";

type Cell = { x: number; y: number; w: number; h: number };

function logoTile(c: Ctx["c"], w: number, b: Cell, logo: string): string {
  const r = 14 * k(w);
  return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${r}px;background:${accent(c)};display:flex;align-items:center;justify-content:center"><img src="${url(logo)}" style="max-width:55%;max-height:40%"></div>`;
}

function statTile(c: Ctx["c"], w: number, b: Cell, photo: string | null): string {
  const s = c.bento.stat!;
  const r = 14 * k(w);
  const bg = photo ? `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,0) 60%), url('${url(photo)}') center / cover` : accent(c);
  return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${r}px;background:${bg};color:#fff;font-family:system-ui,sans-serif;padding:${Math.round(b.w * 0.08)}px"><div style="font-size:${Math.round(b.h * 0.26)}px;font-weight:500;letter-spacing:-.03em;line-height:1">${s.value}</div><div style="margin-top:${Math.round(b.h * 0.04)}px;font-size:${Math.round(b.h * 0.06)}px;opacity:.85">${s.label}</div></div>`;
}

function coloursTile(c: Ctx["c"], w: number, b: Cell): string {
  const r = 14 * k(w);
  const n = c.bento.colours.length;
  const sw = c.bento.colours
    .map((col) => `<div style="flex:1;background:${col.hex};display:flex;flex-direction:column;justify-content:flex-end;padding:${Math.round(b.w * 0.04)}px;font:500 ${Math.round(b.h * 0.05)}px/1.3 system-ui,sans-serif;color:${parseInt(col.hex.slice(1, 3), 16) * 0.3 + parseInt(col.hex.slice(3, 5), 16) * 0.59 + parseInt(col.hex.slice(5, 7), 16) * 0.11 > 150 ? "#111" : "#fff"}">${col.name}<span style="opacity:.7">${col.hex.toUpperCase()}</span></div>`)
    .join("");
  return `<div style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${r}px;overflow:hidden;display:flex;flex-direction:${n > 3 ? "row" : "column"}">${sw}</div>`;
}

/**
 * A mosaic of real tiles. Measured from Clyra, Raya Reserve and a dark product bento on Dribbble:
 * margins 0.05W by 0.06H, gaps 0.014W, radius 14, no shadows. 4 columns by 3 rows.
 * The desktop hero over 3 columns and 2 rows (the tall capture fitted to width). Down the 4th column, 2 rows: the phone
 * screen of a later section, so it adds content instead of repeating the hero. Four small tiles along the bottom are
 * whole things only, never page fragments: the site's own photographs (cover-cropped, as photos can be), one real
 * component on its own surface when its shape suits the tile, then brand tiles from config. Never an empty tile: with fewer inputs, the remaining tiles span the gap.
 */
export const bento: Pattern = {
  id: "bento",
  render(ctx, w, h) {
    const { c, m, top } = ctx;
    const gap = Math.round(w * 0.014);
    const mx = Math.round(w * 0.05);
    const y0 = Math.max(Math.round(h * 0.06), top);
    const ih = h - y0 - Math.round(h * 0.06);
    const cols = 4, rows = 3;
    const cw = (w - mx * 2 - gap * (cols - 1)) / cols;
    const ch = (ih - gap * (rows - 1)) / rows;
    const cell = (col: number, row: number, cs = 1, rs = 1): Cell => ({
      x: Math.round(mx + col * (cw + gap)),
      y: Math.round(y0 + row * (ch + gap)),
      w: Math.round(cw * cs + gap * (cs - 1)),
      h: Math.round(ch * rs + gap * (rs - 1)),
    });
    const opts = { radius: 14, shadow: false } as const;
    const hero = cell(0, 0, 3, 2);
    // Same grid on every canvas: a 1x3 side column on wide canvases would crop the phone screen's sides.
    const side = cell(3, 0, 1, 2);
    const smalls = [cell(0, 2), cell(1, 2), cell(2, 2), cell(3, 2)];
    const phones = m.mobile?.length ? shotsFor(c, m.mobile, c.phone.model) : [];
    const sidePhone = phones.find((p) => p.y > 0) ?? phones[0];
    // The largest photo is usually the hero's own: start from the second when there are enough.
    const imgs = [...(m.images ?? [])];
    const photos = imgs.length > smalls.length ? imgs.slice(1) : imgs;
    if (!photos.length && m.photo) photos.push(m.photo);
    const photo = (f: string) => (b: Cell) => tile(w, f, b, { ...opts, pos: "50% 50%" });
    const comp = (f: string) => (b: Cell) => componentCard(w, f, b, { radius: 14 }).replace(/max-width:100%;max-height:100%;width:auto;height:auto/, (() => { const s = componentSize(f, b.w * 0.86, b.h * 0.86, 2 * k(w)); return `width:${Math.round(s.w)}px;height:${Math.round(s.h)}px`; })());
    const pool: ((b: Cell) => string)[] = [];
    const ph = photos.map(photo);
    // A component only when it reads at tile size: its shape close to the tile's (a wide table in a square tile
    // would shrink to unreadable).
    const tileAspect = smalls[0].w / smalls[0].h;
    const el = (m.elements ?? [])
      .filter((f) => { const [iw, ih] = pngSize(f); const a = iw / ih / tileAspect; return a > 0.6 && a < 1.7; })
      .slice(0, 1)
      .map(comp);
    // Photo, component, photo, photo: imagery with one product detail.
    if (ph[0]) pool.push(ph[0]);
    if (el[0]) pool.push(el[0]);
    pool.push(...ph.slice(1));
    const logo = brandLogo(c);
    if (logo) pool.push((b) => logoTile(c, w, b, logo));
    if (c.bento.stat) pool.push((b) => statTile(c, w, b, m.photoAlt ?? null));
    if (c.bento.colours.length) pool.push((b) => coloursTile(c, w, b));
    let html = tile(w, m.talls[0].file, hero, { ...opts, pos: `50% ${c.focus.y * 100}%` });
    html += sidePhone ? tile(w, sidePhone.file, side, { ...opts, pos: "50% 0%" }) : pool.length ? pool.shift()!(side) : "";
    const n = Math.min(smalls.length, pool.length);
    let cells = smalls.slice(0, n);
    if (n > 0 && n < smalls.length) {
      const spans = n === 1 ? [4] : n === 2 ? [2, 2] : [1, 1, 2];
      let col = 0;
      cells = spans.map((sp) => { const b = cell(col, 2, sp); col += sp; return b; });
    }
    if (n === 0) {
      html = tile(w, m.talls[0].file, cell(0, 0, 3, 3), { ...opts, pos: `50% ${c.focus.y * 100}%` }) + (sidePhone ? tile(w, sidePhone.file, cell(3, 0, 1, 3), { ...opts, pos: "50% 0%" }) : "");
    }
    html += cells.map((b, i) => pool[i](b)).join("");
    return html;
  },
};
