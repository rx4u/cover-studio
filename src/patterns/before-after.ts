import { frame } from "../look.ts";
import type { Pattern } from "./types.ts";

/**
 * The current site and the new design side by side, the same part of each. Both are stitched tall captures shown at
 * the same scale from the top, in matching frames: 0.445W each, a 0.03W gap, centred, from 0.08H and running off the
 * bottom, so the comparison fills the canvas at any size. The current site sits left, the new design right.
 */
export const beforeAfter: Pattern = {
  id: "before-after",
  unavailable: ({ m }) => (m.before ? null : "needs source.before (the current site URL)"),
  render({ c, m, top }, w, h) {
    const fw = Math.round(w * 0.445);
    const gap = Math.round(w * 0.03);
    const x0 = Math.round((w - fw * 2 - gap) / 2);
    const y = Math.max(Math.round(h * 0.08), top);
    const fh = h - y + Math.round(30 * (w / 1600));
    return frame(c, w, m.before!, { x: x0, y, w: fw, h: fh }, "50% 0%") + frame(c, w, m.talls[0].file, { x: x0 + fw + gap, y, w: fw, h: fh }, "50% 0%");
  },
};
