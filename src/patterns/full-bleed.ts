import { frame } from "../look.ts";
import type { Pattern } from "./types.ts";

/**
 * The page large on the canvas, no browser chrome. Measured from Roobinium (Sentry), Nixtio (TRQ) and Skatenerd:
 * whole: x 0.055W, y 0.07H, 0.89W wide, ending at 0.92H, the tall capture cropped from the top (focus.y moves it);
 * layout.bleed "bottom": x 0.035W, y 0.047H, 0.93W wide, running off the bottom edge.
 * Radius 10, soft lifted shadow. The ground shows round all four sides (or three when bleeding).
 */
export const fullBleed: Pattern = {
  id: "full-bleed",
  render({ c, m, top }, w, h) {
    const k = w / 1600;
    const bleed = c.layout.bleed === "bottom";
    const x = Math.round(w * (bleed ? 0.035 : 0.055));
    const y = Math.max(Math.round(h * (bleed ? 0.047 : 0.07)), top);
    const fw = w - x * 2;
    const fh = bleed ? h - y + Math.round(40 * k) : Math.round(h * 0.92) - y;
    const focus = `${c.focus.x * 100}% ${c.focus.y * 100}%`;
    return frame({ ...c, frame: { ...c.frame, style: "none", radius: 10, shadow: "lifted" } }, w, m.talls[0].file, { x, y, w: fw, h: fh }, focus);
  },
};
