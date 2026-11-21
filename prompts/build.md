# Build prompt (V1)

Paste this into a fresh Claude Code session in the cover-studio repo.

```
Read CLAUDE.md, plan.md, docs/patterns.md (V1 section only) and docs/config.md before writing any code.

Project: cover-studio, a small open-source CLI that captures a live website and renders presentation covers in 3 patterns (full-bleed, lead-peek, photo-ground) at 1600x1200, 1600x900 and 1200x630. Generic: branding only when configured.

Starting state: the repo has CLAUDE.md, plan.md, docs/, prompts/, README.md, LICENSE. No code.

Target state: plan.md steps 1 to 4 done and their tests pass.

Scope lock: only create or edit package.json, tsconfig.json, .gitignore, src/**, presets/**, examples/**, README.md, and the Current Status section of CLAUDE.md. Dependencies: playwright, zod, tsx, typescript only.

Rules: follow every rule in CLAUDE.md. Keep it small; do not add mobile, phones, film, strips, bento or a CLI framework. No em dashes anywhere. No noise or grain. No text on covers unless branding.onCover. Nothing invented.

Progress: after each step print one line: "Step <n> done: <what changed>".

Stop and ask me before: adding any dependency, changing the config shape in docs/config.md, or if a test still fails after two fix attempts.

When all tests pass: tick Current Status in CLAUDE.md, commit "V1: capture and 3 cover patterns", push, and tell me the exact command to run it on my own site.
```
