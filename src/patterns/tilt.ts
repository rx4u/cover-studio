import { mosaic } from "./shared.ts";
import type { Pattern } from "./types.ts";

/**
 * The page mosaic turned in plane. Measured from the KORDA Studio cover on Raja's reference board (and Gleb Kuznetsov's
 * laid-down screens): the overview-grid mosaic rotated layout.tilt degrees (default 7, counter-clockwise) with a slight
 * backward lean (8 degrees) and scaled 1.18 so no corner shows the ground.
 */
export const tilt: Pattern = {
  id: "tilt",
  unavailable: ({ m }) => (m.full?.length ? null : "no full-page capture"),
  render: (ctx, w, h) => mosaic(ctx, w, h, -Math.abs(ctx.c.layout.tilt)),
};
