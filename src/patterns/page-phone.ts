import { frame, phone, phoneFinish } from "../look.ts";
import type { Pattern } from "./types.ts";

/** The page in a browser frame with the same page on a phone overlapping its lower right. */
export const pagePhone: Pattern = {
  id: "page-phone",
  unavailable: ({ m }) => (m.mobile?.length ? null : "no mobile capture; set source.mobile to true"),
  render({ c, m, top }, w, h) {
    const bw = Math.round(w * 0.75);
    const by = Math.max(Math.round(h * 0.1), top);
    // ZeBeyond, Growly: phone about 0.2W, overlapping the page frame's right edge.
    // The whole phone stays on canvas: its bottom sits at 0.92H on every size.
    const ratio = c.phone.style === "frameless" ? 844 / 390 : 868 / 428;
    const floor = h * 0.92;
    const pw = Math.round(Math.min(w * 0.2, (floor - by - h * 0.06) / ratio));
    const px = Math.round(w * 0.93 - pw);
    const py = Math.round(floor - pw * ratio);
    return frame(c, w, m.talls[0].file, { x: Math.round(w * 0.07), y: by, w: bw }) + phone(w, m.mobile[0].file, { x: px, y: py, w: pw }, { band: m.mobile[0].topColor, style: c.phone.style, statusBar: c.phone.statusBar, finish: phoneFinish(c) });
  },
};
