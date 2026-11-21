/**
 * The system UI each platform draws over the top of its screen, laid out in points at the platform's real sizes.
 * Every function returns HTML for a box `width` points wide; the caller scales it to the screen.
 * Time is 9:41 (Apple's convention, used on every platform for consistency); the date is Sat 21 Nov.
 */

const APPLE_FONT = "-apple-system,'SF Pro Text','SF Pro',Inter,system-ui,sans-serif";
const ANDROID_FONT = "'Google Sans','Google Sans Text',Roboto,Inter,system-ui,sans-serif";

export type Os = "ios" | "ipados" | "android" | "macos";

/**
 * Horizontal inset that keeps content clear of a rounded screen corner of radius `r`, for content whose top edge sits
 * `yTop` points below the top of the screen, plus a comfortable margin (12pt or a quarter of the radius), so content
 * keeps clear of the curve the way real status bars do, not just outside it.
 */
export const cornerMargin = (r: number) => Math.max(12, r * 0.25);

export function cornerInset(r: number, yTop: number, margin = cornerMargin(r)): number {
  if (yTop >= r) return margin;
  return r - Math.sqrt(r * r - (r - yTop) ** 2) + margin;
}

/** Left and right padding for a bar `height` tall whose content is `content` tall, centred, given the corner radius. */
function pads(r: number, height: number, content: number, base: [number, number], shift = 0): [number, number] {
  const need = cornerInset(r, (height - content) / 2 + shift);
  return [Math.max(base[0], need), Math.max(base[1], need)];
}

const iosSignal = (ink: string) =>
  `<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="${ink}"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="${ink}"/><rect x="10" y="3" width="3" height="9" rx="1" fill="${ink}"/><rect x="15" y="0" width="3" height="12" rx="1" fill="${ink}"/></svg>`;
const appleWifi = (ink: string, w = 16) =>
  `<svg width="${w}" height="${(w * 12) / 16}" viewBox="0 0 16 12"><path d="M8 11.5 10.4 9a3.4 3.4 0 0 0-4.8 0Z M3.2 6.6a6.8 6.8 0 0 1 9.6 0l1.6-1.6a9.1 9.1 0 0 0-12.8 0Z M0 3.4a11.3 11.3 0 0 1 16 0L14.4 5A9 9 0 0 0 1.6 5Z" fill="${ink}"/></svg>`;
const appleBattery = (ink: string, w = 27) =>
  `<svg width="${w}" height="${(w * 13) / 27}" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="${ink}" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="${ink}"/><path d="M25 4.5v4a2 2 0 0 0 0-4Z" fill="${ink}" opacity=".4"/></svg>`;
/** macOS Control Centre: two stacked toggles. */
const macControl = (ink: string) =>
  `<svg width="15" height="13" viewBox="0 0 15 13"><rect x=".75" y=".75" width="13.5" height="4.5" rx="2.25" fill="none" stroke="${ink}" stroke-width="1.3"/><circle cx="3" cy="3" r="1.4" fill="${ink}"/><rect x=".75" y="7.75" width="13.5" height="4.5" rx="2.25" fill="none" stroke="${ink}" stroke-width="1.3"/><circle cx="12" cy="10" r="1.4" fill="${ink}"/></svg>`;
/** Material wifi: a filled fan. */
const androidWifi = (ink: string) =>
  `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 21 0.5 7.5A17.5 17.5 0 0 1 23.5 7.5Z" fill="${ink}"/></svg>`;
/** Material cellular: a filled right triangle. */
const androidSignal = (ink: string) =>
  `<svg width="15" height="15" viewBox="0 0 24 24"><path d="M2 22 22 2v20Z" fill="${ink}"/></svg>`;
/** Material battery: an upright pill. */
const androidBattery = (ink: string) =>
  `<svg width="9" height="16" viewBox="0 0 9 16"><rect x="2.5" y="0" width="4" height="2" rx=".6" fill="${ink}"/><rect x="0" y="1.5" width="9" height="14.5" rx="1.8" fill="${ink}"/></svg>`;

/** iPhone: time left of the island, signal, wifi and battery right of it. 62pt tall on Dynamic Island models. */
export function iosStatus(width: number, height: number, ink: string, r: number): string {
  const [l, rt] = pads(r, height, 17, [42, 34], 2);
  return `<div style="position:absolute;left:0;top:0;width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:space-between;padding:4px ${rt}px 0 ${l}px;box-sizing:border-box;font:600 17px/1 ${APPLE_FONT};color:${ink}"><span>9:41</span><span style="display:flex;gap:6px;align-items:center">${iosSignal(ink)}${appleWifi(ink)}${appleBattery(ink)}</span></div>`;
}

/** iPad (wifi model): time and date left, wifi and battery right. No cellular bars. 24pt tall. */
export function ipadStatus(width: number, height: number, ink: string, r: number): string {
  const [l, rt] = pads(r, height, 14, [38, 34]);
  return `<div style="position:absolute;left:0;top:0;width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:space-between;padding:0 ${rt}px 0 ${l}px;box-sizing:border-box;font:600 14px/1 ${APPLE_FONT};color:${ink}"><span>9:41<span style="font-weight:500;margin-left:7px">Sat 21 Nov</span></span><span style="display:flex;gap:6px;align-items:center">${appleWifi(ink, 15)}${appleBattery(ink, 25)}</span></div>`;
}

/** Android (Pixel, Galaxy): time left, wifi, signal and battery right, Material shapes. */
export function androidStatus(width: number, height: number, ink: string, r: number): string {
  const [l, rt] = pads(r, height, 16, [24, 22], 1);
  return `<div style="position:absolute;left:0;top:0;width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:space-between;padding:2px ${rt}px 0 ${l}px;box-sizing:border-box;font:500 14px/1 ${ANDROID_FONT};color:${ink}"><span>9:41</span><span style="display:flex;gap:5px;align-items:center">${androidWifi(ink)}${androidSignal(ink)}${androidBattery(ink)}</span></div>`;
}

/**
 * macOS menu bar on a notched MacBook Pro: 37pt tall. App name in bold and the app's menus on the left,
 * Control Centre, wifi, battery and the date and time on the right; nothing under the notch (centred, about 200pt wide).
 */
export function macMenuBar(width: number, height: number, bg: string, ink: string, r: number): string {
  const [l, rt] = pads(r, height, 13, [22, 18]);
  const menus = ["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"].map((m) => `<span>${m}</span>`).join("");
  return `<div style="position:absolute;left:0;top:0;width:${width}px;height:${height}px;background:${bg};display:flex;align-items:center;justify-content:space-between;padding:0 ${rt}px 0 ${l}px;box-sizing:border-box;font:500 13px/1 ${APPLE_FONT};color:${ink};z-index:3"><span style="display:flex;gap:20px;align-items:center;max-width:${width / 2 - 120}px;overflow:hidden;white-space:nowrap"><b style="font-weight:700">Safari</b>${menus}</span><span style="display:flex;gap:16px;align-items:center;white-space:nowrap">${macControl(ink)}${appleWifi(ink, 15)}${appleBattery(ink, 24)}<span>Sat 21 Nov&nbsp;&nbsp;9:41</span></span></div>`;
}
