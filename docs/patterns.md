# Patterns

Every pattern renders on any canvas size. Numbers are proportions of the canvas width (W) and height (H) unless marked px. Specs come from studying about 300 popular Dribbble web, product and branding shots (Nov 2026) and from sets that were approved in real use.

V1 ships the first 8. The rest are listed so contributors can add them on the same engine.

## Global rules
- The cover (first image of a set) carries no text and no logo unless `branding.onCover` is true.
- The work is the largest thing in every image. Frames run off at least one edge.
- Every image uses the same ground, radius and margins within one set.
- Nothing is invented. Numbers, copy and photos come from the site or the config.
- Ground: flat neutral for photo-led pages; the configured gradient and pattern otherwise. Never the same colour as the page hero.

## V1

### full-bleed
The hero fills the canvas.
- Needs: desktop viewport capture of `pages[0]`.
- Layout: capture scaled to cover the canvas minus an inset of 0.025W on all sides, radius 16 px. Optional `inset: 0` for edge to edge.
- Focus: `focus` (x, y in 0..1) anchors the crop; default (0, 0).
- Check: hero headline readable at 400x300.

### lead-peek
A large lead page with the next page cropped at the right edge.
- Needs: viewport captures of two pages or two scroll positions.
- Lead frame: x 0.05W, y 0.07H, width 0.70W, runs off the bottom.
- Peek frame: x lead right + 0.02W, y 0.13H, same width, runs off the right edge.
- Frames: browser chrome by default.

### photo-ground
The page sits on its own hero photograph.
- Needs: viewport capture and the site's hero image (`source.photo` selector or URL).
- Ground: the photo, cover-fit, optional `dim` 0 to 0.3.
- Frame: width 0.68W, centred horizontally, top 0.16H, runs off the bottom. Soft shadow.

### strips
The whole page as tall columns.
- Needs: full-page capture.
- Columns: 3 (2 when the page has 8 sections or fewer, or `columns` set). Gap 0.025W, margin 0.045W.
- Stagger: column tops at 0.10H, then offsets so the columns together show the page once, no stretch twice.
- Chrome: none. Radius 12 px.

### macro
One component at poster scale.
- Needs: element capture by `source.elements[]` selector.
- Layout: element scaled 1.6x to 2.4x so it fills about 0.85 of the shorter side, bleeding off one edge (`bleed: right | bottom`).
- Frame: none. Radius 16 px.

### page-phone
The page in a browser frame with the same page on a phone overlapping its lower right.
- Needs: desktop and mobile (390 wide) captures of the same page at the same scroll.
- Browser: x 0.07W, y 0.10H, width 0.75W, runs off the bottom or ends 0.10H above it.
- Phone: right edge at 0.93W, top 0.29H, width 0.21W, overlapping the browser by 0.12W to 0.14W.
- One phone only. No tabs, pills or badges.

### phone-trio
Three phones, middle one raised.
- Needs: three mobile captures (pages or scroll positions).
- Phones: width 0.22W each, gap 0.03W, centred. Middle phone 6 percent larger and raised 0.05H.
- Use for mobile apps and responsive proof.

### bento
A grid of tiles from the brand and the product.
- Needs: brand inputs (logo, colours, type names) plus captures.
- Grid: 3 columns by 2 rows by default, one dominant tile (2 columns wide), gaps 12 px, radius 10 px.
- Tile types: `logo` (on accent with pattern), `hero-split`, `stat` (number from config over a photo), `ui` (element capture), `photo` (site image), `type-colour` (Aa specimen and four swatches with hex).
- Rule: every number and line comes from config or the site. Never invent.

## V2 (same engine)
- `cascade`: 3 or 4 pages layered diagonally.
- `floating`: several screens loosely placed on neutral.
- `breakout`: main screen with 2 or 3 real cards pushed past its edge.
- `ui-bento`: bento made only of product components.
- `brand-split`: brand pattern or type on one side, product on the other.
- `strips-brand`: strips on the brand colour.
- `editorial`: page fragments with large numerals and type.
- `overview-grid`: six screens in an even 3x2 grid, for case study openers.
- `before-after`: current site and new design, same section.
- `tilt`: one frame in 3D tilt (rotateY about 18deg, rotateX about 8deg).

## Out of scope
- Laptops, tablets, hands and photographed device scenes.
- Grain, noise, scanlines, light leaks, bubbles.
