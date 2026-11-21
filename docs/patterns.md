# Patterns

Every pattern renders on any canvas size. Numbers are proportions of the canvas width (W) and height (H) unless marked px. Specs come from studying about 300 popular Dribbble web, product and branding shots (Nov 2026) and from sets that were approved in real use.

All 18 patterns below are built. Each lists what it needs; a pattern missing its inputs is skipped with a message.

## Grounds (measured from references, gated 21 Nov 2026)

| Type | Reference | Spec |
|---|---|---|
| `photo` (atmospheric) | Phenomenon Aesthetica, VITA | Largest photo in the first screen (or the hero screenshot when there is none), blur 48 px at 1600 wide, brightness 0.5, saturate 1.15, darkening towards the bottom. Edge luminance 30 to 70 |
| `photo-clear` | Phenomenon Growly | Sharp photo from further down the page, so it never duplicates the hero |
| `brand-gradient` | Ramotion Borea | 155 deg: accent tint 35% to accent to accent shade 70% to near black |
| `dark` | Zajno | Flat accent shaded 80% (navy accent gives about #09161C) |
| `mesh` | Afterglow, Clearbit | paper-design static mesh: pastels of the accent hue (HSL, never tints towards grey) plus a neighbouring hue and white |
| `silk` | BL/S, Gleb Kuznetsov | paper-design mesh, distortion 1, swirl 0.85, wide tonal range; dark accents get lifted highlights |

3D objects in some references (Clearbit's fan, Gleb's glass blocks) are models and are not reproduced.

## Devices (measured from references, gated 21 Nov 2026)
References: Nixtio location app, Afterglow health app, Phenomenon ZeBeyond, Phenomenon Growly.

| Setting | Measure |
|---|---|
| Frames | react-mockframe (MIT): iPhone 17, iPhone 18 Pro, Pixel 10, Galaxy S25, iPad Pro, MacBook Pro |
| Finishes | iPhone 17: black, white, mist-blue, sage, lavender, deep-blue. iPhone 18 Pro: silver, glacier, black, burgundy. Pixel 10: obsidian, frost, indigo. Galaxy S25: icy-blue, silver-shadow, navy, mint, blue-black. iPad Pro and MacBook Pro: space-black, silver. No gold, orange, coral or yellow finishes |
| Auto finish | Dark grounds take the dark finish. Light grounds take the tinted finish closest to the accent hue (within 45 degrees), else the light finish |
| System UI | Each platform draws its own (src/system-ui.ts). iPhone: 62pt bar, 9:41 left, signal, wifi, battery right. iPad (wifi): 24pt bar, "9:41 Sat 21 Nov" left, wifi and battery right, no signal bars. Pixel and Galaxy: 36 to 40pt bar, 9:41 left, Material wifi, signal and upright battery right. MacBook: no status bar; a 37pt macOS menu bar with the app name and menus left, Control Centre, wifi, battery and "Sat 21 Nov 9:41" right, nothing under the notch |
| Screen | Phones and the iPad without a browser bar: the system bar sits on the page's sampled top colour and the page starts below it. Home indicator 134x5pt (iOS), 108x4pt (Android), 320x5pt (iPad), 8pt from the bottom. No Apple logo is drawn |
| Captures | Each model's real viewport: iPhone 402pt, Pixel 412pt, Galaxy 360pt, iPad 1032pt, height below the status bar. Dark scheme captured when `source.colorScheme` asks for it |
| Shadow | Contact 3/5px plus ambient 40/60px: .20/.26 black for dark finishes, .12/.16 cool grey for light and tinted ones, scaled to canvas |
| Trio, level | 0.78W for the group, gap 0.016W, centred, equal screen heights across mixed models (Afterglow) |
| Trio, raised | Middle phone 0.07H higher and in front, all three lean 6 degrees (Nixtio) |
| Page plus phone | Phone about 0.2W, bottom at 0.92H, overlapping the page device. Every page device runs off a canvas edge: browser 0.75W from 0.07W and iPad at least 0.55W from 0.07W, both off the bottom; MacBook up to 1.0W, a tenth of it off the left (ZeBeyond, Growly) |
| Browser bar | With frame.style "browser", MacBook and iPad screens carry a window bar in the browser frame's proportions (bar 0.033W, dots 0.0092W, gap 0.0067W, inset 0.015W; a third larger on the iPad), grey inactive-window dots, no address text, light or dark by frame.theme. MacBook: below the menu bar. iPad: the status bar takes the bar colour |
| Plain grounds | solid (#E4E4E2 light, #0E0F0F dark, or any stop) and tint (a flat, very light tint of the accent). No pattern layer by default |
| Frameless | Screen only, radius 0.155 of its width, hairline rim |
| Corners | Every system bar takes its left and right inset from the screen's corner radius (iPhone 63.5pt, Pixel 50pt, Galaxy 36pt, iPad 29pt, MacBook 18.7pt) plus a comfort margin of 12pt or a quarter of the radius, so content keeps clear of the curve, not just outside it. Bar heights: iPhone 62pt, Pixel 48pt, Galaxy 42pt, iPad 32pt, MacBook 37pt. `npm run check:corners` renders every device and fails if any text or icon is closer to a corner than that margin |
| Fit | Phones stay whole on every size; page devices bleed as above |

## Capture
- The site's own photographs (natural width 800 px or more, distinct, largest first, up to 8) are saved for photo tiles.
- Tall and full-page captures are stitched from real screens: the page is scrolled one screen at a time, each screen's reveals play, then the screens are joined. Pinned sections (GSAP pin spacers, large sticky sections) are laid out in normal flow first, fixed bars show on the first screen only, and blank screens (scroll spacers) are dropped.

## Global rules
- No dead space: in every pattern the subject group spans the canvas. An empty quarter of ground is a failed gate.
- The cover (first image of a set) carries no text and no logo unless `branding.onCover` is true.
- The work is the largest thing in every image. Frames run off at least one edge.
- Every image uses the same ground, radius and margins within one set.
- Nothing is invented. Numbers, copy and photos come from the site or the config.
- Ground: flat neutral for photo-led pages; the configured gradient and pattern otherwise. Never the same colour as the page hero.

## V1

### full-bleed
The page large on the canvas. Measured from Roobinium (Sentry), Nixtio (TRQ) and Skatenerd on Dribbble, gated 21 Nov 2026.
- Needs: the tall desktop capture of `pages[0]`.
- Whole (default): x 0.055W, 0.89W wide, from 0.07H to 0.92H at most, capped at the first screen plus 5% and centred vertically, so pinned scroll space below a hero never shows as an empty band; the tall capture cropped from the top, `focus` moves it.
- `layout.bleed: "bottom"`: x 0.035W, y 0.047H, 0.93W wide, running off the bottom edge.
- No browser chrome. Radius 10, lifted shadow. The ground shows on every side that does not bleed.

### lead-peek
One long page read as two columns. Measured from Apollo and Norde on Dribbble, gated 21 Nov 2026.
- Needs: the full-page desktop capture and the section starts recorded at capture.
- Lead column: x 0.035W, y 0.047H, 0.553W wide, running off the bottom, the top of the page.
- Peek column: from 0.613W (gap 0.025W), same width, running off the top and the right. It opens on the first section that starts after what the lead column shows, with that section's top 0.05H below the canvas edge, so no line is cut and nothing repeats.
- No browser chrome. Radius 10 on visible corners, soft shadow.

### photo-ground
The page on its own hero photograph. Measured from Atelier Aesthetica on Dribbble, gated 21 Nov 2026.
- Needs: the tall desktop capture and the hero photo (`source.photo`, else the largest image in the first screens).
- Ground: the photo ground (blurred, dimmed, darker at the bottom).
- Page: x 0.05W, 0.9W wide, centred vertically with 0.127H above and below; the tall capture cropped from the top.
- No browser chrome. Radius 10, lifted shadow.

### strips
The whole page as tall columns. Measured from the Oliver Hayes three-strip cover and Cuberto's brand-ground strips, gated 21 Nov 2026.
- Needs: the full-page capture (stitched screen by screen, see Capture) and the section starts.
- Margins 0.044W, gaps 0.025W, radius 16, soft shadow, no browser chrome.
- First column from 0.10H with the top of the page, running off the bottom. Last column running off the top, ending at 0.80H on the page's own footer. Middle column running off the top, ending at 0.9875H, opened on the section start nearest to where the last column begins. Together they read top, middle, end.
- Pages too short for three columns without repeats get two (or one).
- `strips-brand` is the same on the brand ground.

### macro
One real component at poster scale. Gated 21 Nov 2026.
- Needs: a component capture (`source.elements`), taken with 32 CSS px of the page's own surface around it and with fixed layers that do not hold it hidden.
- Never cropped: scaled to at most 0.84W by 0.76H and at most 2.4x its page size, centred, radius 16, soft shadow. `layout.bleed` does not apply.

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
A mosaic of whole tiles. Measured from Clyra, Raya Reserve and a dark product bento on Dribbble, cleaned up 21 Nov 2026.
- Margins 0.05W by 0.06H, gaps 0.014W, radius 14, no shadows. 4 columns by 3 rows on every canvas.
- Desktop hero over 3 columns and 2 rows, the tall capture fitted to width.
- 4th column, 2 rows: the phone screen of a later section (not the hero again).
- Four small tiles, whole things only, never page fragments: the site's own photographs (captured at capture, largest first, the hero's own photo skipped when there are enough), one real component on its own surface when its shape suits the tile, then brand tiles from config. Fewer inputs: the remaining tiles span the row.

### breakout
The page with its own components pulled forward. Measured from HALO LAB, Outcrowd and Phenomenon on Raja's reference board, gated 21 Nov 2026.
- Page at 0.2W, from 0.08H, 0.7W wide, running off the bottom.
- First component over the page's right edge: right side at 0.96W, up to 0.3W wide, centred near 0.56H, never above 0.4H.
- Second component at the left: up to 0.22W wide, right edge at 0.25W so it overlaps only the page's margin, bottom at 0.9H.
- Components whole, on their own surface, up to 2x page size, with a deeper shadow than the page. Neither covers the headline or its buttons.

### ui-bento
A bento made only of real components, every tile exactly its component. Measured from Outcrowd and Ramotion, cleaned up 21 Nov 2026.
- Gaps 0.014W, radius 16, no shadows, margins at least 0.05W by 0.06H.
- Each tile is the component capture whole, with 32 px of its own page surface, so no tile holds empty space.
- Justified rows: every split of the components into up to three rows is tried, each row scaled so its tiles fill the width, and the split that best fills the canvas without passing 2x page size wins. The block is centred.

### cascade
Three pages layered diagonally, back to front. Measured from Zajno on Raja's reference board, gated 21 Nov 2026.
- Pages about 0.5W wide, steps of 0.13W right and 0.11H down, the group centred and fitted inside 0.88W by 0.86H. Front page lifted shadow, others soft.
- Views are three distinct parts of the stitched page: the top, then the section starts nearest a third and two thirds down. Section starts are recorded in the stitched image's own coordinates.

### floating
Two screens floating as one group. Measured from Zajno's Skymetrics shot, fixed for dead space 21 Nov 2026.
- Front: the phone screen of a later section, whole in its own shape (below the sticky header), 0.84H tall, right edge at 0.945W, lifted shadow. Without mobile captures, a second desktop view from a section start.
- Back: the desktop first screen, never cropped, tucked 0.1W under the front. It reaches from 0.05W, or grows to at least 0.62H tall and runs off the left edge when the canvas is tall (4:3), up to 0.8H. Soft shadow.
- No browser chrome, radius 12. The group fills the canvas: no empty quarter.

### editorial
The page cut like a magazine spread. Measured from One Week Wonders (Guraisu, Madefact), gated 21 Nov 2026.
- Margins 0.03W, gaps 0.012W, radius 8, no shadows or chrome.
- Lead: the top of the page, 0.565W wide from 0.03H, running off the bottom.
- Right: two different sections stacked, running off the right edge, 1.25x the lead's scale so their own type reads large; the upper runs off the top and ends at 0.4H, the lower fills to the bottom. Each opens 24 CSS px above its section start. No type is added.

### brand-split
The product beside its brand. Measured from Moyra's BartKolenda case study and Orbyta, gated 21 Nov 2026.
- Margins 0.045W by 0.08H, gaps 0.01W, radius 14, no shadows.
- Left, 0.46 of the width: the desktop page. Right top, half the height: the site's own logo (`source.logo`, captured transparent) on its own header colour, or `bento.logo` on the accent, at 0.4 of the panel width. Right bottom: a site photograph and the phone screen of a later section.

## Further patterns
- `strips-brand`: strips on the brand colour.

## overview-grid
The whole site at a glance. Measured from the EKON Studio cover, gated 21 Nov 2026.
- Three staggered rows that bleed off every edge. The middle tile of the middle row is the first screen, 0.52W wide at 16:10, centred.
- Gaps 0.016W, radius 10. Tile edges per row (fractions of W): top -0.25, 0.355, 0.371, 0.847, 0.863, 1.25; middle -0.1, 0.238, 0.254, 0.774, 0.79, 1.2; bottom -0.2, 0.09, 0.106, 0.597, 0.613, 1.2.
- Every other tile is a distinct section of the stitched page (starts at least 540 px apart), opened 24 px above the section start and clamped to the page end, then the site's own photographs. Nothing repeats.

## tilt
The overview-grid mosaic turned in plane. Measured from the KORDA Studio cover and Gleb Kuznetsov's laid-down screens, gated 21 Nov 2026.
- Rotated `layout.tilt` degrees counter-clockwise (default 7), leaning back 8 degrees with perspective 3200, scaled 1.18 so no corner shows the ground.

## before-after
The current site and the new design, side by side, the same part of each.
- `source.before` is stitched like the tall capture. Two matching frames, 0.445W each, a 0.03W gap, centred, from 0.08H and running off the bottom, both from the top of the page.

## Out of scope
- Laptops, tablets, hands and photographed device scenes.
- Grain, noise, scanlines, light leaks, bubbles.
