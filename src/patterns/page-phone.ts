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
    const by = Math.max(Math.round(h * (laptop || tablet ? 0.12 : 0.1)), top);
    // Devices stay whole; the browser frame keeps running off the bottom edge.
    let bw = Math.round(w * (laptop ? 0.8 : tablet ? 0.5 : 0.75));
    if (laptop) bw = Math.min(bw, Math.round(((h * 0.8 - by + h * 0.12) / 728.4) * 1207.2));
    if (tablet) bw = Math.min(bw, Math.round(((h * 0.86 - by) / 729.2) * 558.2));
    const bx = laptop ? Math.round((w - bw) / 2 - w * 0.06) : tablet ? Math.round(w * 0.16) : Math.round(w * 0.07);
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
