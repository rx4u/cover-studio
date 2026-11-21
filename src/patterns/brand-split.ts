import { accent, brandLogo, frame, url } from "../look.ts";
import type { Pattern } from "./types.ts";

/** Brand on the left third, the product page on the right. Needs a logo (bento.logo or branding.left). */
export const brandSplit: Pattern = {
  id: "brand-split",
  unavailable: ({ c }) => (brandLogo(c) ? null : "needs a logo: set bento.logo or branding.left"),
  render({ c, m, top }, w, h) {
    const pw = Math.round(w * 0.38);
    const logo = brandLogo(c)!;
    const panel = `<div style="position:absolute;left:0;top:0;width:${pw}px;height:${h}px;background:${accent(c)};display:flex;align-items:center;justify-content:center"><img src="${url(logo)}" style="max-width:${Math.round(pw * 0.55)}px;max-height:${Math.round(h * 0.3)}px"></div>`;
    return panel + frame(c, w, m.talls[0].file, { x: pw + Math.round(w * 0.06), y: Math.max(Math.round(h * 0.1), top), w: Math.round(w * 0.62) });
  },
};
