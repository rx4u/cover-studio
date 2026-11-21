import { pngSize, url } from "../look.ts";
import type { Ctx, Pattern } from "./types.ts";

/**
 * The whole page as tall columns. Measured from the Oliver Hayes three-strip cover (Raja's reference) and
 * Cuberto's strips on a brand ground:
 * margins 0.044W, gaps 0.025W, columns 0.2875W wide (three) on 4:3, radius 16, no browser chrome, soft shadow.
 * The first column starts at 0.10H with the top of the page and runs off the bottom. The last column runs off the
 * top and ends at 0.80H on the page's own end (footer, rounded corners showing). The middle column runs off the top
 * and ends at 0.9875H on the part of the page just before the last column begins. Together they read top, middle,
 * end. Short pages fall back to two columns (or one), so no column repeats another.
 */
export function stripsHTML({ c, m, top }: Ctx, w: number, h: number): string {
  const full = m.full[0].file;
  const [iw, ih] = pngSize(full);
  const k = w / 1600;
  const margin = Math.round(w * 0.044);
  const gap = Math.round(w * 0.025);
  const r = Math.round(16 * k);
  const shadow = "0 40px 80px -30px rgba(0,0,0,.28), 0 12px 28px -14px rgba(0,0,0,.18)";
  const layout = (n: number) => {
    const colW = Math.floor((w - margin * 2 - gap * (n - 1)) / n);
    return { colW, L: (colW / iw) * ih };
  };
  // Three columns need a page of at least about 2.6 screens of column height to avoid repeating content.
  let n = Math.min(c.layout.columns, 3);
  while (n > 1 && layout(n).L < h * (n === 3 ? 2.6 : 1.7)) n--;
  const { colW, L } = layout(n);
  const y1 = Math.max(Math.round(h * 0.1), top);
  const col = (i: number, y: number, height: number, offset: number, radius: string) =>
    `<div style="position:absolute;left:${margin + i * (colW + gap)}px;top:${Math.round(y)}px;width:${colW}px;height:${Math.round(height)}px;border-radius:${radius};overflow:hidden;box-shadow:${shadow};background:#fff"><img src="${url(full)}" style="display:block;width:${colW}px;transform:translateY(-${Math.max(0, Math.round(offset))}px)"></div>`;
  // First column: the top of the page from y1, off the bottom.
  let out = col(0, y1, h - y1 + r * 2, 0, `${r}px ${r}px 0 0`);
  if (n === 1) return out;
  // Last column: ends at 0.80H on the page end (two columns: at 0.9H).
  const endY = h * (n === 3 ? 0.8 : 0.9);
  const lastStart = Math.max(0, L - endY);
  out += col(n - 1, endY - Math.min(L, endY) - r * 2, Math.min(L, endY) + r * 2, lastStart - r * 2, `0 0 ${r}px ${r}px`);
  if (n === 2) return out;
  // Middle column: ends at 0.9875H on what comes just before the last column.
  const midEnd = h * 0.9875;
  // Opened on a section start near that point, so the column never begins mid-image or mid-line.
  const css = colW / 1440;
  const want = Math.max(h - y1, lastStart - midEnd);
  const starts = (m.sections?.[0] ?? []).map((t) => t * css).filter((t) => t >= h - y1 && t <= lastStart - midEnd * 0.5);
  const near = starts.sort((a, b) => Math.abs(a - want) - Math.abs(b - want))[0];
  const midStart = near !== undefined ? near - h * 0.04 : want;
  out += col(1, -r * 2, midEnd + r * 2, midStart - r * 2, `0 0 ${r}px ${r}px`);
  return out;
}

export const strips: Pattern = {
  id: "strips",
  unavailable: ({ m }) => (m.full?.length ? null : "no full-page capture"),
  render: stripsHTML,
};
