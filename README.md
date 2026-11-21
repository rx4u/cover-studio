# cover-studio

Turn any live website into presentation-ready covers for Dribbble, Contra, X, portfolios, case studies and template listings. One config file, one command, every size.

- Captures the real pages at 2x (desktop and mobile), plus components and a full-page capture, with scroll reveals played through first.
- Composes them into 18 proven cover patterns, from simple hero crops to bentos, phone trios and before-after comparisons (table below).
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

## Patterns

| Pattern | What it shows | Needs |
|---|---|---|
| `full-bleed` | The hero filling the canvas | a page |
| `lead-peek` | Lead page with the next page cropped at the edge | two pages or scroll positions |
| `photo-ground` | The page on its own hero photo | `source.photo` |
| `strips` | The whole page as staggered columns | a page |
| `strips-brand` | Strips on the brand colour | a page |
| `macro` | One component at poster scale | `source.elements` |
| `page-phone` | Browser page with the phone version overlapping | `source.mobile` |
| `phone-trio` | Three phones, the middle one raised | `source.mobile` |
| `bento` | Hero tile plus logo, stat, components, colours | real brand inputs in `bento` |
| `cascade` | 3 or 4 pages layered diagonally | 3+ views |
| `floating` | Large centre screen with smaller screens around it | 3+ views |
| `breakout` | Page with real components pushed past its edge | `source.elements` |
| `ui-bento` | A grid of product components | 2+ `source.elements` |
| `brand-split` | Brand panel on the left, page on the right | a logo |
| `editorial` | Magazine layout, with your stat set large | 3+ views |
| `overview-grid` | Every view at a glance, for case study openers | 4+ views |
| `before-after` | Current site next to the new design | `source.before` |
| `tilt` | One page in a 3D tilt | a page |

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

Motion loops and films, a contact sheet, a live preview UI.

## Credits

- Grounds: [paper-design/shaders](https://github.com/paper-design/shaders), Apache 2.0.
- Device frames: [react-mockframe](https://github.com/mbdev3/react-mockframe) by Mohammed Banani, MIT. The CSS is vendored in `vendor/react-mockframe/` and its markup pre-rendered to `src/devices.generated.json`, so no React is needed.

## License

MIT
