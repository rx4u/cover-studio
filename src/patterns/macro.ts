import { pngSize, tile } from "../look.ts";
import { SCALE } from "../capture.ts";
import type { Pattern } from "./types.ts";

/**
 * One real component at poster scale, whole. The component is never cropped: a cut through its text reads as a
 * mistake. It is scaled to fill at most 0.84W by 0.76H, and at most 2.4x its size on the page so text stays crisp,
 * then centred on the ground with radius 16 and a soft shadow. layout.bleed does not apply: a bleed would cut text.
 */
export const macro: Pattern = {
  id: "macro",
  unavailable: ({ m }) => (m.elements?.length ? null : "no component captured; set source.elements"),
  render({ m, top }, w, h) {
    const el = m.elements[0];
    const [iw, ih] = pngSize(el);
    const cssW = iw / SCALE;
    const cssH = ih / SCALE;
    const k = w / 1600;
    const s = Math.min((w * 0.84) / cssW, (h * 0.76) / cssH, 2.4 * k);
    const ew = Math.round(cssW * s);
    const eh = Math.round(cssH * s);
    const x = Math.round((w - ew) / 2);
    const y = Math.max(Math.round((h - eh) / 2), top);
    return tile(w, el, { x, y, w: ew, h: eh }, { fit: "contain", bg: "#FFFFFF", radius: 16 });
  },
};
