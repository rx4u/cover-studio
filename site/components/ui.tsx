"use client";

import { useState } from "react";

export const REPO = "https://github.com/rx4u/cover-studio";
export const CONTRA = "https://contra.com/siraguhq";

export function GitHubMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

export function Copy({ text, label = "Copy command" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : label}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        });
      }}
      className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg border border-white/15 text-white transition-colors hover:bg-white/10"
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

/** One command on a dark bar with a copy button. */
export function Command({ cmd }: { cmd: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-inner bg-ink py-2 pr-2 pl-5 max-[479px]:pl-4 font-mono text-[14px] text-paper">
      <code className="overflow-x-auto whitespace-nowrap [scrollbar-width:none] max-[479px]:py-3 max-[479px]:text-[12px]">
        <span className="text-white/50">$ </span>
        {cmd}
      </code>
      {/* The command fills a phone's width, so the copy button is left out there. */}
      <span className="max-[479px]:hidden">
        <Copy text={cmd} />
      </span>
    </div>
  );
}

/** Several commands as one dark panel; the button copies them all. */
export function Terminal({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-tile bg-ink p-2 text-paper">
      <div className="flex items-center justify-between gap-4 pl-4">
        <span className="font-mono text-[12px] tracking-[0.08em] text-white/60 uppercase">Quick start</span>
        <Copy text={lines.join("\n")} label="Copy all commands" />
      </div>
      <pre className="overflow-x-auto px-4 pt-3 pb-4 font-mono text-[14px] leading-[2] max-[479px]:text-[12.5px]">
        {lines.map((l) => (
          <code key={l} className="block whitespace-pre">
            <span className="text-white/50">$ </span>
            {l}
          </code>
        ))}
      </pre>
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
