#!/usr/bin/env -S npx tsx
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadConfig, PATTERN_IDS } from "./config.ts";
import { capture } from "./capture.ts";
import { render } from "./render.ts";

const HELP = `cover-studio: turn a live website into presentation covers.

Usage:
  cover-studio init [name]                 write a starter cover.config.ts
  cover-studio validate <config>           check a config and print the resolved values
  cover-studio capture <config> [--fresh]  capture the site into .cover-cache/
  cover-studio render <config> [--pattern <id>] [--fresh]
                                           capture if needed, then render into covers/

Patterns: ${PATTERN_IDS.join(", ")}`;

const STARTER = (name: string) => `// cover-studio config. Docs: https://github.com/rx4u/cover-studio/blob/main/docs/config.md
export default {
  name: "${name}",
  extends: "neutral-light",
  source: {
    url: "https://example.com",
    pages: ["/"],
    scrollPositions: [0],
    photo: null,
  },
  patterns: ["full-bleed", "lead-peek"],
  branding: { enabled: false },
};
`;

function flag(args: string[], name: string): string | true | undefined {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const next = args[i + 1];
  return next && !next.startsWith("--") ? next : true;
}

async function main(): Promise<void> {
  const [cmd, target, ...rest] = process.argv.slice(2);
  const fresh = flag(rest, "fresh") !== undefined;
  switch (cmd) {
    case "init": {
      const name = (target ?? "site").toLowerCase().replace(/[^a-z0-9-]/g, "-");
      const file = resolve(process.cwd(), "cover.config.ts");
      if (existsSync(file)) throw new Error("cover.config.ts already exists here.");
      await writeFile(file, STARTER(name));
      console.log(`Wrote ${file}. Set source.url, then run: cover-studio render cover.config.ts`);
      return;
    }
    case "validate": {
      const c = await loadConfig(need(target));
      console.log(JSON.stringify(c, null, 2));
      console.log("Config is valid.");
      return;
    }
    case "capture": {
      await capture(await loadConfig(need(target)), fresh);
      return;
    }
    case "render": {
      const c = await loadConfig(need(target));
      const m = await capture(c, fresh);
      const p = flag(rest, "pattern");
      const files = await render(c, m, typeof p === "string" ? p : undefined);
      console.log(`Done: ${files.length} images in covers/${c.name}/`);
      return;
    }
    default:
      console.log(HELP);
  }
}

function need(target: string | undefined): string {
  if (!target) throw new Error("Pass a config file, for example: cover-studio render cover.config.ts");
  return target;
}

main().catch((e: Error) => {
  console.error(e.message);
  process.exit(1);
});
