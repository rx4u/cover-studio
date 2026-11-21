import { frame } from "../look.ts";
import { screens } from "./shared.ts";
import type { Pattern } from "./types.ts";

/** A large centre screen with smaller screens around it, running off the edges. */
export const floating: Pattern = {
  id: "floating",
  unavailable: ({ m }) => (screens(m).length >= 3 ? null : "needs at least 3 views; add pages or scrollPositions"),
  render({ c, m, top }, w, h) {
    const v = screens(m);
    const side = [
      [-0.05, 0.05, 0.3],
      [0.75, 0.03, 0.3],
      [-0.03, 0.63, 0.3],
      [0.73, 0.6, 0.3],
    ];
    const around = v.slice(1, 5).map((img, i) => frame(c, w, img, { x: Math.round(w * side[i][0]), y: Math.max(Math.round(h * side[i][1]), i < 2 ? top : 0), w: Math.round(w * side[i][2]) }));
    const main = frame(c, w, v[0], { x: Math.round(w * 0.2), y: Math.max(Math.round(h * 0.18), top), w: Math.round(w * 0.6) });
    return around.join("") + main;
  },
};
