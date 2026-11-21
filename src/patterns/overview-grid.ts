import { mosaic } from "./shared.ts";
import type { Pattern } from "./types.ts";

/**
 * The whole site at a glance, flat. Measured from the EKON Studio cover on Raja's reference board: three staggered rows,
 * the hero first screen in the middle at 0.52W, gaps 0.016W, radius 10, every row bleeding off the edges; the other
 * tiles are distinct sections of the page, then the site's own photographs. For case study openers.
 */
export const overviewGrid: Pattern = {
  id: "overview-grid",
  unavailable: ({ m }) => (m.full?.length ? null : "no full-page capture"),
  render: (ctx, w, h) => mosaic(ctx, w, h, 0),
};
