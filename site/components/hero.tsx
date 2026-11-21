"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduced } from "./motion";
import { Command, Logo, REPO } from "./ui";

const COLS = [
  ["w01", "w04", "w07", "w10"],
  ["w02", "w05", "w08", "w11"],
  ["w03", "w06", "w09", "w12"],
];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".h-line > span", { yPercent: 110, duration: 1.3, stagger: 0.09 })
        .from(".h-fade", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, "-=0.9")
        .from(".h-card", { y: 80, opacity: 0, scale: 0.94, duration: 1.4, stagger: { each: 0.06, from: "random" } }, 0.15);
      // Each column drifts at its own pace; the list is doubled, so -50% loops without a seam.
      gsap.utils.toArray<HTMLElement>(".h-col").forEach((col, i) => {
        const up = i % 2 === 0;
        gsap.fromTo(col, { yPercent: up ? 0 : -50 }, { yPercent: up ? -50 : 0, duration: 70 + i * 12, ease: "none", repeat: -1 });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative overflow-hidden">
      <header className="wrap flex h-20 items-center justify-between">
        <a href="#top" aria-label="cover-studio home">
          <Logo />
        </a>
        <nav aria-label="Main" className="flex items-center gap-7 text-[15px]">
          <a href="#why" className="hidden hover:text-cobalt sm:inline">Why</a>
          <a href="#how" className="hidden hover:text-cobalt sm:inline">How it works</a>
          <a href="#patterns" className="hidden hover:text-cobalt sm:inline">Patterns</a>
          <a href="#open-source" className="hidden hover:text-cobalt md:inline">Open source</a>
          <a href="#about" className="hidden hover:text-cobalt md:inline">About</a>
          <a href={REPO} className="rounded-full bg-ink px-4 py-2.5 font-medium text-paper hover:bg-cobalt">GitHub</a>
        </nav>
      </header>

      <section id="top" className="wrap grid items-center gap-12 pt-10 pb-24 lg:grid-cols-12 lg:pt-6">
        <div className="lg:col-span-6">
          <p className="eyebrow h-fade">Open-source CLI · MIT</p>
          <h1 className="display mt-7 text-[clamp(54px,7.2vw,98px)] whitespace-nowrap">
            <span className="h-line block overflow-hidden pb-[0.06em]"><span className="block">Live site in.</span></span>
            <span className="h-line block overflow-hidden pb-[0.06em]"><span className="block">Covers out.</span></span>
          </h1>
          <p className="h-fade mt-8 max-w-[460px] text-[19px] leading-[1.55] text-ink-2">
            cover-studio captures your real website and turns it into presentation covers, in 18 patterns and every size a channel needs.
            Nothing mocked up, nothing invented.
          </p>
          <div className="h-fade mt-10 max-w-[460px]">
            <Command cmd="npm run cover -- render site.config.ts" />
          </div>
          <div className="h-fade mt-5 flex flex-wrap gap-3">
            <a href={REPO} className="rounded-full bg-cobalt px-6 py-3.5 text-[16px] font-semibold text-white hover:bg-ink">
              Star on GitHub
            </a>
            <a href="#patterns" className="rounded-full border border-ink/20 px-6 py-3.5 text-[16px] font-semibold hover:border-ink">
              See the patterns
            </a>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative grid h-[640px] grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-6 lg:h-[780px] [mask-image:linear-gradient(transparent,#000_10%,#000_90%,transparent)]"
        >
          {COLS.map((col, i) => (
            <div key={i} className={`h-col flex flex-col ${i === 2 ? "hidden sm:flex" : ""}`}>
              {[...col, ...col].map((id, j) => (
                <img key={j} src={`/covers/${id}.webp`} alt="" className="h-card mb-4 block aspect-[4/3] w-full rounded-xl object-cover shadow-[0_18px_40px_-24px_rgba(14,15,15,0.45)]" />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
