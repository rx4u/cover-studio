# cover-studio

Open-source CLI that turns a live website into presentation-ready covers in proven patterns, at every size a channel needs. Generic: no brand is baked in. Branding is a per-render setting.

## Context (carry forward)
- Stack: Node 20, TypeScript (ESM), Playwright Chromium, Zod, tsx. No other dependencies. No database. No framework.
- V1 is deliberately small: one script, `src/cover.ts`, plus `src/patterns/` (one file per pattern) and `src/look.ts` (ground, pattern, frame, branding).
- Templates are HTML and CSS strings rendered to PNG by Playwright.
- Every template is resolution-aware: it receives (width, height) and lays out for that canvas. Other sizes are recomposed, never cropped.
- Config: `cover.config.ts` validated by Zod. Presets are JSON in `presets/`, merged with `extends`.
- Captures cached in `.cover-cache/<name>/`; output in `covers/<name>/`.
- Locked: 3 patterns in V1 (full-bleed, lead-peek, photo-ground). Branding off by default. No film in V1.
- Constraints: public MIT repo. Free tools only. Runs on macOS, Linux and cloud sandboxes with system Chrome (`CHROME_PATH`).
- What was tried and failed (from the pipeline this generalises):
  - Captures taken before scroll reveals finish show blank sections. Scroll the page once, return, settle, then capture.
  - Playwright `clock.install()` alone lets time run. Call `clock.pauseAt()` after install.
  - Tall full-page images were rejected. Every output is a fixed canvas.
  - Device mockups with tabs, pills and badges looked childish. Frames stay plain.
  - Grain and noise overlays rejected. There is no noise option.
  - An earlier 8-phase plan (18 patterns, film, presets UI) was too big. Do not grow V1 scope.
- What must not change: no text or logo on the cover unless `branding.onCover` is true; every pixel of product comes from a real capture; nothing invented.

## Current Status
- [ ] V1 build (see plan.md)
- [ ] Proof run on one real site
Update after each step.

## Commands
- `npx tsx src/cover.ts capture <config>`
- `npx tsx src/cover.ts render <config> [--pattern id] [--fresh]`
- `npx playwright install chromium` (or set `CHROME_PATH`)

## Rules
1. One pattern per file in `src/patterns/`, exporting `{ id, render(ctx, w, h) }`.
2. Layout numbers are proportions of the canvas, not fixed pixels.
3. Never crop through a headline. Crops anchor on config `focus`, default top-left.
4. The 1600x900 output keeps the subject inside a centred 16:9 safe area.
5. No colour defaults in the amber, gold or warm yellow-orange range.
6. No em dashes in code, comments, docs or output.
7. Do not add dependencies or scope beyond this file without asking.

## Output design defaults
- Ground: flat neutral `#E4E4E2` (light) or `#0E0F0F` (dark).
- Frame: radius 16, browser bar 40px, three neutral dots, no address text, soft low shadow.
- Outer margin 6 to 7 percent of width. Covers carry no type.

## Read before work
- `plan.md`, `docs/patterns.md` (V1 section), `docs/config.md`
