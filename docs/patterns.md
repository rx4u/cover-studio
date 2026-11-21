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
- Tall and full-page captures are stitched from real screens: the page is scrolled one screen at a time, each screen's reveals play, then the screens are joined. Pinned sections (GSAP pin spacers, large sticky sections) are laid out in normal flow first, fixed bars show on the first screen only, and blank screens (scroll spacers) are dropped.

## Global rules
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
A mosaic of real tiles. Measured from Clyra, Raya Reserve and a dark product bento on Dribbble, gated 21 Nov 2026.
- Margins 0.05W by 0.06H, gaps 0.014W, radius 14, no shadows. 4 columns by 3 rows.
- The desktop hero over 3 columns and 2 rows, the tall capture fitted to the tile's width so the page is never cut at the sides.
- A phone screen down the 4th column: 2 rows on 4:3, all 3 on wide canvases.
- Small tiles along the bottom (four on 4:3, three on wide), in order, only from real inputs: components (`source.elements`), the hero photo, phone screens captured at their sections, other pages' phone screens, the brand logo, `bento.stat`, `bento.colours`, more desktop screens.
- Phone section shots are captured by scrolling each section to just below any sticky header (recorded at capture), skipping sections closer than 0.6 of a screen to the last, so every tile opens on its own heading and none repeat.
- Never an empty tile: with fewer inputs than slots, the remaining tiles span the gap.

## Further patterns
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
