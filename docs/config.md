# Config reference

A project is one `cover.config.ts`. Everything has a default; the minimum is `source.url`.

```ts
export default {
  name: "my-site",
  extends: "neutral-light",            // preset from presets/ or a path

  source: {
    url: "https://example.com",
    pages: ["/", "/about"],            // first page is the hero page
    scrollPositions: [0, 900],         // extra viewport captures per page (px)
    photo: ".hero img",                // selector or URL for photo-ground
    waitFor: null,                     // optional readiness expression
    finishReveals: true,               // scroll once so reveals reach their end state
    colorScheme: "light",              // light | dark | both; dark grounds use dark captures when there are any
    mobile: true,                      // also capture at 390 wide (page-phone, phone-trio)
    elements: [".pricing-card"],       // component selectors (macro, breakout, ui-bento, bento)
    before: null                       // current site URL, for before-after
  },

  patterns: ["full-bleed", "lead-peek", "photo-ground"],   // any of the 18 ids below; the first is the cover
  focus: { x: 0, y: 0 },               // crop anchor for full-bleed, 0..1

  ground: {
    type: "solid",                     // solid | linear | radial | image | photo | photo-clear | brand-gradient | dark | mesh | silk
    accent: null,                      // brand colour for derived grounds (falls back to bento.accent, then stops[0])
    blur: 48,                          // photo: blur at 1600 wide
    brightness: 0.5,                   // photo: 0.1 to 1
    seed: 1,                           // mesh and silk: change for a different arrangement
    stops: ["#E4E4E2"],                // one colour for solid, two or more for gradients
    angle: 135,                        // linear only
    origin: "top-right",               // radial only
    image: null,                       // image only: path
    dim: 0                             // image and photo only: 0 to 0.3
  },

  pattern: {
    type: "none",                      // none | grid | dots | lines | rings | svg
    svg: null,                         // path to your own SVG when type is svg
    color: "#000000",
    opacity: 0.08,
    scale: 1,
    angle: 0,
    fade: "top-right"                  // where the pattern lives; it fades before the frames
  },

  frame: {
    style: "browser",                  // browser | none
    device: "browser",                 // browser | macbook-pro | ipad-pro (page-phone)
    colour: "auto",                    // finish for the MacBook or iPad
    theme: "light",                    // light | dark bar
    radius: 16,
    shadow: "soft"                     // none | soft | lifted
  },

  phone: {
    style: "device",                   // device (a real phone frame) | frameless (screen only)
    model: "iphone-17",                // iphone-17 | iphone-18-pro | pixel-10 | galaxy-s25
    colour: "auto",                    // auto (follows the ground) or a finish of the model, see docs/patterns.md
    mix: false,                        // phone-trio: main model in the middle, mixWith on the sides
    mixWith: ["pixel-10", "iphone-18-pro"],
    statusBar: true,                   // 9:41 status bar in the page's own top colour
    trio: "raised"                     // raised (middle phone up, leaning) | level
  },

  branding: {
    enabled: false,
    left: null,                        // { logo: "./logo.svg", height: 40 }
    right: null,                       // { logo: "./studio.svg", height: 30 }
    onCover: false                     // keep the cover clean
  },

  layout: {
    columns: 3,                        // strips and strips-brand: 2 to 4
    bleed: "right",                    // macro: right | bottom
    tilt: 18                           // tilt: degrees, 0 to 35
  },

  bento: {
    logo: null,                        // logo for bento, brand-split (falls back to branding.left)
    accent: null,                      // brand colour for logo, stat and strips-brand tiles
    stat: null,                        // { value: "40 ac", label: "of headland" }; real figures only
    colours: []                        // [{ name: "Sea", hex: "#2F5D62" }], up to 6
  },

  export: {
    sizes: ["1600x1200", "1600x900", "1200x630"]
  }
};
```

## Presets
JSON files in `presets/` with any subset of the fields above. `extends` merges a preset under the project config. Ships with `neutral-light` and `neutral-dark`. Add your own, for example a studio look with branding on.

## Validation
Errors print the field path and the allowed values. Unknown keys are errors.

## Pattern ids
full-bleed, lead-peek, photo-ground, strips, strips-brand, macro, page-phone, phone-trio, bento, cascade, floating, breakout, ui-bento, brand-split, editorial, overview-grid, before-after, tilt.

A pattern that is missing its inputs is skipped with a message saying what to add (for example, macro without `source.elements`).
