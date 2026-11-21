import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { Browser } from "playwright";
import { parseSize, type Config } from "./config.ts";
import { cacheDir, launch, type Manifest } from "./capture.ts";
import { branding, groundCSS, patternLayer, url } from "./look.ts";
import { PATTERNS } from "./patterns/index.ts";

export function outDir(c: Config): string {
  return resolve(process.cwd(), "covers", c.name);
}

function page(c: Config, m: Manifest, patternId: string, w: number, h: number, isCover: boolean): string {
  const p = PATTERNS[patternId];
  const onPhoto = patternId === "photo-ground";
  const look: Config = onPhoto ? { ...c, ground: { ...c.ground, type: "photo", dim: c.ground.dim || 0.08 } } : c;
  const brand = branding(c, w, h, isCover);
  const inner = p.render({ c, m, top: brand.top }, w, h);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{position:relative;${groundCSS(look, m.photo)}}
</style></head><body>${onPhoto ? "" : patternLayer(c, w, h)}${inner}${brand.html}</body></html>`;
}

async function shoot(browser: Browser, html: string, w: number, h: number, workDir: string, out: string): Promise<void> {
  const file = join(workDir, "_render.html");
  await writeFile(file, html);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  await pg.goto(url(file), { waitUntil: "load" });
  await pg.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => null)))));
  await pg.screenshot({ path: out, type: "png" });
  await ctx.close();
}

export async function render(c: Config, m: Manifest, only?: string): Promise<string[]> {
  const ids = only ? [only] : c.patterns;
  for (const id of ids) if (!PATTERNS[id]) throw new Error(`Unknown pattern "${id}". Available: ${Object.keys(PATTERNS).join(", ")}`);
  if (!m.shots.length || !m.talls.length) throw new Error("No captures in the cache. Run capture first, and check that source.pages load.");
  const dir = outDir(c);
  await mkdir(dir, { recursive: true });
  const browser = await launch();
  const written: string[] = [];
  try {
    for (const id of ids) {
      const why = PATTERNS[id].unavailable?.({ c, m, top: 0 });
      if (why) {
        console.warn(`render: skipped ${id}: ${why}`);
        continue;
      }
      const isCover = c.patterns.indexOf(id as (typeof c.patterns)[number]) === 0;
      for (const size of c.export.sizes) {
        const [w, h] = parseSize(size);
        const out = join(dir, `${c.name}-${c.patterns.indexOf(id as (typeof c.patterns)[number]) + 1}-${id}-${size}.png`);
        await shoot(browser, page(c, m, id, w, h, isCover), w, h, cacheDir(c), out);
        written.push(out);
        console.log(`render: ${out.split("/").pop()}`);
      }
    }
  } finally {
    await browser.close();
  }
  return written;
}
