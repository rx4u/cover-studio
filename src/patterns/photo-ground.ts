import { frame } from "../look.ts";
import type { Pattern } from "./types.ts";

/** The page sits on its own hero photograph. The renderer switches the ground to the photo. */
export const photoGround: Pattern = {
  id: "photo-ground",
  unavailable: ({ m }) => (m.photo ? null : "no hero photo captured; set source.photo"),
  render({ c, m, top }, w, h) {
    const fw = Math.round(w * 0.68);
    const y = Math.max(Math.round(h * 0.16), top);
    return frame(c, w, m.talls[0].file, { x: Math.round((w - fw) / 2), y, w: fw });
  },
};
