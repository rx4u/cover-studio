# cover-studio

Open-source CLI that turns a live website into finished presentation images and films: covers, post sets, case study sets, template previews and link preview images. Captures the real pages with Playwright, composes them into proven cover patterns, and exports every size each channel needs. Generic: no brand is baked in. Branding is a per-render setting.

## Context (carry forward)
- Stack: Node 20, TypeScript (strict, ESM), Playwright Chromium, Commander, Zod, ffmpeg-static, Vitest. No database. No framework.
- Templates are plain HTML and CSS strings built by TypeScript functions, rendered to PNG by Playwright. One template file per pattern.
- Every template is resolution-aware: it receives (width, height) and lays out for that canvas. Other sizes are recomposed, never cropped.
- Config: `cover.config.ts` validated by Zod. Presets are JSON in `presets/` and merged with `extends`.
- Captures are cached in `.cover-cache/<project>/` and reused until `--fresh`.
- Output goes to `covers/<project>/` with `plan/`, `rounds/<n>/`, `final/`.
- Architecture decisions locked: CLI first, preview UI is V2. 8 patterns in V1. Branding off by default.
- Constraints: public MIT repo. Free tools only. Must run on macOS, Linux and in a cloud sandbox with system Chrome.
- What was tried and failed (from the pipeline this generalises):
  - Recording the screen in real time stutters. Always render frame by frame on a paused clock.
  - Playwright `clock.install()` alone lets time run. Call `clock.pauseAt()` then advance exactly 1000/fps ms per frame.
  - Films that open on black. Decode all images and finish reveals before frame one.
  - Tall full-page images rejected. Every output is a fixed canvas; long pages become strips inside it.
  - Device mockups with tabs, pills and badges looked childish. Frames stay plain.
  - Grain and noise overlays rejected. There is no noise option.
- What must not change: no text or logo on the cover unless `branding.onCover` is true; every pixel of product comes from a real capture; no invented numbers or copy.

## Current Status
- [ ] Phase A: setup, config, presets
- [ ] Phase B: capture
- [ ] Phase C: look engine
- [ ] Phase D: patterns 1 (full-bleed, lead-peek, photo-ground, strips)
- [ ] Phase E: patterns 2 (macro, page-phone, phone-trio, bento)
- [ ] Phase F: export and checks
- [ ] Phase G: motion loop and film
- [ ] Phase H: docs and proof run
Update this list at the end of every phase.

## Commands
- `npm run dev -- <args>`: run the CLI from source (tsx)
- `npm test`: Vitest
- `npm run build`: tsc to `dist/`
- `npx playwright install chromium`: first-time browser install (or set `CHROME_PATH`)

## CLI surface (V1)
- `cover-studio init [name]`: write a starter `cover.config.ts`
- `cover-studio validate <config>`: Zod check with readable errors
- `cover-studio capture <config>`: fill the cache
- `cover-studio render <config> [--pattern x] [--set] [--sizes a,b] [--fresh]`
- `cover-studio swatch <config>`: grid of ground and pattern options for choosing a look
- `cover-studio film <config> [--loop|--full]`
- `cover-studio check <config>`: thumbnail and safe-area checks on the last render

## Rules
1. One pattern per file in `src/patterns/`. Each exports `{ id, needs, render(ctx, w, h) }` where `needs` lists the captures it requires.
2. Layout numbers live in the pattern file as proportions of the canvas, not fixed pixels, so 1600x1200, 1600x900 and 1200x630 all work.
3. Never crop through a headline, a face or a product. Crops are anchored by config (`focus`), default top-left of the hero.
4. The 1600x900 output keeps the subject inside a centred 16:9 safe area; check it in `check`.
5. No colour defaults in the amber, gold or warm yellow-orange range.
6. No em dashes in code comments, docs or output text.
7. Every new config field gets a Zod schema entry, a default, a docs/config.md line and a test.
8. Do not add dependencies beyond the stack above without asking.

## Output design defaults
- Default ground: flat neutral `#E4E4E2` (light) or `#0E0F0F` (dark).
- Frame: radius 16, browser bar 40px, three neutral dots, no address text, soft low shadow.
- Phone: plain black bezel, radius about 64 at 340 wide, no status bar fakes.
- Gaps between frames: 32 (single) or 24 (grids). Outer margin 6 to 7 percent of width.
- Contact sheet type: system UI font, 12px labels. Covers carry no type.

## Files to read before work
- `plan.md` for the phase you are on
- `docs/patterns.md` for pattern specs
- `docs/config.md` for the config reference
- `prompts/phase-<X>.md` for the session prompt
