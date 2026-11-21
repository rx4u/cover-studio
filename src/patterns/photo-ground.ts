import { frame } from "../look.ts";
import type { Pattern } from "./types.ts";

/**
 * The page on its own hero photograph, blurred and dimmed by the photo ground. No browser chrome.
 * Measured from Atelier Aesthetica: x 0.05W, 0.9W wide, centred vertically with top and bottom margins of 0.127H,
 * the tall capture cropped from the top. Radius 10, soft lifted shadow.
 */
export const photoGround: Pattern = {
  id: "photo-ground",
  unavailable: ({ m }) => (m.photo ? null : "no hero photo captured; set source.photo"),
  render({ c, m, top }, w, h) {
    const x = Math.round(w * 0.05);
    const y = Math.max(Math.round(h * 0.127), top);
    const focus = `${c.focus.x * 100}% ${c.focus.y * 100}%`;
    return frame({ ...c, frame: { ...c.frame, style: "none", radius: 10, shadow: "lifted" } }, w, m.talls[0].file, { x, y, w: w - x * 2, h: h - y - Math.round(h * 0.127) }, focus);
  },
};
