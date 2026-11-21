/**
 * Checks that no system UI (status bars, the macOS menu bar, browser dots) touches a device's rounded screen corners.
 * Run: npx tsx scripts/check-corners.mts. Exits 1 if anything is clipped.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { device, DEVICE_CSS, CHROME, SPECS } from "../src/devices.ts";
import { url } from "../src/look.ts";
import { cornerMargin } from "../src/system-ui.ts";
// The capture is irrelevant here: a 1x1 PNG stands in for the page.
const blank = "/tmp/cover-studio-blank.png";
writeFileSync(blank, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BAwAI/AL+hc2rNAAAAABJRU5ErkJggg==", "base64"));
const items: string[] = []; let y = 20;
for (const model of Object.keys(SPECS)) for (const browser of [false, true]) {
  const w = model === "macbook-pro" ? 1500 : model === "ipad-pro" ? 800 : 420;
  items.push(`<div data-m="${model}-${browser}" data-pt="${SPECS[model].pt}" data-margin="${cornerMargin(SPECS[model].radius) - 1}">` + device(1600, blank, { x: 20, y, w }, { model, colour: Object.keys(SPECS[model].tones)[0], band: "rgb(176,200,238)", desktop: model === "macbook-pro", chrome: CHROME.light, browser }) + "</div>");
  y += 1000;
}
writeFileSync("/tmp/c.html", `<html><head><link rel="stylesheet" href="${url(DEVICE_CSS)}"></head><body style="margin:0;position:relative;height:${y}px">${items.join("")}</body></html>`);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome" });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.addInitScript("window.__name = (f) => f;"); await p.goto("file:///tmp/c.html"); await p.waitForTimeout(800);
const res = await p.evaluate(() => [...document.querySelectorAll("[data-m]")].map((wrap) => {
  const scr = wrap.querySelector(".screen")!; const R = scr.getBoundingClientRect();
  const s = (scr.getBoundingClientRect().width / (scr as HTMLElement).offsetWidth);
  const r = parseFloat(getComputedStyle(scr).borderTopLeftRadius) * s;
  const m = Number(wrap.getAttribute("data-margin")) * (R.width / Number(wrap.getAttribute("data-pt")));
  // A point is clear when it sits at least the comfort margin inside the corner curve (same rule as the layout).
  const inside = (x: number, y: number) => {
    const dy = y - R.top;
    const need = dy >= r ? m : r - Math.sqrt(r * r - (r - Math.max(dy, 0)) ** 2) + m;
    return x - R.left >= need - 0.5 && R.right - x >= need - 0.5;
  };
  const bad: string[] = []; let worst = 1e9;
  for (const el of scr.querySelectorAll("span, b, svg, i")) {
    const e = el.getBoundingClientRect(); if (!e.width || e.top > R.top + 200) continue;
    for (const [x, yy] of [[e.left, e.top], [e.right, e.top], [e.left, e.bottom], [e.right, e.bottom]]) if (!inside(x, yy)) bad.push(el.tagName + (el.textContent || "").slice(0, 10));
  }
  return [wrap.getAttribute("data-m"), bad.length ? "CLIPPED: " + [...new Set(bad)].join(", ") : "clear"];
}));
for (const r of res) console.log(r.join("  "));
if (res.some((r) => r[1] !== "clear")) process.exitCode = 1;
await b.close();
