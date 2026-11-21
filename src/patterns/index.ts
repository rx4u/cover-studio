import type { Pattern } from "./types.ts";
import { fullBleed } from "./full-bleed.ts";
import { leadPeek } from "./lead-peek.ts";
import { photoGround } from "./photo-ground.ts";

export const PATTERNS: Record<string, Pattern> = {
  [fullBleed.id]: fullBleed,
  [leadPeek.id]: leadPeek,
  [photoGround.id]: photoGround,
};
