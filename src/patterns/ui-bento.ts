import { pngSize } from "../look.ts";
import { componentCard } from "./shared.ts";
import type { Pattern } from "./types.ts";

/**
 * A bento made only of real components, every tile exactly its component. Measured from Outcrowd and Ramotion on
 * Raja's reference board: gaps 0.014W, radius 16, no shadows, margins at least 0.05W by 0.06H.
 * Each tile is the component capture whole (with the 32 px of its own page surface taken at capture), so a tile never
 * holds empty space. Tiles are laid out in justified rows: every split of the components into rows, in order, is
 * tried, each row scaled so its tiles fill the width, and the split whose total height best fills the canvas wins.
 * The block is then scaled down to fit, never past 2x the page size, and centred.
 */
export const uiBento: Pattern = {
  id: "ui-bento",
  unavailable: ({ m }) => ((m.elements?.length ?? 0) >= 2 ? null : "needs at least 2 components in source.elements"),
  render({ m, top }, w, h) {
    const k = w / 1600;
    const els = m.elements.slice(0, 6);
    const gap = Math.round(w * 0.014);
    const aw = w - Math.round(w * 0.05) * 2;
    const y0 = Math.max(Math.round(h * 0.06), top);
    const ah = h - y0 - Math.round(h * 0.06);
    const size = els.map((f) => { const [iw, ih] = pngSize(f); return { w: iw / 2, h: ih / 2 }; });
    // All splits into consecutive rows (at most 3 rows).
    const splits: number[][][] = [];
    const rec = (start: number, rows: number[][]) => {
      if (start === els.length) return void splits.push(rows);
      if (rows.length === 3) return;
      for (let end = start + 1; end <= els.length; end++) rec(end, [...rows, Array.from({ length: end - start }, (_, i) => start + i)]);
    };
    rec(0, []);
    const lay = (rows: number[][], width: number) => {
      // A row's height makes its tiles, at equal height, fill the width.
      const hs = rows.map((r) => (width - gap * (r.length - 1)) / r.reduce((a, i) => a + size[i].w / size[i].h, 0));
      return { hs, total: hs.reduce((a, b) => a + b, 0) + gap * (rows.length - 1) };
    };
    let best = splits[0], bestScale = 0;
    for (const rows of splits) {
      const { hs, total } = lay(rows, aw);
      // Scale to fit the height; reject splits whose tiles would be blown past 2x or squeezed under 0.6x.
      const fit = Math.min(1, ah / total);
      const s = Math.min(...rows.flatMap((r, ri) => r.map((i) => (hs[ri] * fit) / size[i].h)));
      const filled = Math.min(total, ah) * fit / ah;
      const score = filled * (s > 2 * k ? (2 * k) / s : 1) * (s < 0.6 * k ? s / (0.6 * k) : 1);
      if (score > bestScale) { bestScale = score; best = rows; }
    }
    // Final sizes: fit width, then shrink to the height and to the 2x cap.
    let { hs, total } = lay(best, aw);
    let blockW = aw;
    const capS = Math.max(...best.flatMap((r, ri) => r.map((i) => hs[ri] / size[i].h))) / (2 * k);
    const shrink = Math.max(total / ah, capS, 1);
    if (shrink > 1) {
      blockW = (aw - gap * 0) / shrink;
      ({ hs, total } = lay(best, blockW + 0));
    }
    let y = y0 + (ah - total) / 2;
    let out = "";
    for (const [ri, r] of best.entries()) {
      const rh = hs[ri];
      const rowW = r.reduce((a, i) => a + (size[i].w / size[i].h) * rh, 0) + gap * (r.length - 1);
      let x = (w - rowW) / 2;
      for (const i of r) {
        const tw = (size[i].w / size[i].h) * rh;
        out += componentCard(w, els[i], { x, y, w: tw, h: rh }).replace(/max-width:100%;max-height:100%;width:auto;height:auto/, "width:100%;height:100%");
        x += tw + gap;
      }
      y += rh + gap;
    }
    return out;
  },
};
