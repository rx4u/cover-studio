import { frame, pngSize, tile } from "../look.ts";
import type { Pattern } from "./types.ts";

/** The main page with one or two real components pushed past its edge. */
export const breakout: Pattern = {
  id: "breakout",
  unavailable: ({ m }) => (m.elements?.length ? null : "no component captured; set source.elements"),
  render({ c, m, top }, w, h) {
    const fx = Math.round(w * 0.06);
    const fw = Math.round(w * 0.7);
    const fy = Math.max(Math.round(h * 0.08), top);
    let out = frame(c, w, m.talls[0].file, { x: fx, y: fy, w: fw });
    const card = (file: string, x: number, y: number, cw: number) => {
      const [iw, ih] = pngSize(file);
      return tile(w, file, { x, y, w: cw, h: Math.round((cw * ih) / iw) }, { fit: "cover", radius: 12 });
    };
    const e = m.elements;
    out += card(e[0], fx + fw - Math.round(w * 0.12), Math.round(h * 0.3), Math.round(w * 0.3));
    if (e[1]) out += card(e[1], Math.round(w * 0.02), Math.round(h * 0.62), Math.round(w * 0.26));
    return out;
  },
};
