import { z } from "zod";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const hex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "must be a hex colour like #E4E4E2");
const size = z.string().regex(/^\d+x\d+$/, "must look like 1600x1200");
const logo = z.object({ logo: z.string(), height: z.number().positive().default(36) }).strict();

export const PATTERN_IDS = ["full-bleed", "lead-peek", "photo-ground"] as const;

export const schema = z
  .object({
    name: z.string().regex(/^[a-z0-9-]+$/, "use lowercase letters, numbers and hyphens").default("site"),
    extends: z.string().optional(),
    source: z
      .object({
        url: z.string().url(),
        pages: z.array(z.string()).min(1).default(["/"]),
        scrollPositions: z.array(z.number().int().min(0)).min(1).default([0]),
        photo: z.string().nullable().default(null),
        waitFor: z.string().nullable().default(null),
        finishReveals: z.boolean().default(true),
      })
      .strict(),
    patterns: z.array(z.enum(PATTERN_IDS)).min(1).default([...PATTERN_IDS]),
    focus: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).strict().default({ x: 0, y: 0 }),
    ground: z
      .object({
        type: z.enum(["solid", "linear", "radial", "image", "photo"]).default("solid"),
        stops: z.array(hex).min(1).default(["#E4E4E2"]),
        angle: z.number().default(135),
        origin: z.enum(["top-left", "top-right", "bottom-left", "bottom-right", "center"]).default("top-right"),
        image: z.string().nullable().default(null),
        dim: z.number().min(0).max(0.3).default(0),
      })
      .strict()
      .default({}),
    pattern: z
      .object({
        type: z.enum(["none", "grid", "dots", "lines", "rings", "svg"]).default("none"),
        svg: z.string().nullable().default(null),
        color: hex.default("#000000"),
        opacity: z.number().min(0).max(1).default(0.08),
        scale: z.number().positive().default(1),
        angle: z.number().default(0),
        fade: z.enum(["top-left", "top-right", "bottom-left", "bottom-right", "center", "none"]).default("top-right"),
      })
      .strict()
      .default({}),
    frame: z
      .object({
        style: z.enum(["browser", "none"]).default("browser"),
        theme: z.enum(["light", "dark"]).default("light"),
        radius: z.number().min(0).max(48).default(16),
        shadow: z.enum(["none", "soft", "lifted"]).default("soft"),
      })
      .strict()
      .default({}),
    branding: z
      .object({
        enabled: z.boolean().default(false),
        left: logo.nullable().default(null),
        right: logo.nullable().default(null),
        onCover: z.boolean().default(false),
      })
      .strict()
      .default({}),
    export: z.object({ sizes: z.array(size).min(1).default(["1600x1200", "1600x900", "1200x630"]) }).strict().default({}),
  })
  .strict()
  .superRefine((c, ctx) => {
    if (c.ground.type === "image" && !c.ground.image) ctx.addIssue({ code: "custom", path: ["ground", "image"], message: "required when ground.type is image" });
    if (c.pattern.type === "svg" && !c.pattern.svg) ctx.addIssue({ code: "custom", path: ["pattern", "svg"], message: "required when pattern.type is svg" });
    if (c.ground.type === "photo" && !c.source.photo) ctx.addIssue({ code: "custom", path: ["source", "photo"], message: "required when ground.type is photo" });
  });

export type Config = z.infer<typeof schema> & { configDir: string };

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep merge: arrays and scalars from `over` replace those in `base`. */
export function merge(base: unknown, over: unknown): unknown {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = merge(base[k], v);
  return out;
}

async function loadPreset(name: string, fromDir: string): Promise<unknown> {
  const candidates = [resolve(fromDir, name), resolve(fromDir, `${name}.json`), resolve(ROOT, "presets", `${name}.json`)];
  const file = candidates.find((p) => existsSync(p));
  if (!file) throw new Error(`Preset "${name}" not found. Looked in: ${candidates.join(", ")}`);
  return JSON.parse(await readFile(file, "utf8"));
}

export function formatIssues(err: z.ZodError): string {
  return err.issues
    .map((i) => {
      const path = i.path.join(".") || "(root)";
      const allowed = "options" in i && Array.isArray((i as { options?: unknown[] }).options) ? ` Allowed: ${(i as { options: unknown[] }).options.join(", ")}.` : "";
      return `  ${path}: ${i.message}.${allowed}`;
    })
    .join("\n");
}

export async function loadConfig(file: string): Promise<Config> {
  const abs = isAbsolute(file) ? file : resolve(process.cwd(), file);
  if (!existsSync(abs)) throw new Error(`Config not found: ${abs}`);
  const mod = await import(pathToFileURL(abs).href);
  const raw = (mod.default ?? mod) as Record<string, unknown>;
  const dir = dirname(abs);
  const merged = typeof raw.extends === "string" ? merge(await loadPreset(raw.extends, dir), raw) : raw;
  const parsed = schema.safeParse(merged);
  if (!parsed.success) throw new Error(`Invalid config ${file}:\n${formatIssues(parsed.error)}`);
  return { ...parsed.data, configDir: dir };
}

/** Resolve a path from the config file's folder. */
export function fromConfig(c: Config, p: string): string {
  return isAbsolute(p) ? p : resolve(c.configDir, p);
}

export function parseSize(s: string): [number, number] {
  const [w, h] = s.split("x").map(Number);
  return [w, h];
}
