import { pngSize } from "../look.ts";
import { componentCard, componentSize } from "./shared.ts";
import type { Pattern } from "./types.ts";

/**
 * A bento made only of real components. Measured from Outcrowd (dark dashboard bento) and Ramotion (travel app bento)
 * on Raja's reference board: margins 0.05W by 0.06H, gaps 0.014W, radius 16, no shadows. Each tile takes the
 * component's own page surface and shows the component whole, centred, at up to 2x its page size.
 * 2 components: two equal columns. 3: one tall tile at 0.58 of the width, two stacked; if one is wide (over 1.8:1), it
 * takes a full-width top row and the other two share the row below. 4: 2x2. 5 or 6: a wide first
 * tile over two columns, then the rest.
 */
export const uiBento: Pattern = {
  id: "ui-bento",
  unavailable: ({ m }) => ((m.elements?.length ?? 0) >= 2 ? null : "needs at least 2 components in source.elements"),
  render({ m, top }, w, h) {
    const k = w / 1600;
    const els = [...m.elements.slice(0, 6)];
    const gap = Math.round(w * 0.014);
    const mx = Math.round(w * 0.05);
    const y0 = Math.max(Math.round(h * 0.06), top);
    const aw = w - mx * 2;
    const ah = h - y0 - Math.round(h * 0.06);
    const cells: [number, number, number, number][] = [];
    const n = els.length;
    if (n === 2) {
      const cw = (aw - gap) / 2;
      cells.push([mx, y0, cw, ah], [mx + cw + gap, y0, cw, ah]);
    } else if (n === 3) {
      const aspect = (f: string) => { const [iw, ih] = pngSize(f); return iw / ih; };
      const wideI = els.findIndex((f) => aspect(f) > 1.8);
      if (wideI >= 0) {
        // A wide component (a table, a strip) gets a full-width row sized to it; the other two share the row below.
        [els[0], els[wideI]] = [els[wideI], els[0]];
        const th = Math.min(ah * 0.45, Math.max(ah * 0.3, aw / aspect(els[0]) + ah * 0.1));
        const bw = (aw - gap) / 2;
        cells.push([mx, y0, aw, th], [mx, y0 + th + gap, bw, ah - th - gap], [mx + bw + gap, y0 + th + gap, bw, ah - th - gap]);
      } else {
        const lw = aw * 0.58, rw = aw - lw - gap, rh = (ah - gap) / 2;
        cells.push([mx, y0, lw, ah], [mx + lw + gap, y0, rw, rh], [mx + lw + gap, y0 + rh + gap, rw, rh]);
      }
    } else if (n === 4) {
      const cw = (aw - gap) / 2, ch = (ah - gap) / 2;
      for (let i = 0; i < 4; i++) cells.push([mx + (i % 2) * (cw + gap), y0 + Math.floor(i / 2) * (ch + gap), cw, ch]);
    } else {
      const cw = (aw - gap * 2) / 3, ch = (ah - gap) / 2;
      cells.push([mx, y0, cw * 2 + gap, ch], [mx + (cw + gap) * 2, y0, cw, ch]);
      for (let i = 0; i < n - 2; i++) cells.push([mx + i * (cw + gap), y0 + ch + gap, cw, ch]);
    }
    return els
      .map((f, i) => {
        const [x, y, cw, ch] = cells[i];
        const pad = Math.min(cw, ch) * 0.08;
        const s = componentSize(f, cw - pad * 2, ch - pad * 2, 2 * k);
        // The tile is the component's surface; the component sits whole and centred in it.
        return componentCard(w, f, { x, y, w: cw, h: ch }, {}).replace(/max-width:100%;max-height:100%;width:auto;height:auto/, `width:${Math.round(s.w)}px;height:${Math.round(s.h)}px`);
      })
      .join("");
  },
};
