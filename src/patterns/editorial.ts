import { accent, tile } from "../look.ts";
import { screens, k } from "./shared.ts";
import type { Pattern } from "./types.ts";

/** Magazine layout: a large hero crop with a column of sections, and the real stat set large when given. */
export const editorial: Pattern = {
  id: "editorial",
  unavailable: ({ m }) => (screens(m).length >= 3 || m.photo ? null : "needs at least 3 views"),
  render({ c, m, top }, w, h) {
    const v = screens(m);
    const g = Math.round(14 * k(w));
    const mx = Math.round(w * 0.04);
    const y0 = Math.max(Math.round(h * 0.06), top);
    const ah = h - y0 - Math.round(h * 0.06);
    const lw = Math.round(w * 0.56);
    const rw = w - mx * 2 - lw - g;
    const rh = Math.round((ah - g) / 2);
    let out = tile(w, m.talls[0].file, { x: mx, y: y0, w: lw, h: ah }, { radius: 8, shadow: false });
    out += tile(w, v[1] ?? m.photo!, { x: mx + lw + g, y: y0, w: rw, h: rh }, { radius: 8, shadow: false });
    const bx = mx + lw + g, by = y0 + rh + g;
    if (c.bento.stat) {
      const s = c.bento.stat;
      out += `<div style="position:absolute;left:${bx}px;top:${by}px;width:${rw}px;height:${rh}px;border-radius:${8 * k(w)}px;background:${accent(c)};color:#fff;font-family:system-ui,sans-serif;padding:${Math.round(rw * 0.07)}px;display:flex;flex-direction:column;justify-content:flex-end"><div style="font-size:${Math.round(rh * 0.42)}px;font-weight:500;letter-spacing:-.04em;line-height:.9">${s.value}</div><div style="margin-top:${Math.round(rh * 0.04)}px;font-size:${Math.round(rh * 0.07)}px;opacity:.85">${s.label}</div></div>`;
    } else out += tile(w, v[2] ?? v[0], { x: bx, y: by, w: rw, h: rh }, { radius: 8, shadow: false });
    return out;
  },
};
