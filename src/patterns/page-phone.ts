import { frame, phone } from "../look.ts";
import type { Pattern } from "./types.ts";

/** The page in a browser frame with the same page on a phone overlapping its lower right. */
export const pagePhone: Pattern = {
  id: "page-phone",
  unavailable: ({ m }) => (m.mobile?.length ? null : "no mobile capture; set source.mobile to true"),
  render({ c, m, top }, w, h) {
    const bw = Math.round(w * 0.75);
    const by = Math.max(Math.round(h * 0.1), top);
    const pw = Math.round(Math.min(w * 0.21, h * 0.82 * (390 / 844)));
    const px = Math.round(w * 0.93 - pw);
    const py = Math.max(Math.round(h * 0.29), by + Math.round(h * 0.08));
    return frame(c, w, m.talls[0].file, { x: Math.round(w * 0.07), y: by, w: bw }) + phone(w, m.mobile[0].file, { x: px, y: py, w: pw });
  },
};
