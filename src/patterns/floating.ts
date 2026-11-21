import { pngSize, tile } from "../look.ts";
import { shotsFor } from "../devices.ts";
import type { Pattern } from "./types.ts";

const LIFT = "0 50px 100px -30px rgba(10,20,30,.34), 0 16px 34px -16px rgba(10,20,30,.22)";
const SOFT = "0 30px 70px -30px rgba(10,20,30,.22), 0 10px 24px -14px rgba(10,20,30,.14)";

/**
 * Two screens floating on the ground, one in front of the other. Measured from Zajno's Skymetrics shot:
 * the desktop page low and left (x 0.05W, from 0.165H, 0.55W wide, 0.62H tall, soft shadow); a narrow screen high and
 * right in front of it (top 0.065H, bottom 0.93H, right edge 0.945W, lifted shadow). The narrow screen is the site's
 * phone screen of a later section, so the two show different content; without mobile captures, a second desktop view
 * taken from a section start. No browser chrome, radius 12.
 */
export const floating: Pattern = {
  id: "floating",
  unavailable: ({ m }) => (m.talls?.length ? null : "no capture"),
  render({ c, m, top }, w, h) {
    const k = w / 1600;
    const r = 12;
    // The back page shows exactly its first screen (1440x900), so the next section is never cut at its foot.
    const bw = Math.round(w * 0.55);
    const back = { x: Math.round(w * 0.05), y: Math.max(Math.round(h * 0.165), top), w: bw, h: Math.min(Math.round(h * 0.62), Math.round((bw * 900) / 1440)) };
    let out = tile(w, m.talls[0].file, back, { radius: r, shadow: false, pos: `50% ${c.focus.y * 100}%` }).replace("box-shadow:none", `box-shadow:${SOFT}`);
    let fy = Math.max(Math.round(h * 0.065), top);
    let fh = Math.round(h * 0.93) - fy;
    const phones = m.mobile?.length ? shotsFor(c, m.mobile, c.phone.model) : [];
    const shot = phones.find((p) => p.y > 0) ?? phones[0];
    if (shot) {
      // The phone screen is shown whole: its tile takes the shot's own shape (no empty band at its foot).
      const [sw, sh] = pngSize(shot.file);
      const fw = Math.round(Math.min(fh * (sw / sh), w * 0.36));
      // Cropped below the sticky header: the tile is that much shorter, so the shot still fills it.
      const navPx = Math.round(((shot.nav ?? 0) * fw) / (shot.w ?? 402));
      fh = Math.round((fw * sh) / sw) - navPx;
      fy = Math.max(Math.round((h - fh) / 2 - h * 0.03), top);
      const pos = `50% -${Math.round(((shot.nav ?? 0) * fw) / (shot.w ?? 402))}px`;
      out += tile(w, shot.file, { x: Math.round(w * 0.945) - fw, y: fy, w: fw, h: fh }, { radius: r * 1.5, shadow: false, pos }).replace("box-shadow:none", `box-shadow:${LIFT}`);
    } else {
      const fw = Math.round(w * 0.41);
      const start = (m.sections?.[0] ?? []).find((t) => t > 900) ?? 900;
      const full = m.full[0].file;
      out += `<div style="position:absolute;left:${Math.round(w * 0.945) - fw}px;top:${fy}px;width:${fw}px;height:${fh}px;border-radius:${r * k}px;overflow:hidden;box-shadow:${LIFT};background:#fff"><img src="file://${full}" style="display:block;width:${Math.round(fw * 1.6)}px;transform:translate(-18%,-${Math.round(start * ((fw * 1.6) / 1440))}px)"></div>`;
    }
    return out;
  },
};
