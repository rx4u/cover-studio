# Config reference (V1)

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
    finishReveals: true                // scroll once so reveals reach their end state
  },

  patterns: ["full-bleed", "lead-peek", "photo-ground"],
  focus: { x: 0, y: 0 },               // crop anchor for full-bleed, 0..1

  ground: {
    type: "solid",                     // solid | linear | radial | image | photo
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
    theme: "light",                    // light | dark bar
    radius: 16,
    shadow: "soft"                     // none | soft | lifted
  },

  branding: {
    enabled: false,
    left: null,                        // { logo: "./logo.svg", height: 40 }
    right: null,                       // { logo: "./studio.svg", height: 30 }
    onCover: false                     // keep the cover clean
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
