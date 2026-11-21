import { pngSize, tile } from "../look.ts";
import type { Pattern } from "./types.ts";

/** One component at poster scale, bleeding off one edge. */
export const macro: Pattern = {
  id: "macro",
  unavailable: ({ m }) => (m.elements?.length ? null : "no component captured; set source.elements"),
  render({ c, m, top }, w, h) {
    const el = m.elements[0];
    const [iw, ih] = pngSize(el);
    const short = Math.min(w, h);
    let eh = short * 0.85;
    let ew = (eh * iw) / ih;
    if (c.layout.bleed === "bottom" && ew > w * 0.85) {
      ew = w * 0.85;
      eh = (ew * ih) / iw;
    }
    const x = Math.round(w * 0.08);
    const y = c.layout.bleed === "bottom" ? Math.max(Math.round(h * 0.12), top) : Math.max(Math.round((h - eh) / 2), top);
    return tile(w, el, { x, y, w: Math.round(ew), h: Math.round(eh) }, { fit: "cover", radius: 16 });
  },
};
