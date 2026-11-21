# Phase D: Patterns 1

Paste this into a fresh Claude Code session in the cover-studio repo.

```
Read CLAUDE.md, plan.md (Phase D), docs/patterns.md and docs/config.md before writing any code.

Project: cover-studio, an open-source CLI that turns a live website into presentation covers, sets and films. Generic, branding only when configured.

Starting state: Phases A, B, C are complete and their tests pass (see Current Status in CLAUDE.md).

Target state: Phase D (Patterns 1) is complete:
D1. Pattern interface and registry
D2. full-bleed with focus anchor
D3. lead-peek
D4. photo-ground
D5. strips with stagger math covering the page once

Scope lock: only create or edit these paths: src/patterns/types.ts, src/patterns/index.ts, src/patterns/full-bleed.ts, lead-peek.ts, photo-ground.ts, strips.ts, test/patterns.test.ts. Do not touch other files. Do not add dependencies outside the stack in CLAUDE.md without asking.

Rules: follow every rule in CLAUDE.md. No em dashes anywhere. No noise or grain. No text on covers unless branding.onCover. Nothing invented.

Test (must pass before you stop): render each of the 4 patterns for Aequor at 1600x1200 and 1600x900; unit tests prove strips cover the full page height exactly once; no frame edge is cut mid headline at the default focus

Progress: after each task, print one line: "D<n> done: <what changed>".

Stop and ask me before: deleting files, changing the config schema shape from docs/config.md, adding a dependency, or if the test still fails after two fix attempts.

When the test passes: tick Phase D in CLAUDE.md Current Status, add anything that failed along the way to "What was tried and failed", commit with message "Phase D: Patterns 1", and push.
```
