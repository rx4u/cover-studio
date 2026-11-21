import { tile } from "../look.ts";
import { k } from "./shared.ts";
import type { Pattern } from "./types.ts";

/** A bento made only of product components. */
export const uiBento: Pattern = {
  id: "ui-bento",
  unavailable: ({ m }) => ((m.elements?.length ?? 0) >= 2 ? null : "needs at least 2 components in source.elements"),
  render({ c, m, top }, w, h) {
    const els = m.elements.slice(0, 6);
    const gap = Math.round(14 * k(w));
    const mx = Math.round(w * 0.06);
    const y0 = Math.max(Math.round(h * 0.08), top);
    const aw = w - mx * 2;
    const ah = h - y0 - Math.round(h * 0.08);
    const bg = c.frame.theme === "dark" ? "#1B1C1C" : "#FFFFFF";
    const t = (f: string, x: number, y: number, cw: number, ch: number) => tile(w, f, { x, y, w: cw, h: ch }, { fit: "contain", bg, pad: 24, radius: 14 });
    const n = els.length;
    if (n === 2) {
      const cw = (aw - gap) / 2;
      return els.map((f, i) => t(f, mx + i * (cw + gap), y0, cw, ah)).join("");
    }
    if (n === 3) {
      const lw = aw * 0.58;
      const rw = aw - lw - gap;
      const rh = (ah - gap) / 2;
      return t(els[0], mx, y0, lw, ah) + t(els[1], mx + lw + gap, y0, rw, rh) + t(els[2], mx + lw + gap, y0 + rh + gap, rw, rh);
    }
    const cols = n === 4 ? 2 : 3;
    const cw = (aw - gap * (cols - 1)) / cols;
    const ch = (ah - gap) / 2;
    return els.map((f, i) => t(f, mx + (i % cols) * (cw + gap), y0 + Math.floor(i / cols) * (ch + gap), cw, ch)).join("");
  },
};
