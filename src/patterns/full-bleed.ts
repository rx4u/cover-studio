import { frame } from "../look.ts";
import type { Pattern } from "./types.ts";

/**
 * The hero fills the canvas with a thin inset. Uses the tall capture fitted to width,
 * so the nav is never cut at the sides; the bottom is trimmed. Vertical anchor from config.focus.y.
 */
export const fullBleed: Pattern = {
  id: "full-bleed",
  render({ c, m, top }, w, h) {
    const inset = Math.round(w * 0.025);
    const y = Math.max(inset, top);
    const hero = m.talls[0].file;
    const focus = `${c.focus.x * 100}% ${c.focus.y * 100}%`;
    return frame({ ...c, frame: { ...c.frame, style: "none" } }, w, hero, { x: inset, y, w: w - inset * 2, h: h - y - inset }, focus);
  },
};
