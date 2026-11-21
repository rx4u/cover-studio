# cover-studio build plan

8 phases, about 9 hours of build in Claude Code. One fresh session per phase. Each phase ends with its TEST; do not start the next phase until it passes. Update "Current Status" in CLAUDE.md after each phase. Session prompts are in `prompts/`.

## V1 scope
1. Capture: desktop and mobile at 2x, full page, element crops, reveals finished, paused clock.
2. Config file and presets, validated.
3. Look controls: ground, pattern, frame, phone.
4. 8 patterns: full-bleed, lead-peek, photo-ground, strips, macro, page-phone, phone-trio, bento.
5. Branding per render, off by default.
6. Export: 1600x1200, 1600x900, 1200x630, contact sheet, checks.
7. Motion loop and full film.

## V2 parking lot
- Local preview UI with live controls (needs a stable config first).
- The 10 remaining patterns in docs/patterns.md.
- Case study and proposal set recipes.
- npm publish (`npx cover-studio`) once the API settles.
- Agent-skill wrapper.

## Phases

### A. Setup, config, presets (45 min)
- [ ] package.json (type module), tsconfig strict, tsx, vitest, .gitignore (.cover-cache, covers, node_modules, dist)
- [ ] `src/config/schema.ts`: Zod schema for every field in docs/config.md, with defaults
- [ ] `src/config/load.ts`: load `.ts` config via tsx, merge `extends` preset, validate
- [ ] `presets/neutral-light.json`, `presets/neutral-dark.json`
- [ ] `src/cli.ts`: Commander with `init`, `validate`
- [ ] `examples/minimal.config.ts`, `examples/aequor.config.ts`
TEST: validate passes on both examples; `ground.type: "foo"` prints `ground.type` and the allowed values; `init` output validates.

### B. Capture (60 min)
- [ ] `src/capture/browser.ts`: launch Chromium (CHROME_PATH or bundled), deviceScaleFactor 2
- [ ] `src/capture/clock.ts`: install clock, pauseAt, advance helper
- [ ] `src/capture/capture.ts`: per page desktop 1440x900 and mobile 390x844, scroll positions, full page, element shots, hero photo
- [ ] reveal finishing: wait for `waitFor`, scroll through the page once, return to target, settle
- [ ] cache with `manifest.json`; `--fresh`
TEST: capture on Aequor writes all expected files at 2x; second run is a cache hit under 2 s.

### C. Look engine (60 min)
- [ ] `src/look/ground.ts`: solid, linear, radial, mesh, image, photo
- [ ] `src/look/pattern.ts`: grid, dots, lines, rings, contours, svg; colour, opacity, scale, angle, fade mask
- [ ] `src/look/frame.ts`: browser chrome (dots only), none; radius, shadow, theme
- [ ] `src/look/phone.ts`: plain bezel
- [ ] `src/look/branding.ts`: left and right logo slots, `onCover`
- [ ] `src/render/render.ts`: HTML to PNG at (w, h)
- [ ] `swatch` command
TEST: swatch renders a 4x3 sheet; no noise anywhere; pattern opacity is zero inside frame areas; branding absent by default.

### D. Patterns 1 (75 min)
- [ ] `src/patterns/types.ts`, `index.ts` registry
- [ ] full-bleed, lead-peek, photo-ground, strips (specs in docs/patterns.md)
- [ ] unit tests for strips coverage math and layout proportions
TEST: 4 patterns render for Aequor at 1600x1200 and 1600x900; strips tests pass.

### E. Patterns 2 (90 min)
- [ ] macro, page-phone, phone-trio, bento
- [ ] bento content guard: stat, colours and type names only from config
TEST: all 8 render at 3 sizes; bento without `bento.stat` skips the stat tile with a warning.

### F. Export and checks (45 min)
- [ ] `render --set`, naming, rounds and final
- [ ] contact sheet
- [ ] `check`: 400x300 thumbnail, 16:9 safe area report, cover text guard
TEST: set renders 12 files plus a contact sheet; check flags an off-centre focus.

### G. Motion loop and film (90 min)
- [ ] frame renderer on paused clock, eased scroll keyframes with holds
- [ ] compose frames into the pattern's frame and ground
- [ ] ffmpeg-static: H.264, CRF 18, preset veryfast, yuv420p, faststart
- [ ] loop (about 7 s) and full (about 32 s), optional end card
TEST: loop opens on a lit frame; holds show near-zero frame difference; performance.now moves 33 ms per frame.

### H. Docs and proof run (60 min)
- [ ] README, docs/getting-started.md
- [ ] Proof run on Aequor; contact sheet to `docs/gallery/`
- [ ] GitHub Actions: typecheck and test
TEST: fresh clone runs end to end from README steps; CI green.

## Pre-release checklist
- [ ] All 8 patterns at 3 sizes for one real site
- [ ] No text on covers unless allowed
- [ ] No noise or grain options exist
- [ ] No amber, gold or warm yellow-orange defaults
- [ ] No em dashes in docs, comments or output
- [ ] README gallery uses real outputs only
