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

/*
 * Glyphs come from device-bars (github.com/SimonGolms/device-bars, MIT): its iOS set is Ionicons (MIT) and its
 * Android set is Google's Material Icons (Apache 2.0), the icons Android's own status bar uses. Paths are unchanged;
 * only the viewBox is cropped to each glyph so they size cleanly.
 */
const svg = (vb: string, w: number, h: number, body: string) => `<svg width="${w}" height="${h}" viewBox="${vb}">${body}</svg>`;
const iosSignal = (ink: string, w = 18) =>
  svg("16 80 480 352", w, (w * 352) / 480, `<g fill="${ink}"><path d="M472,432H424a24,24,0,0,1-24-24V104a24,24,0,0,1,24-24h48a24,24,0,0,1,24,24V408A24,24,0,0,1,472,432Z"/><path d="M344,432H296a24,24,0,0,1-24-24V184a24,24,0,0,1,24-24h48a24,24,0,0,1,24,24V408A24,24,0,0,1,344,432Z"/><path d="M216,432H168a24,24,0,0,1-24-24V248a24,24,0,0,1,24-24h48a24,24,0,0,1,24,24V408A24,24,0,0,1,216,432Z"/><path d="M88,432H40a24,24,0,0,1-24-24V312a24,24,0,0,1,24-24H88a24,24,0,0,1,24,24v96A24,24,0,0,1,88,432Z"/></g>`);
const appleWifi = (ink: string, w = 16) =>
  svg("32 96 448 320", w, (w * 320) / 448, `<g fill="${ink}"><path d="M256,96c-83,0-166.1,35.8-224,93.7l37.3,39.6c24.3-24.3,52.5-43.3,83.9-56.6C185.8,159,220.3,152,256,152 s70.2,7,102.7,20.7c31.4,13.3,59.7,32.3,83.9,56.6l37.3-39.6C422.1,131.8,339,96,256,96L256,96z"/><path d="M256,209c-57.2,0-109,23.1-146.6,60.4L149,309c28.7-28.4,66.6-44,107-44c40.4,0,78.3,15.6,107,44l39.6-39.6 C365,232.1,313.2,209,256,209L256,209z"/><path d="M256,321c-25.9,0-48.9,12.3-63.6,31.4L256,416l63.6-63.6C304.9,333.3,281.9,321,256,321L256,321z"/></g>`);
const appleBattery = (ink: string, w = 27) =>
  svg("16 144 480 224", w, (w * 224) / 480, `<g fill="${ink}"><path opacity=".5" d="M396,144H64c-26.4,0-48,21.6-48,48v128c0,26.4,21.6,48,48,48h332c26.4,0,48-21.6,48-48V192C444,165.6,422.4,144,396,144z M416,320c0,11-9,20-20,20H64c-11,0-20-9-20-20V192c0-11,9-20,20-20h332c11,0,20,9,20,20V320z"/><path opacity=".5" d="M464,204.6v102.8c16,0,32-27.7,32-51.4C496,232.3,480,204.6,464,204.6z"/><path d="M384,192H76c-6.6,0-12,5.4-12,12v104c0,6.6,5.4,12,12,12h308c6.6,0,12-5.4,12-12V204C396,197.4,390.6,192,384,192z"/></g>`);
/** macOS Control Centre: two stacked toggles (no open glyph exists for it). */
const macControl = (ink: string) =>
  `<svg width="15" height="13" viewBox="0 0 15 13"><rect x=".75" y=".75" width="13.5" height="4.5" rx="2.25" fill="none" stroke="${ink}" stroke-width="1.3"/><circle cx="3" cy="3" r="1.4" fill="${ink}"/><rect x=".75" y="7.75" width="13.5" height="4.5" rx="2.25" fill="none" stroke="${ink}" stroke-width="1.3"/><circle cx="12" cy="10" r="1.4" fill="${ink}"/></svg>`;
const androidWifi = (ink: string) =>
  svg("0 3 24 19", 17, 13.5, `<path fill="${ink}" d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>`);
const androidSignal = (ink: string) => svg("2 2 20 20", 14, 14, `<path fill="${ink}" d="M2 22h20V2z"/>`);
const androidBattery = (ink: string) =>
  svg("7 2 10 20", 8, 16, `<path fill="${ink}" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>`);

/** iPhone: time left of the island, signal, wifi and battery right of it. 62pt tall on Dynamic Island models. */
export function iosStatus(width: number, height: number, ink: string, r: number): string {
  const [l, rt] = pads(r, height, 17, [42, 34], 2);
  return `<div style="position:absolute;left:0;top:0;width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:space-between;padding:4px ${rt}px 0 ${l}px;box-sizing:border-box;font:600 17px/1 ${APPLE_FONT};color:${ink}"><span>9:41</span><span style="display:flex;gap:6px;align-items:center">${iosSignal(ink)}${appleWifi(ink)}${appleBattery(ink)}</span></div>`;
}

/** iPad (wifi model): time and date left, wifi and battery right. No cellular bars. 24pt tall. */
export function ipadStatus(width: number, height: number, ink: string, r: number): string {
  const [l, rt] = pads(r, height, 14, [38, 34]);
  return `<div style="position:absolute;left:0;top:0;width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:space-between;padding:0 ${rt}px 0 ${l}px;box-sizing:border-box;font:600 14px/1 ${APPLE_FONT};color:${ink}"><span>9:41<span style="font-weight:500;margin-left:7px">Sat 21 Nov</span></span><span style="display:flex;gap:6px;align-items:center">${appleWifi(ink, 15)}<span style="font-weight:500">100%</span>${appleBattery(ink, 25)}</span></div>`;
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
