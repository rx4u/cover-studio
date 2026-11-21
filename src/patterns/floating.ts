import { pngSize, tile } from "../look.ts";
import { shotsFor } from "../devices.ts";
import type { Pattern } from "./types.ts";

const LIFT = "0 50px 100px -30px rgba(10,20,30,.34), 0 16px 34px -16px rgba(10,20,30,.22)";
const SOFT = "0 30px 70px -30px rgba(10,20,30,.22), 0 10px 24px -14px rgba(10,20,30,.14)";

/**
 * Two screens floating on the ground, one in front of the other. Measured from Zajno's Skymetrics shot:
 * a narrow screen in front, 0.84H tall, right edge at 0.945W (lifted shadow); the desktop page behind it from 0.05W,
 * running 0.1W under the front so they read as one group, as large as the canvas allows (soft shadow). No dead space. The narrow screen is the site's
 * phone screen of a later section, so the two show different content; without mobile captures, a second desktop view
 * taken from a section start. No browser chrome, radius 12.
 */
export const floating: Pattern = {
  id: "floating",
  unavailable: ({ m }) => (m.talls?.length ? null : "no capture"),
  render({ c, m, top }, w, h) {
    const k = w / 1600;
    const r = 12;
    // Front first: the phone screen of a later section, whole, 0.84H tall, right edge at 0.945W.
    const phones = m.mobile?.length ? shotsFor(c, m.mobile, c.phone.model) : [];
    const shot = phones.find((p) => p.y > 0) ?? phones[0];
    let fw: number, fh: number, front: string;
    const fy0 = Math.max(Math.round(h * 0.08), top);
    if (shot) {
      const [sw, sh] = pngSize(shot.file);
      const nav = (shot.nav ?? 0) / (shot.w ?? 402);
      const ratio = sh / sw - nav; // shown height per unit width, below the sticky header
      fh = Math.round(h * 0.84);
      fw = Math.round(Math.min(fh / ratio, w * 0.34));
      fh = Math.round(fw * ratio);
      front = tile(w, shot.file, { x: 0, y: 0, w: fw, h: fh }, { radius: r * 1.5, shadow: false, pos: `50% -${Math.round(nav * fw)}px` });
    } else {
      fw = Math.round(w * 0.36);
      fh = Math.round(h * 0.84);
      const start = (m.sections?.[0] ?? []).find((t) => t > 900) ?? 900;
      front = `<div style="position:absolute;left:0;top:0;width:${fw}px;height:${fh}px;border-radius:${r * k}px;overflow:hidden;background:#fff"><img src="file://${m.full[0].file}" style="display:block;width:${Math.round(fw * 1.6)}px;transform:translate(-18%,-${Math.round(start * ((fw * 1.6) / 1440))}px)"></div>`;
    }
    const fx = Math.round(w * 0.945) - fw;
    const fy = Math.max(Math.round((h - fh) / 2 - h * 0.02), fy0);
    // Back: the desktop first screen, tucked 0.1W under the front so the two read as one group. It reaches from
    // 0.05W, or is made larger and runs off the left edge when that is needed to stand at least 0.62H tall (4:3), so
    // the group fills the canvas.
    const tuck = fx + Math.round(w * 0.1);
    // The first screen is never cropped: at most 0.8H tall.
    const bw = Math.min(Math.max(tuck - Math.round(w * 0.05), Math.round(h * 0.62 * 1.6)), Math.round(h * 0.8 * 1.6));
    const bx = tuck - bw;
    const bh = Math.round((bw * 900) / 1440);
    const by = Math.max(Math.round(fy + fh / 2 - bh / 2 + h * 0.04), top);
    let out = tile(w, m.talls[0].file, { x: bx, y: by, w: bw, h: bh }, { radius: r, shadow: false, pos: `50% ${c.focus.y * 100}%` }).replace("box-shadow:none", `box-shadow:${SOFT}`);
    out += front.replace("left:0;top:0;", `left:${fx}px;top:${fy}px;`).replace(/position:absolute;left:0px;top:0px;/, `position:absolute;left:${fx}px;top:${fy}px;`).replace("box-shadow:none", `box-shadow:${LIFT}`);
    return out;
  },
};
