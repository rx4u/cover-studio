import { frame } from "../look.ts";
import type { Pattern } from "./types.ts";

/** One page in a 3D tilt, running off the right and bottom. Angle from layout.tilt. */
export const tilt: Pattern = {
  id: "tilt",
  render({ c, m, top }, w, h) {
    const a = c.layout.tilt;
    const inner = frame(c, w, m.talls[0].file, { x: Math.round(w * 0.16), y: Math.max(Math.round(h * 0.1), top), w: Math.round(w * 0.76) }, "0% 0%", `transform:rotateX(${(a * 0.45).toFixed(1)}deg) rotateY(-${a}deg) rotateZ(${(a * 0.1).toFixed(1)}deg);transform-origin:0% 50%`);
    return `<div style="position:absolute;inset:0;perspective:${Math.round(2600 * (w / 1600))}px">${inner}</div>`;
  },
};
