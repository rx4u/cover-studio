# Phase H: Docs and proof run

Paste this into a fresh Claude Code session in the cover-studio repo.

```
Read CLAUDE.md, plan.md (Phase H), docs/patterns.md and docs/config.md before writing any code.

Project: cover-studio, an open-source CLI that turns a live website into presentation covers, sets and films. Generic, branding only when configured.

Starting state: Phases A, B, C, D, E, F, G are complete and their tests pass (see Current Status in CLAUDE.md).

Target state: Phase H (Docs and proof run) is complete:
H1. README: what it is, install, 5-minute start, pattern gallery, config link, MIT
H2. docs/getting-started.md and examples/
H3. Proof run on Aequor; commit the contact sheet to docs/gallery/
H4. GitHub Actions: typecheck and tests on push

Scope lock: only create or edit these paths: README.md, docs/getting-started.md, docs/gallery/*, examples/*, .github/workflows/ci.yml. Do not touch other files. Do not add dependencies outside the stack in CLAUDE.md without asking.

Rules: follow every rule in CLAUDE.md. No em dashes anywhere. No noise or grain. No text on covers unless branding.onCover. Nothing invented.

Test (must pass before you stop): a fresh clone runs npm i, npx playwright install chromium, and npm run dev -- render examples/aequor.config.ts --set end to end; README gallery shows real outputs; CI is green

Progress: after each task, print one line: "H<n> done: <what changed>".

Stop and ask me before: deleting files, changing the config schema shape from docs/config.md, adding a dependency, or if the test still fails after two fix attempts.

When the test passes: tick Phase H in CLAUDE.md Current Status, add anything that failed along the way to "What was tried and failed", commit with message "Phase H: Docs and proof run", and push.
```
