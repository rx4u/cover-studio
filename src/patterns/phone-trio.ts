import { phone } from "../look.ts";
import type { Ctx, Pattern } from "./types.ts";

type Screen = { file: string; band: string };

/** Three distinct screens: page tops first, then sections captured by scrolling to them. */
function pick({ m }: Ctx): Screen[] {
  const tops = m.mobile.filter((s) => s.y === 0);
  const sections = m.mobile.filter((s) => s.y > 0);
  const order = [tops[0], tops[1] ?? sections[0], sections[tops[1] ? 0 : 1] ?? sections[0], ...sections].filter(Boolean);
  const out: Screen[] = [...new Set(order)].map((s) => ({ file: s.file, band: s.topColor ?? "#ffffff" }));
  while (out.length < 3) out.push(out[out.length - 1]);
  return out.slice(0, 3);
}

/**
 * Three phones. Measured from references:
 * level (Afterglow): 0.25W each, gap 0.016W, top 0.14H, all equal.
 * raised (Nixtio): middle phone raised 0.07H and in front, sides lower, all leaning 6 degrees.
 */
export const phoneTrio: Pattern = {
  id: "phone-trio",
  unavailable: ({ m }) => (m.mobile?.length ? null : "no mobile capture; set source.mobile to true"),
  render(ctx, w, h) {
    const { c } = ctx;
    const [a, b, d] = pick(ctx);
    const ratio = c.phone.style === "frameless" ? 844 / 390 : 868 / 428;
    const raised = c.phone.trio === "raised";
    const lift = raised ? Math.round(h * 0.07) : 0;
    const top = Math.max(ctx.top, Math.round(h * (raised ? 0.08 : 0.1)));
    // Every phone fully on canvas with a bottom margin equal to the top margin (Afterglow).
    const pw = Math.round(Math.min(w * 0.25, (h - top * 2 - lift) / ratio));
    // Centre the group vertically: equal margin above the highest phone and below the lowest.
    const top2 = Math.max(ctx.top, Math.round((h - (pw * ratio + lift)) / 2));
    const gap = Math.round(w * 0.016);
    const x0 = Math.round((w - (pw * 3 + gap * 2)) / 2);
    // Nixtio: the raised trio leans together, about 6 degrees.
    const lean = raised ? "transform:rotate(-6deg);transform-origin:50% 50%;" : "";
    const opts = (s: Screen) => ({ band: s.band, style: c.phone.style, statusBar: c.phone.statusBar, extra: lean });
    return (
      phone(w, a.file, { x: x0, y: top2 + lift, w: pw }, opts(a)) +
      phone(w, d.file, { x: x0 + (pw + gap) * 2, y: top2 + lift, w: pw }, opts(d)) +
      phone(w, b.file, { x: x0 + pw + gap, y: top2, w: pw }, { ...opts(b), extra: lean + "z-index:2" })
    );
  },
};
