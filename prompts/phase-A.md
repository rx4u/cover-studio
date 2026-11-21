# Phase A: Setup, config, presets

Paste this into a fresh Claude Code session in the cover-studio repo.

```
Read CLAUDE.md, plan.md (Phase A), docs/patterns.md and docs/config.md before writing any code.

Project: cover-studio, an open-source CLI that turns a live website into presentation covers, sets and films. Generic, branding only when configured.

Starting state: Empty repo except CLAUDE.md, plan.md, plan-tree.json, docs/, prompts/, LICENSE.

Target state: Phase A (Setup, config, presets) is complete:
A1. Init repo: package.json, tsconfig strict ESM, tsx, vitest, .gitignore
A2. Zod schema for the full config in docs/config.md with defaults
A3. Config loader for .ts files plus preset merge via extends
A4. Presets neutral-light and neutral-dark
A5. CLI skeleton with init and validate

Scope lock: only create or edit these paths: package.json, tsconfig.json, .gitignore, vitest.config.ts, src/cli.ts, src/config/*, presets/*, examples/*, test/config.test.ts. Do not touch other files. Do not add dependencies outside the stack in CLAUDE.md without asking.

Rules: follow every rule in CLAUDE.md. No em dashes anywhere. No noise or grain. No text on covers unless branding.onCover. Nothing invented.

Test (must pass before you stop): validate passes on examples/minimal.config.ts and examples/aequor.config.ts; a config with ground.type 'foo' prints the path ground.type and the allowed values; init writes a config that validates

Progress: after each task, print one line: "A<n> done: <what changed>".

Stop and ask me before: deleting files, changing the config schema shape from docs/config.md, adding a dependency, or if the test still fails after two fix attempts.

When the test passes: tick Phase A in CLAUDE.md Current Status, add anything that failed along the way to "What was tried and failed", commit with message "Phase A: Setup, config, presets", and push.
```
