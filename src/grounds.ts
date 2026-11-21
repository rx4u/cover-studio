import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { Browser } from "playwright";

/**
 * Shader grounds from paper-design/shaders (Apache 2.0), rendered once to a still PNG.
 * The page is served from a fake origin so the ESM build can load in Chromium.
 */
const require = createRequire(import.meta.url);
const SHADER_DIST = dirname(require.resolve("@paper-design/shaders"));
const ORIGIN = "http://cover-studio.local";

export type ShaderKind = "static-mesh" | "mesh" | "swirl";

export type ShaderSpec = {
  kind: ShaderKind;
  colors: string[];
  /** Seed for spot placement or animation frame, so renders are repeatable. */
  seed: number;
  /** Extra uniforms by name without the u_ prefix, e.g. { distortion: 0.8 }. */
  params?: Record<string, number>;
  back?: string;
};

const SIZING = { u_fit: 2, u_scale: 1, u_rotation: 0, u_originX: 0.5, u_originY: 0.5, u_offsetX: 0, u_offsetY: 0, u_worldWidth: 0, u_worldHeight: 0 };

const SHADER_EXPORT: Record<ShaderKind, string> = {
  "static-mesh": "staticMeshGradientFragmentShader",
  mesh: "meshGradientFragmentShader",
  swirl: "swirlFragmentShader",
};

export async function renderShader(browser: Browser, spec: ShaderSpec, w: number, h: number, out: string): Promise<void> {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.route(`${ORIGIN}/**`, async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/") {
      return route.fulfill({ contentType: "text/html", body: `<!doctype html><html><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden"><div id="g" style="width:${w}px;height:${h}px"></div></body></html>` });
    }
    try {
      const body = await readFile(join(SHADER_DIST, path.replace(/^\/shaders\//, "")));
      return route.fulfill({ contentType: "text/javascript", body });
    } catch {
      return route.fulfill({ status: 404, body: "" });
    }
  });
  const page = await ctx.newPage();
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(
    async ({ spec, exportName, sizing }) => {
      const shaderUrl = "/shaders/index.js";
      const m = (await import(/* @vite-ignore */ shaderUrl)) as Record<string, unknown> & {
        ShaderMount: new (el: HTMLElement, frag: string, uniforms: Record<string, unknown>, attrs?: object, speed?: number, frame?: number, minPixelRatio?: number) => unknown;
        getShaderColorFromString: (c: string) => number[];
      };
      const uniforms: Record<string, unknown> = {
        ...sizing,
        u_colors: spec.colors.map((c) => m.getShaderColorFromString(c)),
        u_colorsCount: spec.colors.length,
        u_grainMixer: 0,
        u_grainOverlay: 0,
      };
      if (spec.back) uniforms.u_colorBack = m.getShaderColorFromString(spec.back);
      if (spec.kind === "static-mesh") uniforms.u_positions = spec.seed;
      for (const [k, v] of Object.entries(spec.params ?? {})) uniforms[`u_${k}`] = v;
      new m.ShaderMount(document.getElementById("g")!, m[exportName] as string, uniforms, { preserveDrawingBuffer: true }, 0, spec.seed * 1000, 1);
      await new Promise((r) => setTimeout(r, 800));
    },
    { spec, exportName: SHADER_EXPORT[spec.kind], sizing: SIZING },
  );
  await page.screenshot({ path: out, type: "png" });
  await ctx.close();
}

/* Colour helpers for deriving grounds from one accent. */
function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}
function hex([r, g, b]: number[]): string {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();
}
export function mix(a: string, b: string, t: number): string {
  const x = rgb(a), y = rgb(b);
  return hex(x.map((v, i) => v + (y[i] - v) * t));
}
export const tint = (c: string, t: number) => mix(c, "#FFFFFF", t);
export const shade = (c: string, t: number) => mix(c, "#000000", t);

/** Pastel of the same hue: keep the hue, set saturation and lightness (0 to 1). Tints towards white go grey; this does not. */
export function pastel(c: string, sat: number, light: number, hueShift = 0): string {
  const [r, g, b] = rgb(c).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  h = (h + hueShift + 360) % 360;
  const C = (1 - Math.abs(2 * light - 1)) * sat;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - C / 2;
  const [r1, g1, b1] = h < 60 ? [C, X, 0] : h < 120 ? [X, C, 0] : h < 180 ? [0, C, X] : h < 240 ? [0, X, C] : h < 300 ? [X, 0, C] : [C, 0, X];
  return hex([(r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255]);
}
