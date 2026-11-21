# Phase C: Look engine

Paste this into a fresh Claude Code session in the cover-studio repo.

```
Read CLAUDE.md, plan.md (Phase C), docs/patterns.md and docs/config.md before writing any code.

Project: cover-studio, an open-source CLI that turns a live website into presentation covers, sets and films. Generic, branding only when configured.

Starting state: Phases A, B are complete and their tests pass (see Current Status in CLAUDE.md).

Target state: Phase C (Look engine) is complete:
C1. Ground renderers: solid, linear, radial, mesh, image, photo
C2. Pattern generators: grid, dots, lines, rings, contours, custom svg, with colour, opacity, scale, angle and fade mask
C3. Frame and browser chrome, phone frame
C4. Branding slots, off by default, never on the cover unless onCover
C5. Renderer: HTML string to PNG at any (w, h); swatch command

Scope lock: only create or edit these paths: src/look/*, src/render/*, src/cli.ts (swatch command only), test/look.test.ts. Do not touch other files. Do not add dependencies outside the stack in CLAUDE.md without asking.

Rules: follow every rule in CLAUDE.md. No em dashes anywhere. No noise or grain. No text on covers unless branding.onCover. Nothing invented.

Test (must pass before you stop): swatch renders a 4x3 sheet of ground and pattern combinations at 1600x1200 with no noise; branding absent unless enabled; pattern fades to zero before the frame area

Progress: after each task, print one line: "C<n> done: <what changed>".

Stop and ask me before: deleting files, changing the config schema shape from docs/config.md, adding a dependency, or if the test still fails after two fix attempts.

When the test passes: tick Phase C in CLAUDE.md Current Status, add anything that failed along the way to "What was tried and failed", commit with message "Phase C: Look engine", and push.
```
