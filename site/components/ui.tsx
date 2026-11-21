"use client";

import { useState } from "react";

export const REPO = "https://github.com/rx4u/cover-studio";

export function Copy({ text, dark = false }: { text: string; dark?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : "Copy command"}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        });
      }}
      className={`grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg border transition-colors ${
        dark ? "border-white/15 text-white hover:bg-white/10" : "border-ink/15 hover:bg-ink/5"
      }`}
    >
      {done ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 12l5 5L20 7" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
    </button>
  );
}

export function Command({ cmd, dark = true }: { cmd: string; dark?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl py-2 pr-2 pl-5 font-mono text-[14px] ${
        dark ? "bg-ink text-paper" : "bg-white/60 text-ink"
      }`}
    >
      <code className="truncate">
        <span className="opacity-50">$ </span>
        {cmd}
      </code>
      <Copy text={cmd} dark={dark} />
    </div>
  );
}

/** The wordmark: a 4:3 frame holding a smaller 4:3 frame (a cover inside a canvas), then the name in the display face. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="26" height="20" viewBox="0 0 26 20" aria-hidden="true">
        <rect x="1" y="1" width="24" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="7" width="13" height="9.75" rx="2" fill={light ? "#fff" : "#2f43f5"} />
      </svg>
      <span className="font-display text-[19px] font-[800] tracking-[-0.03em]">cover-studio</span>
    </span>
  );
}
