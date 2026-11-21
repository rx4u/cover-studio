import { pngSize, url } from "../look.ts";
import type { Ctx, Pattern } from "./types.ts";

/** The whole page as tall columns, staggered so together they show the page once. */
export function stripsHTML({ c, m, top }: Ctx, w: number, h: number): string {
  const full = m.full[0].file;
  const [iw, ih] = pngSize(full);
  const n = c.layout.columns;
  const margin = Math.round(w * 0.045);
  const gap = Math.round(w * 0.025);
  const colW = Math.floor((w - margin * 2 - gap * (n - 1)) / n);
  const scaledH = (colW / iw) * ih;
  const segment = scaledH / n;
  const r = Math.round(12 * (w / 1600));
  const tops = [0.1, -0.05, 0.04, -0.08].map((t) => Math.round(t * h));
  let out = "";
  for (let i = 0; i < n; i++) {
    const y = Math.max(tops[i % tops.length], i === 0 ? top : -Infinity);
    out += `<div style="position:absolute;left:${margin + i * (colW + gap)}px;top:${y}px;width:${colW}px;height:${h - y + r * 2}px;border-radius:${r}px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(0,0,0,.3)"><img src="${url(full)}" style="display:block;width:100%;transform:translateY(-${Math.round(i * segment)}px)"></div>`;
  }
  return out;
}

export const strips: Pattern = {
  id: "strips",
  unavailable: ({ m }) => (m.full?.length ? null : "no full-page capture"),
  render: stripsHTML,
};
