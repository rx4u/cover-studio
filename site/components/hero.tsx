"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, reduced } from "./motion";
import { Command, CONTRA, GitHubMark, Logo, REPO } from "./ui";

const COLS = [
  ["w01", "w05", "w09", "w03"],
  ["w02", "w06", "w10", "w07"],
  ["w11", "w04", "w08", "w01"],
  ["w12", "w08", "w02", "w06"],
];

const NAV = [
  ["Who it's for", "#why"],
  ["How it works", "#how"],
  ["Patterns", "#patterns"],
  ["Open source", "#open-source"],
  ["About", "#about"],
];

/** Fixed header: clear over the cobalt hero, then a white glass bar once the hero has scrolled past. */
function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
        solid ? "bg-white/80 text-ink shadow-[0_1px_0_rgba(14,15,15,0.08)] backdrop-blur-xl" : "bg-transparent text-white"
      }`}
    >
      <div className="wrap flex h-[72px] items-center justify-between">
        <a href="#top" aria-label="cover-studio home" className="rounded-md">
          <Logo light={!solid} />
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 text-[14px] font-medium">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} className={`hidden rounded-full px-3.5 py-2 transition-colors lg:inline ${solid ? "hover:bg-ink/5" : "hover:bg-white/10"}`}>
              {l}
            </a>
          ))}
          <a
            href={REPO}
            className={`ml-2 inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors ${solid ? "bg-ink text-white hover:bg-cobalt" : "bg-white text-ink hover:bg-white/85"}`}
          >
            <GitHubMark />
            Star on GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".h-line > span", { yPercent: 110, duration: 1.3, stagger: 0.09 })
        .from(".h-fade", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, "-=0.9")
        .from(".h-wall", { opacity: 0, scale: 1.12, duration: 2.2 }, 0);
      gsap.utils.toArray<HTMLElement>(".h-col").forEach((col, i) => {
        const up = i % 2 === 0;
        gsap.fromTo(col, { yPercent: up ? 0 : -50 }, { yPercent: up ? -50 : 0, duration: 60 + i * 10, ease: "none", repeat: -1 });
      });
      // The wall leans further back as the hero scrolls away.
      gsap.to(".h-tilt", { rotateX: 34, y: -120, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative overflow-hidden bg-cobalt text-white">
      <Header />
      {/* The wall: four columns of real covers, tilted in 3D and running off the top, right and bottom edges. */}
      <div aria-hidden="true" className="h-wall pointer-events-none absolute inset-y-0 right-0 w-[60%] overflow-hidden [perspective:1800px] max-lg:inset-x-0 max-lg:top-auto max-lg:h-[520px] max-lg:w-full">
        <div className="h-tilt absolute inset-[-30%_-10%] grid origin-center grid-cols-4 gap-5 [transform:rotateX(22deg)_rotateZ(-14deg)_rotateY(-6deg)]">
          {COLS.map((col, i) => (
            <div key={i} className="h-col flex flex-col">
              {[...col, ...col, ...col, ...col].map((id, j) => (
                <img key={j} src={`/covers/${id}.webp`} alt="" className="mb-5 block aspect-[4/3] w-full rounded-inner object-cover shadow-[0_30px_60px_-20px_rgba(4,8,60,0.55)]" />
              ))}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#2f43f5_0%,#2f43f5_12%,rgba(47,67,245,0.8)_24%,rgba(47,67,245,0)_46%),linear-gradient(180deg,#2f43f5_0%,rgba(47,67,245,0)_16%)] max-lg:bg-[linear-gradient(180deg,#2f43f5_0%,rgba(47,67,245,0)_40%)]" />
      </div>

      <section id="top" className="wrap relative flex min-h-[100svh] flex-col justify-center pt-28 pb-24 max-lg:min-h-0 max-lg:pb-[560px]">
        <div className="max-w-[600px]">
          <p className="eyebrow h-fade text-white/85">Open-source CLI · Free · MIT</p>
          <h1 className="display mt-6 whitespace-nowrap text-[clamp(52px,7.2vw,104px)]">
            <span className="h-line block overflow-hidden pb-[0.08em]"><span className="block">Live site in.</span></span>
            <span className="h-line -mt-[0.08em] block overflow-hidden pb-[0.08em]"><span className="block">Covers out.</span></span>
          </h1>
          <p className="h-fade mt-7 max-w-[460px] text-[clamp(17px,1.4vw,19px)] leading-[1.55] text-white/90">
            Presentation covers and device mockups for designers who post their work. Made from your live design, in 18 tested patterns, at every size.
          </p>
          <div className="h-fade mt-9 max-w-[460px]">
            <Command cmd="npm run cover -- render cover.config.ts" />
          </div>
          <div className="h-fade mt-4 flex flex-wrap gap-3">
            <a href={REPO} className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[16px] font-semibold text-ink transition-colors hover:bg-white/85">
              <GitHubMark size={18} />
              Get it on GitHub
            </a>
            <a href="#patterns" className="rounded-full border border-white/45 px-6 py-3.5 text-[16px] font-semibold transition-colors hover:border-white hover:bg-white/10">
              See the patterns
            </a>
          </div>
          <p className="h-fade mt-10 font-mono text-[12px] leading-[1.6] text-white/85">
            Every cover on this page is Raja&apos;s own work. <a href={CONTRA} className="link text-white">Hire him on Contra</a>
          </p>
        </div>
      </section>
    </div>
  );
}
