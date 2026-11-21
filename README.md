# cover-studio

Turn any live website into presentation-ready covers for Dribbble, Contra, X, portfolios, case studies and template listings. One config file, one command, every size.

- Captures the real pages at 2x, with scroll reveals played through first.
- Composes them into proven cover patterns: **full-bleed** hero, **lead-peek** (lead page plus the next page cropped at the edge) and **photo-ground** (the page on its own hero photo).
- Every look is configurable: ground (solid, linear, radial, image, photo), pattern (grid, dots, lines, rings, your own SVG), frame and shadow.
- Exports 1600x1200 (Dribbble, Contra), 1600x900 (X) and 1200x630 (link previews). Each size is laid out again, not cropped.
- Generic. Branding is off by default; turn it on per render, and the cover stays clean unless you say otherwise.

## Quick start

Needs Node 20+ and Chrome (or run `npx playwright install chromium`).

```bash
git clone https://github.com/rx4u/cover-studio && cd cover-studio && npm install
npx tsx src/cover.ts init my-site          # writes cover.config.ts
# edit cover.config.ts: set source.url and source.pages
npx tsx src/cover.ts render cover.config.ts
```

Output lands in `covers/<name>/` as `<name>-<n>-<pattern>-<size>.png`. Captures are cached in `.cover-cache/`; pass `--fresh` to recapture.

## Commands

| Command | What it does |
|---|---|
| `init [name]` | Write a starter `cover.config.ts` |
| `validate <config>` | Check a config and print every resolved value |
| `capture <config> [--fresh]` | Capture the site into the cache |
| `render <config> [--pattern <id>] [--fresh]` | Capture if needed, then render |

## Config

```ts
export default {
  name: "my-site",
  extends: "neutral-light",                     // or neutral-dark, or your own preset
  source: { url: "https://example.com", pages: ["/", "/about"], scrollPositions: [0], photo: ".hero img" },
  patterns: ["lead-peek", "full-bleed", "photo-ground"],   // the first one is the cover
  ground: { type: "radial", stops: ["#2F5D62", "#0B1A1C"], origin: "top-right" },
  pattern: { type: "rings", color: "#D6EEEE", opacity: 0.15, fade: "top-right" },
  branding: { enabled: true, left: { logo: "./logo.svg" }, right: { logo: "./studio.svg" } },
};
```

Full reference: [docs/config.md](docs/config.md). Pattern specs, including the ones planned next: [docs/patterns.md](docs/patterns.md).

## Presets

A preset is a JSON file with any part of the config. Put one in `presets/` or next to your config and point `extends` at it. Use presets to keep one look per brand or per portfolio.

## Known limits

- Scroll-driven text fills below the first screen can appear half filled in the tall captures.
- Pages that need a login, or block headless browsers, will not capture.

## Roadmap

Mobile captures and phone patterns, full-page strips, macro UI crop, bento, motion loops and films, a live preview UI.

## License

MIT
