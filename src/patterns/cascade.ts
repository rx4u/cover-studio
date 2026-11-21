import { frame } from "../look.ts";
import { screens } from "./shared.ts";
import type { Pattern } from "./types.ts";

/** Three or four pages layered diagonally, back to front. */
export const cascade: Pattern = {
  id: "cascade",
  unavailable: ({ m }) => (screens(m).length >= 3 ? null : "needs at least 3 views; add pages or scrollPositions"),
  render({ c, m, top }, w, h) {
    const views = screens(m).slice(0, 4);
    const fw = Math.round(w * 0.58);
    const y0 = Math.max(Math.round(h * 0.07), top);
    return views
      .map((v, j) => frame(c, w, v, { x: Math.round(w * (0.06 + j * 0.1)), y: y0 + Math.round(h * j * 0.1), w: fw }))
      .join("");
  },
};
