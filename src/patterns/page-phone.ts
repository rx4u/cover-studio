import type { Pattern } from "./types.ts";
import { pageFrame, phoneAt, phoneHeight, phoneScreens } from "./shared.ts";

/** The page in its frame (browser, MacBook or iPad) with the same page on a phone overlapping its lower right (ZeBeyond, Growly). */
export const pagePhone: Pattern = {
  id: "page-phone",
  unavailable: ({ m }) => (m.mobile?.length ? null : "no mobile capture; set source.mobile to true"),
  render(ctx, w, h) {
    const { c, top } = ctx;
    const laptop = c.frame.device === "macbook-pro";
    const tablet = c.frame.device === "ipad-pro";
    // Every page device runs off at least one canvas edge, like the browser frame:
    // the browser and the iPad off the bottom, the MacBook off the left.
    const by = Math.max(Math.round(h * 0.1), top);
    let bw: number, bx: number;
    if (laptop) {
      bw = Math.round(Math.min(w * 1.0, ((h * 0.92 - by) / 728.4) * 1207.2));
      bx = Math.round(-bw * 0.1);
    } else if (tablet) {
      bw = Math.round(Math.max(w * 0.55, ((h - by) / 729.2) * 558.2 * 1.08));
      bx = Math.round(w * 0.07);
    } else {
      bw = Math.round(w * 0.75);
      bx = Math.round(w * 0.07);
    }
    const page = pageFrame(ctx, w, { x: bx, y: by, w: bw });
    const model = c.phone.model;
    const shot = phoneScreens(ctx, model)[0];
    // Phone bottom at 0.92H on every size; about 0.2W wide, right edge at 0.93W.
    const floor = h * 0.92;
    const unit = phoneHeight(ctx, model, 1000) / 1000;
    const pw = Math.round(Math.min(w * 0.2, (floor - by - h * 0.06) / unit));
    const px = Math.round(Math.min(w * 0.93, bx + bw + w * 0.08) - pw);
    const py = Math.round(floor - pw * unit);
    return page.html + phoneAt(ctx, w, model, shot, px, py, pw, "z-index:2");
  },
};
