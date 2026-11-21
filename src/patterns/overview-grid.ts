import { tile } from "../look.ts";
import { screens } from "./shared.ts";
import type { Pattern } from "./types.ts";

/** Every view at a glance: an even 3x2 grid (2x2 with four or five views). No bleed. For case study openers. */
export const overviewGrid: Pattern = {
  id: "overview-grid",
  unavailable: ({ m }) => (screens(m).length >= 4 ? null : "needs at least 4 views; add pages or scrollPositions"),
  render({ m, top }, w, h) {
    const v = screens(m);
    const cols = v.length >= 6 ? 3 : 2;
    const items = v.slice(0, cols * 2);
    const mx = Math.round(w * 0.05);
    const gap = Math.round(w * 0.02);
    const y0 = Math.max(Math.round(h * 0.07), top);
    const cw = (w - mx * 2 - gap * (cols - 1)) / cols;
    const ch = (h - y0 - Math.round(h * 0.07) - gap) / 2;
    return items.map((f, i) => tile(w, f, { x: Math.round(mx + (i % cols) * (cw + gap)), y: Math.round(y0 + Math.floor(i / cols) * (ch + gap)), w: Math.round(cw), h: Math.round(ch) }, { radius: 10, pos: "0% 0%" })).join("");
  },
};
