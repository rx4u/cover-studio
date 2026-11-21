# cover-studio quality plan (approved 21 Nov 2026)

All 18 patterns stay. Each is rebuilt to reference quality, one at a time, on existing open-source repos, through strict gates. Grounds and the phone frame come first because every pattern depends on them.

## Repos we build on

| Need | Repo | Licence | Use |
|---|---|---|---|
| Grounds | paper-design/shaders | Apache 2.0 | Mesh gradients, abstract render grounds, frozen as stills. Grain shaders stay off |
| Devices | react-mockframe | MIT | iPhone 17, iPhone 18 Pro, Pixel 10, Galaxy S25, iPad Pro, MacBook Pro in pure CSS |
| Browser frames | daveearley/screenshot.rocks | MIT | Browser chrome styles |
| Multi-screen layouts | btahir/shotcandy | MIT | Reference for multi-screen arrangements |
| 3D perspective | opennookorg/screenshot-studio | Apache 2.0 | Reference for tilt and perspective |
| Capture | Playwright | Apache 2.0 | Already in use |

Check each licence again before copying code. Credit every repo used in the README.

## Gates (every ground, frame and pattern; no skipping)

| Gate | What happens | Pass condition |
|---|---|---|
| G1 References | Pull 2 or 3 reference shots at full size into `.refs/<item>/` (local only, never committed) | Refs saved |
| G2 Spec | Measure the references: proportions, crop, ground, depth, angle, spacing. Write numbers into docs/patterns.md | Every layout number comes from a measurement |
| G3 Build | Build on the repos above; no hand-rolled replacement where a repo does it | Typecheck clean |
| G4 Quality gate | Render on 2 test sites (Aequor and a bold one). Side by side with the refs, score impact, composition, ground, depth, polish 1 to 5 | All 4 or higher. Max 3 fix rounds, then report failed, never done |
| G5 Review | One board per item: render next to refs, with scores | Raja approves, item is locked |

## Order
1. Grounds: atmospheric photo, brand gradient, mesh gradient, abstract render, dark tone
2. Device frames on react-mockframe (Apple bezels ruled out: their licence only covers mock-ups of Apple-only apps)
3. Patterns: full-bleed, lead-peek, photo-ground, phone-trio, page-phone, bento, strips, strips-brand, macro, breakout, ui-bento, cascade, floating, editorial, brand-split, overview-grid, before-after, tilt
4. Raja reviews in batches of 3

## Inputs
Each pattern states what it needs. Component patterns (macro, breakout, ui-bento) are tested only on sites with clean components.

## Effort
About 20 to 25 minutes of Claude time per pattern with gates, about 40 minutes for grounds and phone. About 2 minutes of Raja's time per board.

## Status
| Item | G1 | G2 | G3 | G4 | G5 |
|---|---|---|---|---|---|
| Grounds | done | done | done | done (all 6 score 4 on Aequor and Verda) | approved 21 Nov |
| Device frames | done | done | done (react-mockframe, status bar, home bar, real viewports, mixed models, MacBook, iPad, dark scheme) | done on Aequor, Verda pending | |
| full-bleed | | | | | |
| lead-peek | | | | | |
| photo-ground | | | | | |
| phone-trio | | | | | |
| page-phone | | | | | |
| bento | | | | | |
| strips | | | | | |
| strips-brand | | | | | |
| macro | | | | | |
| breakout | | | | | |
| ui-bento | | | | | |
| cascade | | | | | |
| floating | | | | | |
| editorial | | | | | |
| brand-split | | | | | |
| overview-grid | | | | | |
| before-after | | | | | |
| tilt | | | | | |
