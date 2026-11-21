import { phone } from "../look.ts";
import type { Pattern } from "./types.ts";

/** Three phones, the middle one larger and raised. Uses mobile shots, then segments of the tall mobile capture. */
export const phoneTrio: Pattern = {
  id: "phone-trio",
  unavailable: ({ m }) => (m.mobile?.length ? null : "no mobile capture; set source.mobile to true"),
  render({ m, top }, w, h) {
    const imgs: { file: string; off: number }[] = m.mobile.map((s) => ({ file: s.file, off: 0 }));
    const t = m.mobileTalls[0];
    for (const off of [40, 80]) if (imgs.length < 3 && t) imgs.push({ file: t.file, off });
    while (imgs.length < 3) imgs.push(imgs[0]);
    const pw = Math.round(Math.min(w * 0.22, (h - top) * 0.78 * (390 / 844)));
    const gap = Math.round(w * 0.03);
    const mid = Math.round(pw * 1.06);
    const total = pw * 2 + mid + gap * 2;
    const x0 = Math.round((w - total) / 2);
    const phoneH = (p: number) => p * (844 / 390);
    const baseY = Math.max(top, Math.round((h - phoneH(pw)) / 2 + h * 0.03));
    const midY = Math.max(top, baseY - Math.round(h * 0.05) - Math.round((phoneH(mid) - phoneH(pw)) / 2));
    return (
      phone(w, imgs[0].file, { x: x0, y: baseY, w: pw }, imgs[0].off) +
      phone(w, imgs[2].file, { x: x0 + pw + gap + mid + gap, y: baseY, w: pw }, imgs[2].off) +
      phone(w, imgs[1].file, { x: x0 + pw + gap, y: midY, w: mid }, imgs[1].off)
    );
  },
};
