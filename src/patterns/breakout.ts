import { frame } from "../look.ts";
import { componentCard, componentSize } from "./shared.ts";
import type { Pattern } from "./types.ts";

const LIFT = "0 50px 90px -30px rgba(10,20,30,.38), 0 16px 34px -16px rgba(10,20,30,.26)";

/**
 * The page with its own components pulled forward past its edges. Measured from HALO LAB (Lemon), Outcrowd (absence
 * planner, analytics) and Phenomenon on Raja's reference board:
 * the page at 0.2W, from 0.08H, 0.7W wide, running off the bottom; the first component lifted out over its right
 * edge (right side at 0.96W, up to 0.3W wide, centred near 0.56H, never above 0.4H); a second at the left, up to
 * 0.22W wide, right edge at 0.25W so it overlaps only the page's margin, bottom at 0.9H. Neither covers the headline. Components keep their own surface, are shown whole at up to 2x their page size, and
 * cast a deeper shadow than the page so they read as in front.
 */
export const breakout: Pattern = {
  id: "breakout",
  unavailable: ({ m }) => (m.elements?.length ? null : "no component captured; set source.elements"),
  render({ c, m, top }, w, h) {
    const k = w / 1600;
    const fx = Math.round(w * 0.2);
    const fw = Math.round(w * 0.7);
    const fy = Math.max(Math.round(h * 0.08), top);
    let out = frame(c, w, m.talls[0].file, { x: fx, y: fy, w: fw, h: h - fy + Math.round(30 * k) }, `50% ${c.focus.y * 100}%`);
    const e = m.elements;
    // Cards keep clear of the page's headline: the first over the page's right edge (the hero's image side), the
    // second at the left, overlapping only the page's left margin (right edge at 0.25W, the headline starts near 0.26W).
    const a = componentSize(e[0], w * 0.3, h * 0.46, 2 * k);
    out += componentCard(w, e[0], { x: w * 0.96 - a.w, y: Math.min(Math.max(h * 0.56 - a.h / 2, h * 0.4), h * 0.93 - a.h), ...a }, { shadow: LIFT, extra: "z-index:2" });
    if (e[1]) {
      const b = componentSize(e[1], w * 0.22, h * 0.5, 2 * k);
      out += componentCard(w, e[1], { x: w * 0.25 - b.w, y: Math.max(h * 0.9 - b.h, h * 0.42), ...b }, { shadow: LIFT, extra: "z-index:2" });
    }
    return out;
  },
};
