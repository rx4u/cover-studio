import type { Pattern } from "./types.ts";
import { phoneAt, phoneHeight, phoneScreens, phoneWidthFor } from "./shared.ts";

/**
 * Three phones. Measured from references:
 * level (Afterglow): about 0.25W each, gap 0.016W, group centred, equal screen heights.
 * raised (Nixtio): middle phone raised 0.07H and in front, all leaning 6 degrees.
 * With phone.mix the middle phone is the main model and the sides are phone.mixWith; screens match in height.
 */
export const phoneTrio: Pattern = {
  id: "phone-trio",
  unavailable: ({ m }) => (m.mobile?.length ? null : "no mobile capture; set source.mobile to true"),
  render(ctx, w, h) {
    const { c } = ctx;
    const models = c.phone.mix ? [c.phone.mixWith[0], c.phone.model, c.phone.mixWith[1]] : [c.phone.model, c.phone.model, c.phone.model];
    // Each phone takes the next distinct screen captured for its own viewport.
    const used = new Set<string>();
    const shots = models.map((mod) => {
      const pool = phoneScreens(ctx, mod);
      const s = pool.find((p) => !used.has(p.page + p.y)) ?? pool[0];
      used.add(s.page + s.y);
      return s;
    });
    const raised = c.phone.trio === "raised";
    const lift = raised ? Math.round(h * 0.07) : 0;
    const margin = Math.max(ctx.top, Math.round(h * (raised ? 0.08 : 0.1)));
    const gap = Math.round(w * 0.016);
    // Largest common screen height that fits both the width (0.78W for the group) and the height.
    const unit = models.map((mod) => phoneWidthFor(ctx, mod, 1000) / 1000);
    const byWidth = (w * 0.782 - gap * 2) / unit.reduce((a, b) => a + b, 0);
    const byHeight = Math.min(...models.map((mod, i) => (h - margin * 2 - lift) / (phoneHeight(ctx, mod, unit[i] * 1000) / 1000)));
    const S = Math.min(byWidth, byHeight);
    const ws = unit.map((u) => Math.round(u * S));
    const hs = models.map((mod, i) => phoneHeight(ctx, mod, ws[i]));
    const tallest = Math.max(...hs);
    const top = Math.max(ctx.top, Math.round((h - tallest - lift) / 2));
    const x0 = Math.round((w - ws.reduce((a, b) => a + b, 0) - gap * 2) / 2);
    const xs = [x0, x0 + ws[0] + gap, x0 + ws[0] + ws[1] + gap * 2];
    // Phones align on their screen centres so mixed models sit level.
    const ys = hs.map((hh, i) => top + (tallest - hh) / 2 + (i === 1 ? 0 : lift));
    const lean = raised ? "transform:rotate(-6deg);transform-origin:50% 50%;" : "";
    return (
      phoneAt(ctx, w, models[0], shots[0], xs[0], ys[0], ws[0], lean) +
      phoneAt(ctx, w, models[2], shots[2], xs[2], ys[2], ws[2], lean) +
      phoneAt(ctx, w, models[1], shots[1], xs[1], ys[1], ws[1], lean + "z-index:2")
    );
  },
};
