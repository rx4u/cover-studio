import { frame } from "../look.ts";
import type { Pattern } from "./types.ts";

/** The current site on the left, the new design on the right, same viewport. Needs source.before. */
export const beforeAfter: Pattern = {
  id: "before-after",
  unavailable: ({ m }) => (m.before ? null : "needs source.before (the current site URL)"),
  render({ c, m, top }, w, h) {
    const fw = Math.round(w * 0.44);
    const bar = c.frame.style === "browser" ? Math.round(40 * (w / 1600)) : 0;
    const fh = Math.round(fw * (900 / 1440)) + bar;
    const y = Math.max(Math.round((h - fh) / 2), top);
    return frame(c, w, m.before!, { x: Math.round(w * 0.04), y, w: fw }) + frame(c, w, m.shots[0].file, { x: Math.round(w * 0.52), y, w: fw });
  },
};
