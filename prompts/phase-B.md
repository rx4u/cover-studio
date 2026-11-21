# Phase B: Capture

Paste this into a fresh Claude Code session in the cover-studio repo.

```
Read CLAUDE.md, plan.md (Phase B), docs/patterns.md and docs/config.md before writing any code.

Project: cover-studio, an open-source CLI that turns a live website into presentation covers, sets and films. Generic, branding only when configured.

Starting state: Phases A are complete and their tests pass (see Current Status in CLAUDE.md).

Target state: Phase B (Capture) is complete:
B1. Playwright launcher honouring CHROME_PATH, 2x device scale
B2. Paused clock and reveal finishing (waitFor, finishReveals)
B3. Desktop 1440x900 and mobile 390x844 viewport captures per page and scroll position
B4. Full-page capture and element captures by selector; hero photo extraction
B5. Cache in .cover-cache/<name>/ with manifest.json; --fresh

Scope lock: only create or edit these paths: src/capture/*, src/cli.ts (capture command only), test/capture.test.ts. Do not touch other files. Do not add dependencies outside the stack in CLAUDE.md without asking.

Rules: follow every rule in CLAUDE.md. No em dashes anywhere. No noise or grain. No text on covers unless branding.onCover. Nothing invented.

Test (must pass before you stop): capture on the Aequor URL writes desktop, mobile, full-page, element and photo files at 2x; manifest lists them with sizes; second run uses the cache and finishes in under 2 s

Progress: after each task, print one line: "B<n> done: <what changed>".

Stop and ask me before: deleting files, changing the config schema shape from docs/config.md, adding a dependency, or if the test still fails after two fix attempts.

When the test passes: tick Phase B in CLAUDE.md Current Status, add anything that failed along the way to "What was tried and failed", commit with message "Phase B: Capture", and push.
```
