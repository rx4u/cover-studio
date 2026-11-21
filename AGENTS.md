# Using cover-studio with an AI agent

Read this before making covers or mockups with cover-studio. It works the same in Claude Code, Codex, Cursor, ChatGPT or any agent that can run a shell.

## What it does

cover-studio captures a live web design (desktop, phones, components) and renders presentation covers in 18 tested patterns, at 1600x1200, 1600x900 and 1200x630. No AI calls, no tokens, no cost. A render takes about a second per cover; a capture takes one to three minutes.

## Setup (once)

```bash
git clone https://github.com/rx4u/cover-studio
cd cover-studio
npm install
# Chrome: use the system Chrome via CHROME_PATH, or run: npx playwright install chromium
```

## Make a post pack

1. Write a config next to the repo, for example `covers.config.ts`:

```ts
export default {
  name: "my-project",
  source: { url: "https://my-project.vercel.app", pages: ["/"], scrollPositions: [0], mobile: true },
  phone: { mix: true },
  ground: { type: "tint", accent: "#2F43F5" },   // the site's main colour
  patterns: ["page-phone", "bento", "floating", "phone-trio", "tilt", "editorial"],
  export: { sizes: ["1600x1200", "1600x900"] },
};
```

2. Run:

```bash
npm run cover -- capture covers.config.ts    # 1 to 3 minutes, cached in .cover-cache/<name>/
npm run cover -- render covers.config.ts     # seconds, writes covers/<name>/
```

3. Pick the cover. The first pattern in the list is the cover. The full-page capture is at `.cover-cache/<name>/p0-full.png`.

Re-render as often as you like; only pass `--fresh` when the site changed.

## Choosing patterns

| Need | Patterns |
|---|---|
| Post cover with desktop and phone | page-phone, floating |
| Several sections in one image | bento, overview-grid, tilt, cascade |
| Mobile app or mobile-first site | phone-trio, page-phone |
| Editorial or brand-led page | editorial, brand-split, lead-peek |
| A single component up close | macro, breakout, ui-bento |
| Redesign posts | before-after (set `source.before` to the old URL) |
| Full-bleed hero | full-bleed, photo-ground, strips |

Full specs: `docs/patterns.md`. Every config key: `docs/config.md`.

## Grounds

`solid`, `dark`, `tint` (derived from `accent`), `linear`, `radial`, `brand-gradient`, `mesh`, `silk`, `photo`, `photo-clear`, `image`. Photo-led sites read best on `solid` or `tint`; bold-colour sites on `tint`.

## Rules to keep

- Covers carry no text or logo unless `branding.onCover` is true.
- Every pixel of product comes from a real capture. Do not paint or invent UI.
- Outputs are fixed canvases. Never crop through a headline; set `focus` to move the crop.
- Pass the site's own colour as `accent` rather than inventing one.

## When something looks wrong

- Blank sections: the site reveals content on scroll. Capture again with `--fresh`; captures scroll every section first.
- Wrong phone screens: add `scrollPositions` for the sections you want.
- Empty space in a pattern: try a pattern from the same row in the table above.
