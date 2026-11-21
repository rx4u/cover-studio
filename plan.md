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
| Device frames | done | done | done (react-mockframe, status bar, home bar, real viewports, mixed models, MacBook, iPad, dark scheme) | done (all variants score 4 on Aequor and Verda) | sent 21 Nov |
| full-bleed | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| lead-peek | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| photo-ground | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| phone-trio | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| page-phone | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| bento | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| strips | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| strips-brand | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| macro | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| breakout | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| ui-bento | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| cascade | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| floating | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| editorial | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| brand-split | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| overview-grid | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| before-after | done | done | done | done (4 on the gate sites) | sent 21 Nov |
| tilt | done | done | done | done (4 on the gate sites) | sent 21 Nov |

## Landing page (added 21 Nov 2026)
Lives in `site/` in this repo with its own package.json (Next.js); the CLI stays dependency-free. Deployed from the `site` folder to Vercel.
| Step | Work | Status |
|---|---|---|
| R1 | Product research, scope line | done 21 Nov |
| R2 | 15 to 20 live references, 1440px captures | done, 23 sites |
| R3 | Reference board, Raja picks 2 or 3 | screen.studio, godly.website, bun.sh |
| R4 | Design DNA spec per pick, one build spec | done (claude/cover-studio-site-locked-decisions.md) |
| 0 to 1 | Concept, colours, type, hero locked | concept "Plates" proposed |
| Canvas | Concept shown on the Design canvas, approved before code | sent 21 Nov, awaiting approval |
| Build | Next.js, only the hero animates, every cover shown is a real cover-studio output | |
| Q | 1440px side by side with the picks, every score 4 or more | |
| Ship | Live Vercel link in the README; Registry row SHIPPED with repo and site links, Content Log, portfolio.json | |
