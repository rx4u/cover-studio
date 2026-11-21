# Phase G: Motion loop and film

Paste this into a fresh Claude Code session in the cover-studio repo.

```
Read CLAUDE.md, plan.md (Phase G), docs/patterns.md and docs/config.md before writing any code.

Project: cover-studio, an open-source CLI that turns a live website into presentation covers, sets and films. Generic, branding only when configured.

Starting state: Phases A, B, C, D, E, F are complete and their tests pass (see Current Status in CLAUDE.md).

Target state: Phase G (Motion loop and film) is complete:
G1. Frame renderer on a paused clock, exactly 1000/fps per frame
G2. Eased scroll keyframes with holds per section
G3. Compose each frame into the chosen pattern frame and ground
G4. ffmpeg-static encode H.264 CRF 18, veryfast; loop and full cuts; optional end card

Scope lock: only create or edit these paths: src/film/*, src/cli.ts (film command only), test/film.test.ts. Do not touch other files. Do not add dependencies outside the stack in CLAUDE.md without asking.

Rules: follow every rule in CLAUDE.md. No em dashes anywhere. No noise or grain. No text on covers unless branding.onCover. Nothing invented.

Test (must pass before you stop): film --loop makes a 7 s 1600x1200 MP4 that opens on a lit frame; frame difference during holds is near zero; performance.now advances 33 ms per frame at 30 fps

Progress: after each task, print one line: "G<n> done: <what changed>".

Stop and ask me before: deleting files, changing the config schema shape from docs/config.md, adding a dependency, or if the test still fails after two fix attempts.

When the test passes: tick Phase G in CLAUDE.md Current Status, add anything that failed along the way to "What was tried and failed", commit with message "Phase G: Motion loop and film", and push.
```
