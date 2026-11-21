# cover-studio V1 plan

One Claude Code session, about 45 to 60 minutes. Paste `prompts/build.md`. Then run the proof on a real site.

## V1 scope
1. Capture: desktop 1440x900 at 2x, two scroll positions or pages, hero photo, reveals finished.
2. Config: `cover.config.ts` with Zod validation and two presets (`neutral-light`, `neutral-dark`).
3. Look: ground (solid, linear, radial, image, photo), pattern (none, grid, dots, lines, rings, svg) with colour, opacity, scale and fade, browser frame, branding slots.
4. Patterns: full-bleed, lead-peek, photo-ground.
5. Export: 1600x1200, 1600x900, 1200x630 per pattern.

## Later (not V1)
Mobile captures and phone patterns, strips, macro, bento, the rest of docs/patterns.md, film, contact sheet, checks command, preview UI, npm publish.

## Steps
### 1. Foundation (10 min)
- [ ] package.json (type module), tsconfig, .gitignore
- [ ] `src/config.ts`: Zod schema from docs/config.md, defaults, `extends` preset merge
- [ ] `presets/neutral-light.json`, `presets/neutral-dark.json`, `examples/example.config.ts`
TEST: loading the example prints the resolved config; a bad `ground.type` prints the path and allowed values.

### 2. Capture (15 min)
- [ ] `capture` command: launch Chromium (CHROME_PATH or bundled), deviceScaleFactor 2, install and pause clock, scroll through once to finish reveals, capture each page at each scroll position, extract the hero photo from `source.photo`
- [ ] cache with `manifest.json`, `--fresh`
TEST: capture on a real URL writes the expected files at 2880x1800; second run is a cache hit.

### 3. Look and patterns (20 min)
- [ ] `src/look.ts`: ground, pattern with fade mask, browser frame, branding slots
- [ ] `src/patterns/full-bleed.ts`, `lead-peek.ts`, `photo-ground.ts` per docs/patterns.md
- [ ] `render` command: each pattern at the 3 sizes into `covers/<name>/`, named `<name>-<pattern>-<w>x<h>.png`
TEST: 9 PNGs render; covers have no text; branding appears only when enabled; the 1600x900 versions are recomposed, not cropped.

### 4. README (10 min)
- [ ] Install, 3-command quick start, config example, pattern list, MIT
TEST: a fresh clone follows the README and renders.

## Proof run
Run on a real site, look at the 9 images, and note fixes in CLAUDE.md "What was tried and failed".
