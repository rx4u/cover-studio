import type { Config } from "../config.ts";
import type { Manifest } from "../capture.ts";

export type Ctx = {
  c: Config;
  m: Manifest;
  /** Space reserved at the top for branding, in px. 0 when branding is hidden. */
  top: number;
};

export type Pattern = {
  id: string;
  /** Returns the inner HTML for the canvas (frames only; ground, pattern and branding are added by the renderer). */
  render(ctx: Ctx, w: number, h: number): string;
  /** Optional reason this pattern cannot render with the current captures. */
  unavailable?(ctx: Ctx): string | null;
};
