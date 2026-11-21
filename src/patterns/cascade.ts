import { frame, pngSize } from "../look.ts";
import type { Pattern } from "./types.ts";

/**
 * Three pages layered diagonally, back to front. Measured from Zajno's cascade on Raja's reference board:
 * each page about 0.5W wide, each step 0.13W right and 0.11H down, the group centred, plain frames, the front page
 * casting the deepest shadow. The three views are distinct sections of the page, each opened on a section start:
 * the top, then sections about a third and two thirds down. Extra pages in source.pages are used first when given.
 */
export const cascade: Pattern = {
  id: "cascade",
  unavailable: ({ m }) => (m.full?.length ? null : "no full-page capture"),
  render({ c, m, top }, w, h) {
    const k = w / 1600;
    const file = m.full[0].file;
    const [iw, ih] = pngSize(file);
    const dx = w * 0.13;
    const dy = h * 0.11;
    const bar = c.frame.style === "browser" ? 40 * k : 0;
    // Page width from the space: three steps must fit inside 0.88W by 0.86H.
    let fw = w * 0.5;
    const fh = (x: number) => (x / 1440) * 900 * 0.92 + bar;
    while (fw + dx * 2 > w * 0.88 || fh(fw) + dy * 2 > h * 0.86) fw *= 0.97;
    const x0 = (w - (fw + dx * 2)) / 2;
    const y0 = Math.max((h - (fh(fw) + dy * 2)) / 2, top);
    // Section starts in CSS px; pick the top, then the starts nearest a third and two thirds down.
    const pageH = (ih / iw) * 1440;
    const starts = m.sections?.[0] ?? [];
    const pick = (f: number) => (starts.length ? starts.reduce((a, b) => (Math.abs(b - pageH * f) < Math.abs(a - pageH * f) ? b : a)) : pageH * f);
    const offs = [0, pick(0.33), pick(0.66)];
    return offs
      .map((o, i) => {
        const fwr = Math.round(fw);
        const scale = fwr / 1440;
        const imgH = Math.round(fh(fw) - bar);
        const shadow = i === 2 ? "" : "";
        return frame({ ...c, frame: { ...c.frame, shadow: i === 2 ? "lifted" : "soft" } }, w, file, { x: Math.round(x0 + dx * i), y: Math.round(y0 + dy * i), w: fwr, h: Math.round(fh(fw)) }, `50% -${Math.round(o * scale)}px`, `z-index:${i + 1}${shadow}`);
      })
      .join("");
  },
};
