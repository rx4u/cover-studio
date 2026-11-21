# Config reference

A project is one `cover.config.ts`. Everything has a default; the minimum is `source.url`.

```ts
import { defineConfig } from "cover-studio";

export default defineConfig({
  name: "aequor",
  extends: "neutral-light",            // preset from presets/ or a path

  source: {
    url: "https://aequor-estate.vercel.app",
    pages: ["/", "/house"],            // first page is the hero page
    mobile: true,                      // also capture at 390 wide
    scrollPositions: [0, 900],         // extra viewport captures per page (px)
    elements: [".plot-card"],          // selectors for macro and bento ui tiles
    photo: ".hero img",                // selector or URL for photo-ground and bento
    waitFor: "window.__ready === true",// optional readiness expression
    finishReveals: true                // force scroll-driven reveals to their end state
  },

  cover: "lead-peek",                  // pattern id for image 1
  set: ["lead-peek", "macro", "strips", "page-phone"],
  focus: { x: 0, y: 0 },               // crop anchor for full-bleed

  ground: {
    type: "radial",                    // solid | linear | radial | mesh | image | photo
    stops: ["#0E2A2C", "#040B0C"],
    angle: 135,                        // linear only
    origin: "top-right",               // radial only
    points: [],                        // mesh only: [{x, y, color}]
    image: null,                       // image only: path
    dim: 0                             // photo/image only: 0 to 0.3
  },

  pattern: {
    type: "contours",                  // none | grid | dots | lines | rings | contours | svg
    svg: null,                         // path to your own SVG when type is svg
    color: "#D6EEEE",
    opacity: 0.12,
    scale: 1,
    fade: "top-right",                 // where the pattern lives; it fades before the frames
    angle: 0
  },

  frame: {
    style: "browser",                  // browser | none
    theme: "light",                    // light | dark bar
    radius: 16,
    shadow: "soft"                     // none | soft | lifted
  },

  phone: { bezel: "#111111", radius: 64 },

  branding: {
    enabled: false,
    left: null,                        // { logo: "./logo.svg", height: 40 }
    right: null,                       // { logo: "./studio.svg", height: 30 }
    onCover: false                     // keep the cover clean
  },

  bento: {
    tiles: ["logo", "hero-split", "stat", "ui", "photo", "type-colour"],
    stat: { value: "40 ac", label: "of headland" },  // only real figures
    colours: [{ name: "Laterite", hex: "#8A4B38" }],
    typeNames: ["Zodiak", "Switzer"]
  },

  export: {
    sizes: ["1600x1200", "1600x900", "1200x630"],
    format: "png",
    contactSheet: true
  },

  film: {
    fps: 30,
    loop: { seconds: 7 },
    full: { seconds: 32, pages: ["/", "/house"] },
    endCard: false                     // uses branding.left if true
  }
});
```

## Presets
JSON files in `presets/` with any subset of the fields above. `extends` merges a preset under the project config. Ship with `neutral-light` and `neutral-dark`. Users add their own, for example a studio look with branding on.

## Validation
`cover-studio validate` prints every error with its path and the allowed values. Unknown keys are errors.
