# Phase F: Export and checks

Paste this into a fresh Claude Code session in the cover-studio repo.

```
Read CLAUDE.md, plan.md (Phase F), docs/patterns.md and docs/config.md before writing any code.

Project: cover-studio, an open-source CLI that turns a live website into presentation covers, sets and films. Generic, branding only when configured.

Starting state: Phases A, B, C, D, E are complete and their tests pass (see Current Status in CLAUDE.md).

Target state: Phase F (Export and checks) is complete:
F1. Set rendering: cover plus set list, file naming <name>-<i>-<pattern>-<w>x<h>.png
F2. Rounds: each render goes to rounds/<n>, approved copy to final/
F3. Contact sheet of the set
F4. check: 400x300 thumbnail export, 16:9 safe-area overlay report, cover has no text unless allowed

Scope lock: only create or edit these paths: src/export/*, src/cli.ts (render and check commands), test/export.test.ts. Do not touch other files. Do not add dependencies outside the stack in CLAUDE.md without asking.

Rules: follow every rule in CLAUDE.md. No em dashes anywhere. No noise or grain. No text on covers unless branding.onCover. Nothing invented.

Test (must pass before you stop): render --set writes 4 images x 3 sizes plus a contact sheet; check flags a deliberately off-centre focus in the 1600x900 output

Progress: after each task, print one line: "F<n> done: <what changed>".

Stop and ask me before: deleting files, changing the config schema shape from docs/config.md, adding a dependency, or if the test still fails after two fix attempts.

When the test passes: tick Phase F in CLAUDE.md Current Status, add anything that failed along the way to "What was tried and failed", commit with message "Phase F: Export and checks", and push.
```
