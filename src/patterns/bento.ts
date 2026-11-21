import { accent, brandLogo, tile, url } from "../look.ts";
import { shotsFor } from "../devices.ts";
import { screens, k } from "./shared.ts";
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
 * margins 0.05W by 0.06H, gaps 0.014W, radius 14, no shadows, six or seven tiles, one dominant.
 * 4 columns by 3 rows. The desktop hero over 3 columns and 2 rows; a phone screen down the 4th column (2 rows on 4:3,
 * all 3 on wide canvases); small tiles along the bottom (four on 4:3, three on wide).
 * Small tiles, in order, only from real inputs: components (source.elements), the hero photo, phone screens captured
 * at their sections, other pages' phone screens, the brand logo, bento.stat, bento.colours, then more desktop screens.
 * Never an empty tile: with fewer inputs, the remaining tiles span the gap.
 */
export const bento: Pattern = {
  id: "bento",
  render(ctx, w, h) {
    const { c, m, top } = ctx;
    const gap = Math.round(w * 0.014);
    const mx = Math.round(w * 0.05);
    const y0 = Math.max(Math.round(h * 0.06), top);
    const ih = h - y0 - Math.round(h * 0.06);
    const wide = w / h > 1.5;
    const cols = 4;
    const rows = 3;
    const cw = (w - mx * 2 - gap * (cols - 1)) / cols;
    const ch = (ih - gap * (rows - 1)) / rows;
    const cell = (col: number, row: number, cs = 1, rs = 1): Cell => ({
      x: Math.round(mx + col * (cw + gap)),
      y: Math.round(y0 + row * (ch + gap)),
      w: Math.round(cw * cs + gap * (cs - 1)),
      h: Math.round(ch * rs + gap * (rs - 1)),
    });
    const views = screens(m);
    // One phone width only (the configured model's), so the same screen never appears twice.
    const phones = m.mobile?.length ? shotsFor(c, m.mobile, c.phone.model) : [];
    const opts = { radius: 14, shadow: false } as const;
    const hero = cell(0, 0, 3, 2);
    const tall = wide ? cell(3, 0, 1, 3) : cell(3, 0, 1, 2);
    const smalls = wide ? [cell(0, 2), cell(1, 2), cell(2, 2)] : [cell(0, 2), cell(1, 2), cell(2, 2), cell(3, 2)];
    const firstPhone = phones.find((p) => p.y === 0);
    const pool: ((b: Cell) => string)[] = [];
    for (const el of m.elements ?? []) pool.push((b) => tile(w, el, b, { fit: "contain", bg: "#FFFFFF", pad: 20, ...opts }));
    // Phone sections were captured by really scrolling to them, so they are always revealed; cropped below the nav.
    // Cropped below the sticky header recorded at capture, so the tile opens on the section's own heading.
    for (const p of phones.filter((p) => p !== firstPhone && p.y > 0))
      pool.push((b) => tile(w, p.file, b, { ...opts, pos: `50% -${Math.round(((p.nav ?? 0) * b.w) / (p.w ?? 402))}px` }));
    for (const p of phones.filter((p) => p !== firstPhone && p.y === 0)) pool.push((b) => tile(w, p.file, b, { ...opts, pos: "50% 0%" }));
    if (m.photo) pool.splice(1, 0, (b) => tile(w, m.photo!, b, { ...opts, pos: "50% 50%" }));
    const logo = brandLogo(c);
    if (logo) pool.push((b) => logoTile(c, w, b, logo));
    if (c.bento.stat) pool.push((b) => statTile(c, w, b, m.photoAlt ?? null));
    if (c.bento.colours.length) pool.push((b) => coloursTile(c, w, b));
    for (const v of views.slice(1)) pool.push((b) => tile(w, v, b, opts));
    // The hero is the tall capture fitted to the tile's width, so the page is never cut at the sides.
    let html = tile(w, m.talls[0].file, hero, { ...opts, pos: `50% ${c.focus.y * 100}%` });
    html += firstPhone ? tile(w, firstPhone.file, tall, { ...opts, pos: "50% 0%" }) : pool.length ? pool.shift()!(tall) : "";
    // Never leave an empty tile: with fewer inputs than slots, the bottom row (or column) is shared out by span.
    const n = Math.min(smalls.length, pool.length);
    let cells = smalls.slice(0, n);
    if (n > 0 && n < smalls.length) {
      const spans = wide ? (n === 1 ? [3] : [1, 2]) : n === 1 ? [4] : n === 2 ? [2, 2] : [1, 1, 2];
      let col = 0;
      cells = spans.map((sp) => { const b = cell(col, 2, sp); col += sp; return b; });
    }
    if (n === 0) html = tile(w, m.talls[0].file, cell(0, 0, 3, 3), { ...opts, pos: `50% ${c.focus.y * 100}%` }) + (firstPhone ? tile(w, firstPhone.file, cell(3, 0, 1, 3), { ...opts, pos: "50% 0%" }) : "");
    html += cells.map((b, i) => pool[i](b)).join("");
    return html;
  },
};
