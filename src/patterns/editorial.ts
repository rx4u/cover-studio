import { url } from "../look.ts";
import type { Pattern } from "./types.ts";

/**
 * The page cut like a magazine spread, at large scale. Measured from One Week Wonders (Guraisu, Madefact):
 * margins 0.03W, gaps 0.012W, radius 8, no shadows, no browser chrome.
 * Lead: the top of the page, 0.565W wide from 0.03H, running off the bottom.
 * Right: two different sections stacked, 0.4W wide and running off the right edge, shown 1.25x larger than the lead
 * so their own type reads big: the upper one runs off the top and ends at 0.4H, the lower one fills to the bottom.
 * Each opens on a section start. All type is the site's own; nothing is added.
 */
export const editorial: Pattern = {
  id: "editorial",
  unavailable: ({ m }) => ((m.sections?.[0]?.length ?? 0) >= 2 ? null : "needs a full-page capture with at least 2 sections"),
  render({ m, top }, w, h) {
    const k = w / 1600;
    const file = m.full[0].file;
        const mx = Math.round(w * 0.03);
    const gap = Math.round(w * 0.012);
    const r = Math.round(8 * k);
    const lw = Math.round(w * 0.565);
    const y0 = Math.max(Math.round(h * 0.03), top);
    const rx = mx + lw + gap;
    const rw = w - rx + r * 2;
    const crop = (x: number, y: number, cw: number, ch: number, pageW: number, start: number, radius: string) =>
      `<div style="position:absolute;left:${x}px;top:${y}px;width:${cw}px;height:${ch}px;border-radius:${radius};overflow:hidden;background:#fff"><img src="${url(file)}" style="display:block;width:${Math.round(pageW)}px;transform:translateY(-${Math.round(start * (pageW / 1440))}px)"></div>`;
    let out = crop(mx, y0, lw, h - y0 + r * 2, lw, 0, `${r}px ${r}px 0 0`);
    // Sections past the first screen, the deeper one first in the lower slot: a top and a lower spread.
    const starts = (m.sections?.[0] ?? []).filter((t) => t > 900);
    const a = starts[Math.floor(starts.length * 0.25)] ?? starts[0];
    const b = starts[Math.floor(starts.length * 0.6)] ?? starts[starts.length - 1];
    const pageW = rw * 1.25 / 0.62;
    const split = Math.round(h * 0.4);
    // Each crop opens 24 CSS px above its section's start, so the section's own heading leads.
    out += crop(rx, -r * 2, rw, split + r * 2, pageW, Math.max(0, a - 24 - (r * 2 * 1440) / pageW), `0 0 0 ${r}px`);
    out += crop(rx, split + gap, rw, h - split - gap + r * 2, pageW, b - 24, `${r}px 0 0 0`);
    return out;
  },
};
