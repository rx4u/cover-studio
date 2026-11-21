import type { Pattern } from "./types.ts";
import { fullBleed } from "./full-bleed.ts";
import { leadPeek } from "./lead-peek.ts";
import { photoGround } from "./photo-ground.ts";
import { strips } from "./strips.ts";
import { stripsBrand } from "./strips-brand.ts";
import { macro } from "./macro.ts";
import { pagePhone } from "./page-phone.ts";
import { phoneTrio } from "./phone-trio.ts";
import { bento } from "./bento.ts";
import { cascade } from "./cascade.ts";
import { floating } from "./floating.ts";
import { breakout } from "./breakout.ts";
import { uiBento } from "./ui-bento.ts";
import { brandSplit } from "./brand-split.ts";
import { editorial } from "./editorial.ts";
import { overviewGrid } from "./overview-grid.ts";
import { beforeAfter } from "./before-after.ts";
import { tilt } from "./tilt.ts";

const all = [fullBleed, leadPeek, photoGround, strips, stripsBrand, macro, pagePhone, phoneTrio, bento, cascade, floating, breakout, uiBento, brandSplit, editorial, overviewGrid, beforeAfter, tilt];

export const PATTERNS: Record<string, Pattern> = Object.fromEntries(all.map((p) => [p.id, p]));
