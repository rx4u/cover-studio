import { frame } from "../look.ts";
import type { Pattern } from "./types.ts";

/** A large lead page, with the next page cropped at the right edge. Both run off the bottom. */
export const leadPeek: Pattern = {
  id: "lead-peek",
  render({ c, m, top }, w, h) {
    const lead = m.talls[0].file;
    const peek = (m.talls[1] ?? m.talls[0]).file;
    const fw = Math.round(w * 0.7);
    const x1 = Math.round(w * 0.05);
    const y1 = Math.max(Math.round(h * 0.07), top);
    const x2 = x1 + fw + Math.round(w * 0.02);
    const y2 = y1 + Math.round(h * 0.06);
    return frame(c, w, lead, { x: x1, y: y1, w: fw }) + frame(c, w, peek, { x: x2, y: y2, w: fw });
  },
};
