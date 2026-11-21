# Phase E: Patterns 2

Paste this into a fresh Claude Code session in the cover-studio repo.

```
Read CLAUDE.md, plan.md (Phase E), docs/patterns.md and docs/config.md before writing any code.

Project: cover-studio, an open-source CLI that turns a live website into presentation covers, sets and films. Generic, branding only when configured.

Starting state: Phases A, B, C, D are complete and their tests pass (see Current Status in CLAUDE.md).

Target state: Phase E (Patterns 2) is complete:
E1. macro with bleed side
E2. page-phone
E3. phone-trio
E4. bento with six tile types and a no-invented-content check

Scope lock: only create or edit these paths: src/patterns/macro.ts, page-phone.ts, phone-trio.ts, bento.ts, src/patterns/index.ts (register only), test/patterns.test.ts. Do not touch other files. Do not add dependencies outside the stack in CLAUDE.md without asking.

Rules: follow every rule in CLAUDE.md. No em dashes anywhere. No noise or grain. No text on covers unless branding.onCover. Nothing invented.

Test (must pass before you stop): all 8 patterns render for Aequor at three sizes; bento refuses to render a stat tile without bento.stat in config; phone frames have no status bar or badges

Progress: after each task, print one line: "E<n> done: <what changed>".

Stop and ask me before: deleting files, changing the config schema shape from docs/config.md, adding a dependency, or if the test still fails after two fix attempts.

When the test passes: tick Phase E in CLAUDE.md Current Status, add anything that failed along the way to "What was tried and failed", commit with message "Phase E: Patterns 2", and push.
```
