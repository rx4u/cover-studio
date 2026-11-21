import { pngSize, url } from "../look.ts";
import { SCALE } from "../capture.ts";
import type { Pattern } from "./types.ts";

/**
 * One real component at poster scale, whole, as if zoomed into the page. The component is never cropped: a cut
 * through its text reads as a mistake. Of the captured components, the one that covers most of the canvas at its
 * fitted size is used. It is scaled to fill at most 0.84W by 0.76H, and at most 2.4x its size on the page so text
 * stays crisp, then centred. The canvas around it is the component's own page surface, edge to edge (its corner
 * pixel), not the ground, so there is no floating box and no empty ground.
 */
export const macro: Pattern = {
  id: "macro",
  unavailable: ({ m }) => (m.elements?.length ? null : "no component captured; set source.elements"),
  render({ m }, w, h) {
    const k = w / 1600;
    const fit = (el: string) => {
      const [iw, ih] = pngSize(el);
      const cssW = iw / SCALE, cssH = ih / SCALE;
      const s = Math.min((w * 0.84) / cssW, (h * 0.76) / cssH, 2.4 * k);
      return { el, ew: Math.round(cssW * s), eh: Math.round(cssH * s) };
    };
    const best = m.elements.map(fit).reduce((a, b) => (b.ew * b.eh > a.ew * a.eh ? b : a));
    const { el, ew, eh } = best;
    const surface = `url('${url(el)}') 0 0 / 40000% 40000% no-repeat`;
    return `<div style="position:absolute;inset:0;background:${surface}"></div><img src="${url(el)}" style="position:absolute;left:${Math.round((w - ew) / 2)}px;top:${Math.round((h - eh) / 2)}px;width:${ew}px;height:${eh}px;display:block">`;
  },
};
