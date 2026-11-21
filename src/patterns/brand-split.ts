import { accent, brandLogo, tile, url } from "../look.ts";
import { shotsFor } from "../devices.ts";
import type { Pattern } from "./types.ts";

/**
 * The product beside its brand. Measured from Moyra's BartKolenda case study and Orbyta:
 * margins 0.045W by 0.08H, gaps 0.01W, radius 14, no shadows.
 * Left, 0.46 of the width: the desktop page, its first screen fitted to width. Right top, half the height: the brand
 * panel, the site's own logo (source.logo) on its own header colour, or bento.logo on the accent colour, centred at
 * 0.4 of the panel width.
 * Right bottom, two tiles: a site photograph and the phone screen of a later section.
 */
export const brandSplit: Pattern = {
  id: "brand-split",
  unavailable: ({ c, m }) => (brandLogo(c) || m.logo ? null : "needs the site's logo: set source.logo (a selector) or bento.logo"),
  render({ c, m, top }, w, h) {
    const k = w / 1600;
    const mx = Math.round(w * 0.045);
    const y0 = Math.max(Math.round(h * 0.08), top);
    const ah = h - y0 - Math.round(h * 0.08);
    const gap = Math.round(w * 0.01);
    const aw = w - mx * 2;
    const lw = Math.round(aw * 0.46);
    const rx = mx + lw + gap;
    const rw = aw - lw - gap;
    const th = Math.round((ah - gap) / 2);
    const opts = { radius: 14, shadow: false } as const;
    const logo = brandLogo(c) ?? m.logo!;
    // The brand panel is the surface the logo was designed for (the site's header colour), so its contrast is the
    // site's own; a logo from config takes the accent colour.
    const panel = !brandLogo(c) && m.logoBg ? m.logoBg : accent(c);
    let out = tile(w, m.talls[0].file, { x: mx, y: y0, w: lw, h: ah }, { ...opts, pos: `50% ${c.focus.y * 100}%` });
    out += `<div style="position:absolute;left:${rx}px;top:${y0}px;width:${rw}px;height:${th}px;border-radius:${14 * k}px;background:${panel};display:flex;align-items:center;justify-content:center"><img src="${url(logo)}" style="width:${Math.round(rw * 0.4)}px;height:auto;max-height:${Math.round(th * 0.4)}px;object-fit:contain"></div>`;
    const bw = Math.round((rw - gap) / 2);
    const by = y0 + th + gap;
    const bh = ah - th - gap;
    const imgs = m.images ?? [];
    const photo = imgs[1] ?? imgs[0] ?? m.photo;
    const phones = m.mobile?.length ? shotsFor(c, m.mobile, c.phone.model) : [];
    const shot = phones.find((p) => p.y > 0) ?? phones[0];
    const second = shot ? (b: { x: number; y: number; w: number; h: number }) => tile(w, shot.file, b, { ...opts, pos: `50% -${Math.round(((shot.nav ?? 0) * b.w) / (shot.w ?? 402))}px` }) : imgs[2] ? (b: { x: number; y: number; w: number; h: number }) => tile(w, imgs[2], b, { ...opts, pos: "50% 50%" }) : null;
    if (photo && second) {
      out += tile(w, photo, { x: rx, y: by, w: bw, h: bh }, { ...opts, pos: "50% 50%" });
      out += second({ x: rx + bw + gap, y: by, w: rw - bw - gap, h: bh });
    } else if (photo || second) {
      const b = { x: rx, y: by, w: rw, h: bh };
      out += photo ? tile(w, photo, b, { ...opts, pos: "50% 50%" }) : second!(b);
    }
    return out;
  },
};
