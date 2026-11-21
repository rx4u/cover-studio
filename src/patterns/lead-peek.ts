import { pngSize, url } from "../look.ts";
import type { Pattern } from "./types.ts";

/**
 * One long page read as two columns, no browser chrome. Measured from Apollo and Norde:
 * lead column x 0.035W, y 0.047H, 0.553W wide, running off the bottom, showing the top of the page;
 * peek column from 0.613W (gap 0.025W), same width, running off the top and the right, showing the page from where
 * the lead column leaves off, opened on a section start so no line is cut. Radius 10 on the visible corners, soft shadow.
 */
export const leadPeek: Pattern = {
  id: "lead-peek",
  render({ c, m, top }, w, h) {
    const k = w / 1600;
    const file = (m.full?.[0] ?? m.talls[0]).file;
    const [pw, ph] = pngSize(file);
    const cw = Math.round(w * 0.553);
    const x1 = Math.round(w * 0.035);
    const y1 = Math.max(Math.round(h * 0.047), top);
    const x2 = x1 + cw + Math.round(w * 0.025);
    const scaledH = (ph * cw) / pw;
    // The lead column shows the page from 0 to (h - y1). The peek continues from there, opening on the first section
    // that starts after it (its top 0.05H below the canvas edge, so no line is cut), clamped to the page length.
    const shown = h - y1;
    const css = cw / 1440;
    const starts = (m.sections?.[0] ?? []).map((t) => t * css).filter((t) => t >= shown * 0.95);
    const target = starts.length ? starts[0] - h * 0.05 : shown;
    const offset = Math.max(0, Math.min(target, scaledH - h));
    const r = Math.round(10 * k);
    const shadow = "0 40px 80px -30px rgba(0,0,0,.28), 0 12px 28px -14px rgba(0,0,0,.18)";
    const col = (x: number, y: number, hh: number, off: number, radius: string) =>
      `<div style="position:absolute;left:${x}px;top:${y}px;width:${cw}px;height:${hh}px;overflow:hidden;border-radius:${radius};box-shadow:${shadow};background:#fff"><img src="${url(file)}" style="display:block;width:${cw}px;transform:translateY(-${Math.round(off)}px)"></div>`;
    return col(x1, y1, h - y1 + r * 2, 0, `${r}px ${r}px 0 0`) + col(x2, -r * 2, h + r * 2, offset, `0 0 0 ${r}px`);
  },
};
