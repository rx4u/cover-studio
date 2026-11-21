import type { Manifest } from "../capture.ts";

/** Distinct desktop views: viewport shots first, then the tall captures of pages not yet shown at y 0. */
export function screens(m: Manifest): string[] {
  const out = m.shots.map((s) => s.file);
  for (const t of m.talls) if (!m.shots.some((s) => s.page === t.page && s.y === 0)) out.push(t.file);
  return out;
}

export const k = (w: number) => w / 1600;
