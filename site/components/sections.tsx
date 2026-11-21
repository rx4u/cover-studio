"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "./motion";
import { Command, Logo, REPO } from "./ui";

/** Rises each `.rise` child into place, staggered, as the section enters. */
function useRise(scope: React.RefObject<HTMLElement | null>, selector = ".rise") {
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.utils.toArray<HTMLElement>(scope.current!.querySelectorAll("[data-rise-group]")).forEach((g) => {
        gsap.from(g.querySelectorAll(selector), {
          y: 60,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: g, start: "top 82%" },
        });
      });
    },
    { scope },
  );
}

function Head({ eyebrow, title, line }: { eyebrow: string; title: string; line?: string }) {
  return (
    <div data-rise-group className="max-w-[820px]">
      <p className="eyebrow rise">{eyebrow}</p>
      <h2 className="display rise mt-5 text-[48px] sm:text-[64px]">{title}</h2>
      {line && <p className="rise mt-6 max-w-[620px] text-[19px] leading-[1.55] text-ink-2">{line}</p>}
    </div>
  );
}

/* 01 Why: drag to compare the raw screenshot with the cover ---------------- */

const POINTS = [
  { c: "bg-lilac", t: "A screenshot is not a cover", d: "Next to designed posts, a raw capture looks unfinished." },
  { c: "bg-mint", t: "Every channel wants a size", d: "4:3, 16:9 and 1.91:1, rebuilt by hand each time." },
  { c: "bg-sky", t: "Mockups make things up", d: "Stock scenes and devices you do not ship on." },
];

export function Why() {
  const root = useRef<HTMLElement>(null);
  const [pos, setPos] = useState(50);
  useRise(root);
  useGSAP(
    () => {
      if (reduced()) return;
      const o = { v: 92 };
      gsap.to(o, {
        v: 50,
        duration: 1.8,
        ease: "expo.inOut",
        onUpdate: () => setPos(o.v),
        scrollTrigger: { trigger: ".cmp", start: "top 70%" },
      });
    },
    { scope: root },
  );
  return (
    <section id="why" ref={root} className="wrap pt-32 sm:pt-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
        <div data-rise-group className="lg:col-span-5">
          <p className="eyebrow rise">01 · Why it exists</p>
          <h2 className="display rise mt-5 text-[48px] sm:text-[64px]">Same site. Drag to see the difference.</h2>
        </div>
        <ul data-rise-group className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
          {POINTS.map((p) => (
            <li key={p.t} className={`rise ${p.c} rounded-2xl p-5`}>
              <p className="text-[16px] font-semibold leading-tight">{p.t}</p>
              <p className="mt-2 text-[14px] leading-[1.5] text-ink-2">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="cmp relative mt-12 aspect-[4/3] select-none overflow-hidden rounded-[28px] bg-night sm:aspect-[16/10]">
        <img src="/covers/why-after.webp" alt="The same site as a bento cover made by cover-studio" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src="/covers/why-before.webp" alt="A raw screenshot of the site" className="absolute inset-0 h-full w-full object-cover object-top" />
        </div>
        <span className="pointer-events-none absolute top-5 left-5 rounded-full bg-white px-3 py-1.5 font-mono text-[12px]">Raw screenshot</span>
        <span className="pointer-events-none absolute top-5 right-5 rounded-full bg-cobalt px-3 py-1.5 font-mono text-[12px] text-white">cover-studio</span>
        <div className="pointer-events-none absolute inset-y-0 w-[2px] bg-white" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0e0f0f" strokeWidth="2" aria-hidden="true"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare the raw screenshot with the cover"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </section>
  );
}

/* 02 How ------------------------------------------------------------------ */

const STEPS = [
  { k: "Capture", t: "It visits your site like a person would.", d: "Scrolls every section, waits for reveals, and keeps the real screens: desktop, phones at their true viewports, components, photos and your logo.", code: "npm run cover -- capture site.config.ts" },
  { k: "Choose", t: "One config file decides the look.", d: "Pick patterns, a ground from your own colours, a browser, MacBook or iPad frame, and the phones.", code: "patterns: [\"bento\", \"floating\"]" },
  { k: "Render", t: "Covers come out at every size.", d: "Each pattern is laid out again for every canvas, so nothing gets cropped or squeezed.", code: "npm run cover -- render site.config.ts" },
];

export function How() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".how-pin", start: "top top", end: "+=2200", pin: true, scrub: 0.8 },
        });
        tl.to(".how-strip", { yPercent: -62, ease: "none", duration: 1 }, 0)
          .to(".how-step-0", { opacity: 0.28, duration: 0.15 }, 0.85)
          .to(".how-step-1", { opacity: 1, duration: 0.15 }, 0.85)
          .to(".how-v0", { opacity: 0, scale: 0.96, duration: 0.2 }, 0.9)
          .from(".how-v1", { opacity: 0, y: 40, duration: 0.25 }, 1)
          .from(".how-line", { opacity: 0, x: -16, stagger: 0.08, duration: 0.2 }, 1.05)
          .to(".how-step-1", { opacity: 0.28, duration: 0.15 }, 1.9)
          .to(".how-step-2", { opacity: 1, duration: 0.15 }, 1.9)
          .to(".how-v1", { opacity: 0, scale: 0.96, duration: 0.2 }, 1.95)
          .from(".how-v2", { opacity: 0, scale: 1.08, duration: 0.35 }, 2.05)
          .to({}, { duration: 0.5 });
      });
    },
    { scope: root },
  );
  return (
    <section id="how" ref={root} className="pt-32 sm:pt-40">
      <div className="wrap">
        <Head eyebrow="02 · How it works" title="One URL. Every cover." />
      </div>
      <div className="how-pin">
        <div className="wrap grid gap-10 py-14 lg:min-h-screen lg:grid-cols-12 lg:items-center">
          <ol className="flex flex-col gap-10 lg:col-span-5">
            {STEPS.map((s, i) => (
              <li key={s.k} className={`how-step-${i} ${i === 0 ? "" : "lg:opacity-[0.28]"}`}>
                <p className="font-mono text-[13px] text-cobalt">0{i + 1} {s.k}</p>
                <h3 className="display mt-3 text-[30px] leading-[1.02]">{s.t}</h3>
                <p className="mt-3 max-w-[440px] text-[16px] leading-[1.55] text-ink-2">{s.d}</p>
                <code className="mt-4 block font-mono text-[13px] text-mute">{s.code}</code>
              </li>
            ))}
          </ol>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-night lg:col-span-7">
            <div className="how-v0 absolute inset-0 flex justify-center overflow-hidden pt-8">
              <img src="/covers/how-capture.webp" alt="The stitched full-page capture of a real site" className="how-strip w-[46%] self-start rounded-t-lg" />
            </div>
            <div className="how-v1 absolute inset-0 hidden flex-col justify-center gap-2 p-12 font-mono text-[15px] leading-[1.9] text-paper lg:flex">
              <p className="how-line"><span className="text-white/40">export default</span> {"{"}</p>
              <p className="how-line pl-6">source: {"{"} url: <span className="text-mint">&quot;https://your.site&quot;</span>, mobile: <span className="text-sky">true</span> {"}"},</p>
              <p className="how-line pl-6">patterns: [<span className="text-mint">&quot;bento&quot;</span>, <span className="text-mint">&quot;floating&quot;</span>],</p>
              <p className="how-line pl-6">ground: {"{"} type: <span className="text-mint">&quot;tint&quot;</span> {"}"},</p>
              <p className="how-line pl-6">frame: {"{"} device: <span className="text-mint">&quot;macbook-pro&quot;</span> {"}"},</p>
              <p className="how-line pl-6">export: {"{"} sizes: [<span className="text-mint">&quot;1600x1200&quot;</span>, <span className="text-mint">&quot;1200x630&quot;</span>] {"}"},</p>
              <p className="how-line">{"}"}</p>
            </div>
            <img src="/covers/how-result.webp" alt="A bento cover rendered by cover-studio" className="how-v2 absolute inset-0 hidden h-full w-full object-cover lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 03 Patterns: a pinned horizontal run of real covers ------------------------ */

const PATTERNS = [
  { id: "bento", site: "Haven", d: "Hero, phone, photos and a component on one grid" },
  { id: "floating", site: "Lune", d: "Phone and desktop as one overlapping group" },
  { id: "phone-trio", site: "Aequor", d: "Three phones, mixed models, real system UI" },
  { id: "cascade", site: "Haven", d: "Three sections layered off the edge" },
  { id: "overview-grid", site: "Lune", d: "The whole site as a staggered mosaic" },
  { id: "brand-split", site: "Aequor", d: "The page beside its own logo and photo" },
  { id: "editorial", site: "Haven", d: "A lead column and two sections, larger" },
  { id: "tilt", site: "Haven", d: "The mosaic, turned and leaning back" },
];

export function Patterns() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>(".pat-track")!;
        const dist = () => track.scrollWidth - window.innerWidth + 64;
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: ".pat-pin", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
        gsap.from(".pat-card", { y: 80, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".pat-pin", start: "top 75%" } });
      });
    },
    { scope: root },
  );
  return (
    <section id="patterns" ref={root} className="pt-32 sm:pt-40">
      <div className="pat-pin flex flex-col justify-center overflow-hidden lg:h-screen">
        <div className="wrap flex flex-wrap items-end justify-between gap-6">
          <div data-rise-group>
            <p className="eyebrow rise">03 · Patterns</p>
            <h2 className="display rise mt-5 text-[48px] sm:text-[64px]">Eight of eighteen.</h2>
          </div>
          <a href={`${REPO}/blob/main/docs/patterns.md`} className="font-mono text-[14px] underline decoration-ink/30 underline-offset-4 hover:text-cobalt">
            All 18, with their measurements
          </a>
        </div>
        <ul className="pat-track mt-12 flex snap-x gap-5 overflow-x-auto px-8 pb-4 lg:w-max lg:overflow-visible lg:px-[max(32px,calc((100vw-1216px)/2+32px))]">
          {PATTERNS.map((p, i) => (
            <li key={p.id} className="pat-card w-[78vw] shrink-0 snap-start sm:w-[520px] lg:w-[600px]">
              <img src={`/covers/p-${p.id}.webp`} alt={`${p.id} cover made by cover-studio from ${p.site}`} className="block aspect-[4/3] w-full rounded-[22px] object-cover" />
              <div className="mt-4 flex items-baseline gap-4">
                <span className="font-mono text-[12px] text-cobalt">P{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[26px]">{p.id}</span>
                <span className="ml-auto font-mono text-[12px] text-mute">{p.site}</span>
              </div>
              <p className="mt-1 text-[15px] text-ink-2">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 04 Sizes: three real outputs at their true shapes -------------------------- */

const SIZES = [
  { id: "4x3", r: 1600 / 1200, l: "1600 × 1200", u: "Dribbble, Contra" },
  { id: "16x9", r: 1600 / 900, l: "1600 × 900", u: "Slides, video" },
  { id: "og", r: 1200 / 630, l: "1200 × 630", u: "Link previews" },
];

export function Sizes() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".sz", { y: 100, opacity: 0, scale: 0.92, duration: 1.3, ease: "expo.out", stagger: 0.14, scrollTrigger: { trigger: ".sz-row", start: "top 80%" } });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="wrap pt-32 sm:pt-40">
      <div data-rise-group className="max-w-[820px]">
        <p className="eyebrow rise">04 · Every size</p>
        <h2 className="display rise mt-5 text-[48px] sm:text-[64px]">Laid out again for each channel.</h2>
        <p className="rise mt-6 max-w-[620px] text-[19px] leading-[1.55] text-ink-2">
          One render, three canvases. Each size is composed for its own shape, so nothing is squeezed or cut off.
        </p>
      </div>
      <div className="sz-row mt-14 grid gap-6 md:grid-cols-12 md:items-start">
        {SIZES.map((s, i) => (
          <figure key={s.id} className={`sz m-0 min-w-0 ${i === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"}`}>
            <img src={`/covers/s-${s.id}.webp`} alt={`The same cover at ${s.l}`} className="block w-full rounded-[18px]" />
            <figcaption className="mt-3 font-mono text-[13px]">
              <span className="font-medium">{s.l}</span> <span className="text-mute">· {s.u}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* 05 Phones: Ostler ------------------------------------------------------------ */

const SCREENS = ["driver-light-00", "driver-light-04", "driver-light-05", "manager-light-04"];

export function Phones() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".ph", { y: 220, rotate: (i) => [-6, -2, 3, 7][i], opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".ph-row", start: "top 85%" } });
      gsap.utils.toArray<HTMLElement>(".ph").forEach((el, i) => {
        gsap.to(el, { y: [-50, 30, -30, 50][i], ease: "none", scrollTrigger: { trigger: ".ph-row", start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="overflow-hidden bg-night pt-32 pb-40 text-paper sm:pt-40">
      <div className="wrap">
        <div data-rise-group className="max-w-[760px]">
          <p className="eyebrow rise !text-white/55">05 · Mobile, too</p>
          <h2 className="display rise mt-5 text-[48px] sm:text-[64px]">Phones at their real size, with their real screens.</h2>
          <p className="rise mt-6 max-w-[600px] text-[19px] leading-[1.55] text-white/70">
            Phone screens are captured at each device&apos;s true viewport, in light and dark. These are from Ostler, a fleet van rental app.
          </p>
        </div>
        <div className="ph-row mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">
          {SCREENS.map((s, i) => (
            <div key={s} className={`ph ${i % 2 ? "md:mt-24" : ""}`}>
              <img src={`/ostler/${s}.webp`} alt={`Ostler app screen ${i + 1}`} className="block w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Open source --------------------------------------------------------------------- */

const BOX = [
  ["18", "patterns, each measured from a reference cover"],
  ["7", "frames: browser, MacBook Pro, iPad Pro and four phones"],
  ["3", "sizes per render: 4:3, 16:9 and 1.91:1"],
  ["2", "colour schemes captured, light and dark"],
];

const DOCS = [
  ["README", `${REPO}#readme`],
  ["Config reference", `${REPO}/blob/main/docs/config.md`],
  ["Pattern specs", `${REPO}/blob/main/docs/patterns.md`],
  ["Licence (MIT)", `${REPO}/blob/main/LICENSE`],
  ["Issues", `${REPO}/issues`],
];

export function OpenSource() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  return (
    <section id="open-source" ref={root} className="wrap pt-32 sm:pt-40">
      <div data-rise-group className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow rise">06 · Open source</p>
          <h2 className="display rise mt-5 text-[48px] sm:text-[64px]">Free, MIT, and yours to change.</h2>
          <a href={REPO} className="rise mt-10 block rounded-[22px] border border-line p-6 transition-colors hover:border-ink">
            <span className="flex items-center gap-3 font-mono text-[14px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" /></svg>
              rx4u / cover-studio
            </span>
            <span className="mt-4 block text-[16px] leading-[1.5] text-ink-2">Turn any live website into presentation-ready covers in proven patterns, at every size a channel needs.</span>
            <span className="mt-5 flex flex-wrap gap-2 font-mono text-[12px]">
              {["MIT licence", "TypeScript", "Node 20+", "Playwright"].map((t) => (
                <span key={t} className="rounded-full bg-ink/5 px-3 py-1.5">{t}</span>
              ))}
            </span>
          </a>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ul className="grid grid-cols-2 gap-3">
            {BOX.map(([n, t], i) => (
              <li key={n + t} className={`rise rounded-[22px] p-6 ${["bg-lilac", "bg-mint", "bg-sky", "bg-ink/5"][i]}`}>
                <span className="display block text-[56px]">{n}</span>
                <span className="mt-2 block text-[15px] leading-[1.45] text-ink-2">{t}</span>
              </li>
            ))}
          </ul>
          <p className="rise mt-8 text-[16px] leading-[1.6] text-ink-2">
            It needs Node 20 or later and Chrome (or Playwright&apos;s Chromium), and nothing else: no account, no API key, no server. Covers render on
            your machine from your own site. Device frames come from react-mockframe (MIT); status bar icons from Ionicons and Material Icons.
          </p>
          <ul className="rise mt-6 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[14px]">
            {DOCS.map(([l, h]) => (
              <li key={l}><a href={h} className="underline decoration-ink/30 underline-offset-4 hover:text-cobalt">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 06 About ------------------------------------------------------------------ */

export function About() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  return (
    <section id="about" ref={root} className="wrap pt-32 sm:pt-40">
      <div data-rise-group className="grid gap-10 rounded-[32px] bg-lilac p-8 sm:p-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow rise !text-ink-2">07 · About</p>
          <h2 className="display rise mt-5 text-[44px] sm:text-[56px]">Made by Raja.</h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="rise text-[20px] leading-[1.55]">
            I&apos;m a product designer with 18 years across enterprise AI, SaaS, fintech and logistics. I design and build a new concept most weeks,
            and every one needs covers before it can be posted.
          </p>
          <p className="rise mt-5 text-[17px] leading-[1.6] text-ink-2">
            I kept rebuilding the same frames by hand, size after size. cover-studio is what I made to stop: it works from the real site, follows
            the layouts that hold up on Dribbble and Contra, and stays free and open source.
          </p>
          <ul className="rise mt-8 flex flex-wrap gap-3 text-[15px] font-medium">
            {[
              ["Portfolio", "https://rajaraman.vercel.app/"],
              ["Dribbble", "https://dribbble.com/raja-raman"],
              ["X", "https://x.com/1bsfraja"],
              ["GitHub", "https://github.com/rx4u"],
            ].map(([l, h]) => (
              <li key={l}>
                <a href={h} className="inline-block rounded-full bg-paper/70 px-5 py-2.5 hover:bg-ink hover:text-paper">{l}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Closing ------------------------------------------------------------------- */

export function Closing() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  return (
    <section ref={root} className="mt-32 bg-cobalt text-white sm:mt-40">
      <div data-rise-group className="wrap grid gap-12 py-28 lg:grid-cols-12 lg:items-center">
        <h2 className="display rise text-[52px] sm:text-[76px] lg:col-span-7">Make the next cover from the site itself.</h2>
        <div className="flex flex-col gap-3 lg:col-span-5">
          {["git clone https://github.com/rx4u/cover-studio", "npm install", "npm run cover -- capture site.config.ts", "npm run cover -- render site.config.ts"].map((c) => (
            <div key={c} className="rise">
              <Command cmd={c} />
            </div>
          ))}
        </div>
      </div>
      <footer className="border-t border-white/20">
        <div className="wrap flex flex-wrap items-center justify-between gap-6 py-10 text-[14px] text-white/80">
          <Logo light />
          <p>MIT licence. Device frames from react-mockframe. Icons from Ionicons and Material Icons.</p>
          <a href={REPO} className="text-white underline underline-offset-4">github.com/rx4u/cover-studio</a>
        </div>
      </footer>
    </section>
  );
}

export { ScrollTrigger };
