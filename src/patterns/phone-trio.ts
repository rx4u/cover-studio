import { phone } from "../look.ts";
import type { Ctx, Pattern } from "./types.ts";

type Screen = { file: string; offset: number; band: string };

/** Three distinct screens: page tops first, then sections captured by scrolling to them. */
function pick({ m }: Ctx): Screen[] {
  const tops = m.mobile.filter((s) => s.y === 0);
  const sections = m.mobile.filter((s) => s.y > 0);
  const order = [tops[0], tops[1] ?? sections[0], sections[tops[1] ? 0 : 1] ?? sections[0], ...sections].filter(Boolean);
  const out: Screen[] = [...new Set(order)].map((s) => ({ file: s.file, offset: 0, band: s.topColor ?? "#ffffff" }));
  while (out.length < 3) out.push(out[out.length - 1]);
  return out.slice(0, 3);
}

/** Three phones, the middle one larger and in front, slightly overlapping. Running off the bottom is fine. */
export const phoneTrio: Pattern = {
  id: "phone-trio",
  unavailable: ({ m }) => (m.mobile?.length ? null : "no mobile capture; set source.mobile to true"),
  render(ctx, w, h) {
    const [a, b, c] = pick(ctx);
    const pw = Math.round(Math.min(w * 0.25, h * 0.42));
    const mid = Math.round(pw * 1.08);
    const overlap = Math.round(pw * 0.06);
    const total = pw * 2 + mid - overlap * 2;
    const x0 = Math.round((w - total) / 2);
    const sideY = Math.max(ctx.top, Math.round(h * 0.14));
    const midY = Math.max(ctx.top, Math.round(h * 0.07));
    return (
      phone(w, a.file, { x: x0, y: sideY, w: pw }, a.offset, a.band) +
      phone(w, c.file, { x: x0 + pw + mid - overlap * 2, y: sideY, w: pw }, c.offset, c.band) +
      phone(w, b.file, { x: x0 + pw - overlap, y: midY, w: mid }, b.offset, b.band, "z-index:2")
    );
  },
};
