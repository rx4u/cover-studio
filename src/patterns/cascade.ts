import { frame, pngSize } from "../look.ts";
import type { Pattern } from "./types.ts";

/**
 * Three pages layered diagonally, back to front. Measured from Zajno's cascade on Raja's reference board:
 * plain frames layered back to front, the front page casting the deepest shadow, scaled up so the group fills the
 * canvas and bleeds off the right and bottom. The three views are distinct sections of the page, each opened on a section start:
 * the top, then sections about a third and two thirds down. Extra pages in source.pages are used first when given.
 */
export const cascade: Pattern = {
  id: "cascade",
  unavailable: ({ m }) => (m.full?.length ? null : "no full-page capture"),
  render({ c, m, top }, w, h) {
    const k = w / 1600;
    const file = m.full[0].file;
    const [iw, ih] = pngSize(file);
    // The group fills the canvas: pages 0.76W wide from 0.05W, each step 0.12W right and 0.11H down, so the front
    // page runs off the right and every page runs off the bottom. No ground shows below or beside the group.
    const dx = w * 0.12;
    const dy = h * 0.11;
    const bar = c.frame.style === "browser" ? 40 * k : 0;
    const fw = w * 0.76;
    const x0 = w * 0.05;
    const y0 = Math.max(h * 0.07, top);
    const fh = (i: number) => h - (y0 + dy * i) + 40 * k;
    // Section starts in CSS px; pick the top, then the starts nearest a third and two thirds down.
    const pageH = (ih / iw) * 1440;
    const starts = m.sections?.[0] ?? [];
    const pick = (f: number) => (starts.length ? starts.reduce((a, b) => (Math.abs(b - pageH * f) < Math.abs(a - pageH * f) ? b : a)) : pageH * f);
    const offs = [0, pick(0.33), pick(0.66)];
    return offs
      .map((o, i) => {
        const fwr = Math.round(fw);
        const scale = fwr / 1440;
        return frame({ ...c, frame: { ...c.frame, shadow: i === 2 ? "lifted" : "soft" } }, w, file, { x: Math.round(x0 + dx * i), y: Math.round(y0 + dy * i), w: fwr, h: Math.round(fh(i)) }, `50% -${Math.round(o * scale)}px`, `z-index:${i + 1}`);
      })
      .join("");
  },
};
