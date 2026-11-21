"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, reduced } from "./motion";
import { CONTRA, GitHubMark, Logo, REPO, Terminal } from "./ui";

const MOTION_DESKTOP = "(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";

/** Rises each `.rise` child into place, staggered, as its group enters. */
function useRise(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.utils.toArray<HTMLElement>(scope.current!.querySelectorAll("[data-rise-group]")).forEach((g) => {
        gsap.from(g.querySelectorAll(".rise"), {
          y: 48,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: g, start: "top 85%" },
        });
      });
    },
    { scope },
  );
}

/** Section head: eyebrow, heading, lead. The same rhythm in every section. */
function Head({ eyebrow, title, children, dark = false }: { eyebrow: string; title: string; children?: React.ReactNode; dark?: boolean }) {
  return (
    <div data-rise-group className="max-w-[960px]">
      <p className={`eyebrow rise ${dark ? "text-white/70" : ""}`}>{eyebrow}</p>
      <h2 className="h2 split mt-5">{title}</h2>
      {children && <p className={`lead rise mt-6 ${dark ? "text-white/75" : ""}`}>{children}</p>}
    </div>
  );
}

/* 01 Who it's for: three problems, then drag to compare ---------------------- */

const STORY = [
  { c: "bg-lilac", t: "Mockups by hand take hours.", d: "Frames, devices, backgrounds and three sizes, rebuilt for every post." },
  { c: "bg-mint", t: "Mockup kits all look the same.", d: "The same stock devices and scenes on every feed, filled with placeholder content." },
  { c: "bg-sky", t: "AI tools burn tokens and drift.", d: "Every revision is another prompt. No two results match, and details get invented." },
];

export function Why() {
  const root = useRef<HTMLElement>(null);
  const [pos, setPos] = useState(50);
  useRise(root);
  useGSAP(
    () => {
      if (reduced()) return;
      const o = { v: 90 };
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
    <section id="why" ref={root} className="wrap section">
      <Head eyebrow="01 · Who it's for" title="Every post needs a cover and mockups.">
        For designers and creators who share work on Dribbble, Contra, Behance and X, in portfolios and in pitches.
      </Head>
      {/* Subgrid rows keep the number, title and text of all three cards on shared lines. */}
      <ol data-rise-group className="mt-14 grid gap-4 md:grid-cols-3">
        {STORY.map((p, i) => (
          <li key={p.t} className={`rise ${p.c} row-span-3 grid grid-rows-subgrid gap-y-0 rounded-card p-8`}>
            <span className="label pb-16 md:pb-24">0{i + 1}</span>
            <h3 className="h3">{p.t}</h3>
            <p className="body mt-4">{p.d}</p>
          </li>
        ))}
      </ol>

      <div className="mt-24 grid items-center gap-x-8 gap-y-10 lg:mt-32 lg:grid-cols-12">
        <div data-rise-group className="lg:col-span-4">
          <h2 className="h2 split text-[clamp(32px,3.4vw,44px)]">{"One design, before\u00a0and\u00a0after."}</h2>
          <p className="lead rise mt-6">Drag the handle. On the left, a raw screenshot. On the right, the same design as a cover.</p>
        </div>
        <figure className="m-0 lg:col-span-8">
          <div data-clip className="cmp relative aspect-[4/3] select-none overflow-hidden rounded-card bg-night has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-cobalt">
            <img src="/covers/why-after.webp" alt="The same design as a bento cover made by cover-studio" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <img src="/covers/why-before.webp" alt="A raw screenshot of the design" className="absolute inset-0 h-full w-full object-cover object-left-top" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 w-[2px] bg-white" style={{ left: `${pos}%` }}>
              <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
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
          <figcaption className="label mt-4 flex flex-col justify-between gap-x-6 gap-y-1 text-mute sm:flex-row">
            <span>Left: raw screenshot</span>
            <span>Right: cover. Lune, a hotel site designed by Raja.</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* 02 What it saves ----------------------------------------------------------- */

const SAVES = [
  { c: "bg-ink text-white", n: "0", u: "AI tokens per cover", d: "It runs on your machine with no model in the loop. Nothing to prompt, nothing to redo." },
  { c: "bg-lilac", n: "1", u: "Second per cover", d: "The first capture takes 1 to 4 minutes. After that, every pattern and size renders in about a second." },
  { c: "bg-cobalt text-white", n: "0", u: "Cost", d: "Free and open source under the MIT licence. No account, no API key, no subscription." },
];

export function Saves() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  return (
    <section ref={root} className="wrap section">
      <Head eyebrow="02 · What it saves" title={"No\u00a0prompts. No\u00a0waiting. No\u00a0bill."} />
      <ul data-rise-group className="mt-14 grid gap-4 md:grid-cols-3">
        {SAVES.map((x) => (
          <li key={x.u} className={`rise ${x.c} flex flex-col rounded-card p-8 md:min-h-[360px]`}>
            <span data-count={x.n} className="display block text-[clamp(96px,10vw,128px)] leading-[0.8]">{x.n}</span>
            <span className="label mt-5 block">{x.u}</span>
            <p className="mt-10 max-w-[320px] text-[16px] leading-[1.6] opacity-90 md:mt-auto">{x.d}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 03 How it works: a pinned three-step scene --------------------------------- */

const STEPS = [
  { k: "Capture", t: "It reads your live design.", d: "It scrolls every section, waits for the motion to finish and keeps the real screens: desktop, phones, components and your logo." },
  { k: "Choose", t: "One config file sets the look.", d: "Pick the patterns, a ground, a device frame and the phones." },
  { k: "Render", t: "Every pattern you picked, ready to post.", d: "Each one is laid out for its canvas, so nothing is cropped or squeezed." },
];

export function How() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Without this branch (small screens, reduced motion) the steps are a plain list beside the capture.
      mm.add(MOTION_DESKTOP, () => {
        gsap.set(".how-step-1, .how-step-2", { opacity: 0.32 });
        gsap.set(".how-v1", { display: "flex" });
        gsap.set(".how-v2", { display: "grid" });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".how-pin", start: "top top", end: "+=2200", pin: true, scrub: 0.8 },
        });
        tl.to(".how-strip", { yPercent: -70, ease: "none", duration: 1 }, 0)
          .to(".how-step-0", { opacity: 0.32, duration: 0.15 }, 0.85)
          .to(".how-step-1", { opacity: 1, duration: 0.15 }, 0.85)
          .to(".how-v0", { opacity: 0, scale: 0.96, duration: 0.2 }, 0.85)
          .from(".how-v1", { opacity: 0, y: 40, duration: 0.25 }, 1.02)
          .from(".how-line", { opacity: 0, x: -16, stagger: 0.08, duration: 0.2 }, 1.05)
          .to(".how-step-1", { opacity: 0.32, duration: 0.15 }, 1.9)
          .to(".how-step-2", { opacity: 1, duration: 0.15 }, 1.9)
          .to(".how-v1", { opacity: 0, scale: 0.96, duration: 0.2 }, 1.9)
          .from(".how-v2 figure", { opacity: 0, y: 40, stagger: 0.08, duration: 0.3 }, 2.08)
          .to({}, { duration: 0.5 });
      });
    },
    { scope: root },
  );
  return (
    <section id="how" ref={root} className="section lg:pt-16">
      <div className="how-pin">
        <div className="wrap grid gap-x-8 gap-y-12 lg:min-h-screen lg:grid-cols-12 lg:items-center lg:pt-[72px]">
          <div className="lg:col-span-5">
          <Head eyebrow="03 · How it works" title="Capture. Choose. Render." />
          <ol className="mt-10 flex flex-col gap-7 lg:mt-12">
            {STEPS.map((s, i) => (
              <li key={s.k} className={`how-step-${i}`}>
                <p className="label text-cobalt">0{i + 1} · {s.k}</p>
                <h3 className="h3 mt-3">{s.t}</h3>
                <p className="body mt-3 max-w-[420px]">{s.d}</p>
              </li>
            ))}
          </ol>
          </div>
          <div data-clip className="relative aspect-[4/3] overflow-hidden rounded-card bg-night lg:col-span-7">
            <div className="how-v0 absolute inset-0 overflow-hidden">
              <img src="/covers/how-capture.webp" alt="The full capture of a live design, top to bottom" className="how-strip block w-full" />
            </div>
            <div className="how-v1 absolute inset-0 hidden flex-col justify-center px-10 font-mono text-[13px] leading-[2] whitespace-nowrap text-paper xl:px-14 xl:text-[14px]">
              <p className="how-line"><span className="text-white/50">export default</span> {"{"}</p>
              <p className="how-line pl-6">source: {"{"} url: <span className="text-mint">&quot;https://your.design&quot;</span>, mobile: <span className="text-sky">true</span> {"}"},</p>
              <p className="how-line pl-6">patterns: [<span className="text-mint">&quot;bento&quot;</span>, <span className="text-mint">&quot;editorial&quot;</span>, <span className="text-mint">&quot;floating&quot;</span>, <span className="text-mint">&quot;brand-split&quot;</span>],</p>
              <p className="how-line pl-6">ground: {"{"} type: <span className="text-mint">&quot;tint&quot;</span> {"}"},</p>
              <p className="how-line pl-6">frame: {"{"} device: <span className="text-mint">&quot;macbook-pro&quot;</span> {"}"},</p>
              <p className="how-line pl-6">export: {"{"} sizes: [<span className="text-mint">&quot;1600x1200&quot;</span>, <span className="text-mint">&quot;1200x630&quot;</span>] {"}"},</p>
              <p className="how-line">{"}"}</p>
            </div>
            <div className="how-v2 absolute inset-0 hidden grid-cols-2 grid-rows-2 gap-3 p-3">
              {["bento", "editorial", "floating", "brand-split"].map((id) => (
                <figure key={id} className="relative m-0 min-h-0 overflow-hidden rounded-inner">
                  <img src={`/covers/p-${id}.webp`} alt={`The ${id.replace("-", " ")} pattern`} className="block h-full w-full object-cover" />
                  <figcaption className="absolute bottom-2.5 left-2.5 rounded-full bg-night/80 px-2.5 py-1 font-mono text-[11px] leading-none text-white backdrop-blur-sm">{id}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 04 Patterns: a pinned horizontal run of real covers ------------------------ */

const PATTERNS = [
  { id: "bento", site: "Haven", d: "Hero, phone, photos and a component on one grid." },
  { id: "floating", site: "Lune", d: "Phone and desktop as one overlapping group." },
  { id: "phone-trio", site: "Aequor", d: "Three phones, mixed models, real system UI." },
  { id: "cascade", site: "Haven", d: "Three sections layered off the edge." },
  { id: "overview-grid", site: "Lune", d: "The whole design as a staggered mosaic." },
  { id: "brand-split", site: "Aequor", d: "The page beside its own logo and photo." },
  { id: "editorial", site: "Haven", d: "A lead column and two larger sections." },
  { id: "tilt", site: "Haven", d: "The mosaic, turned and leaning back." },
];

export function Patterns() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Without this branch the run is a plain swipeable row.
      mm.add(MOTION_DESKTOP, () => {
        const track = root.current!.querySelector<HTMLElement>(".pat-track")!;
        gsap.set(".pat-pin", { height: "100vh" });
        gsap.set(track, { width: "max-content", overflow: "visible" });
        const dist = () => Math.max(0, track.offsetWidth - window.innerWidth);
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
    <section id="patterns" ref={root} className="section lg:pt-24">
      <div className="pat-pin flex flex-col justify-center overflow-hidden lg:pt-[72px]">
        <div className="wrap flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <Head eyebrow="04 · Patterns" title="Eight of eighteen.">
            Each one made from a site designed by Raja.
          </Head>
          <a href={`${REPO}/blob/main/docs/patterns.md`} className="link label mb-1 hover:text-cobalt">
            See all 18 on GitHub
          </a>
        </div>
        <ul className="pat-track mt-10 flex snap-x gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] min-[480px]:px-8 lg:px-[max(32px,calc((100vw-1216px)/2+32px))]">
          {PATTERNS.map((p, i) => (
            <li key={p.id} className="pat-card w-[80vw] shrink-0 snap-start sm:w-[520px] lg:w-[clamp(440px,calc((100svh-440px)*4/3),600px)]">
              <img src={`/covers/p-${p.id}.webp`} alt={`${p.id} cover made by cover-studio from ${p.site}`} className="block aspect-[4/3] w-full rounded-tile object-cover" />
              <div className="mt-4 flex items-baseline gap-3">
                <span className="label text-cobalt">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[22px] font-[900] tracking-[-0.03em]">{p.id}</span>
                <span className="label ml-auto text-mute">{p.site}</span>
              </div>
              <p className="mt-1 text-[15px] leading-[1.5] text-ink-2">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 05 Every size: three real outputs at their true shapes ---------------------- */

const SIZES = [
  { id: "4x3", l: "1600 × 1200", u: "Dribbble, Contra" },
  { id: "16x9", l: "1600 × 900", u: "Slides, video" },
  { id: "og", l: "1200 × 630", u: "Link previews" },
];

function SizeFigure({ s }: { s: (typeof SIZES)[number] }) {
  return (
    <figure className="sz m-0 min-w-0">
      <img src={`/covers/s-${s.id}.webp`} alt={`The same cover at ${s.l}`} className="block w-full rounded-tile" />
      <figcaption className="label mt-3 flex h-5 items-center gap-2">
        <span className="font-medium">{s.l}</span>
        <span className="text-mute">{s.u}</span>
      </figcaption>
    </figure>
  );
}

export function Sizes() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".sz img", { opacity: 0, scale: 0.94, duration: 1.3, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".sz-row", start: "top 80%" } });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="wrap section">
      <Head eyebrow="05 · Every size" title="One render, three sizes.">
        Each size is laid out for its own shape, so nothing is squeezed or cut off. Shown here: Lune, a hotel site designed by Raja.
      </Head>
      {/* Column widths are set so the large cover and the stacked pair end on the same line. */}
      <div className="sz-row mt-14 grid gap-6 md:grid-cols-[1.636fr_1fr] md:items-start">
        <SizeFigure s={SIZES[0]} />
        <div className="grid gap-6">
          <SizeFigure s={SIZES[1]} />
          <SizeFigure s={SIZES[2]} />
        </div>
      </div>
    </section>
  );
}

/* 06 Make it yours: one cover, six grounds ----------------------------------- */

const GROUNDS = [
  { id: "light", l: "Light" },
  { id: "dark", l: "Dark" },
  { id: "tint", l: "Tint" },
  { id: "radial", l: "Gradient with rings" },
  { id: "photo", l: "Your own photo" },
  { id: "grid", l: "Dark with grid" },
];

export function Grounds() {
  const root = useRef<HTMLElement>(null);
  const [on, setOn] = useState(0);
  useRise(root);
  const pick = (i: number) => {
    if (i === on) return;
    const prev = on;
    setOn(i);
    const scope = root.current;
    if (!scope) return;
    const imgs = gsap.utils.toArray<HTMLElement>(".gr", scope);
    gsap.killTweensOf(imgs);
    // Every image is reset on each pick, so the stack never ends up stuck on one ground.
    imgs.forEach((el, k) => gsap.set(el, { zIndex: k === i ? 2 : k === prev ? 1 : 0, opacity: k === i || k === prev ? 1 : 0, scale: 1 }));
    if (reduced()) {
      gsap.set(imgs[prev], { opacity: 0 });
      return;
    }
    gsap.fromTo(imgs[i], { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.7, ease: "expo.out", onComplete: () => { gsap.set(imgs[prev], { opacity: 0 }); } });
  };
  return (
    <section ref={root} className="wrap section">
      <Head eyebrow="06 · Make it yours" title="One cover, any ground.">
        Choose from 11 ground types, from flat colour to gradients, tints and your own photos. Add one of 5 overlays. Light or dark.
      </Head>
      <div className="mt-14 grid gap-x-8 gap-y-6 lg:grid-cols-12 lg:items-start">
        <div data-clip className="relative aspect-[4/3] overflow-hidden rounded-card bg-ink/5 lg:col-span-8">
          {GROUNDS.map((g, i) => (
            <img key={g.id} src={`/grounds/${g.id}.webp`} alt={`The same cover on the ${g.l.toLowerCase()} ground`}
              style={{ opacity: i === 0 ? 1 : 0 }} aria-hidden={on !== i}
              className="gr pointer-events-none absolute inset-0 h-full w-full object-cover" />
          ))}
        </div>
        <div className="max-lg:order-first lg:col-span-4">
          <p className="eyebrow">Six of the 11 grounds</p>
          <div role="group" aria-label="Ground" className="mt-4 flex flex-wrap gap-2 lg:flex-col">
            {GROUNDS.map((g, i) => (
              <button key={g.id} type="button" onClick={() => pick(i)} aria-pressed={on === i}
                className={`flex cursor-pointer items-center justify-between gap-6 rounded-full px-5 py-3 text-left text-[15px] font-medium transition-colors lg:rounded-inner lg:py-3.5 ${on === i ? "bg-ink text-white" : "bg-ink/5 hover:bg-ink/10"}`}>
                {g.l}
                <span aria-hidden="true" className={`label max-lg:hidden ${on === i ? "text-white/70" : "text-mute"}`}>0{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 07 Mobile: Ostler ----------------------------------------------------------- */

const SCREENS = ["driver-light-00", "driver-light-04", "driver-light-05", "manager-light-04"];

export function Phones() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".ph", { y: 220, rotate: (i) => [-6, -2, 3, 7][i], opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".ph-row", start: "top 85%" } });
      gsap.utils.toArray<HTMLElement>(".ph img").forEach((el, i) => {
        gsap.to(el, { y: [-40, 24, -24, 40][i], ease: "none", scrollTrigger: { trigger: ".ph-row", start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="section mt-[clamp(96px,11vw,160px)] overflow-hidden bg-night pb-[clamp(96px,11vw,160px)] text-paper">
      <div className="wrap">
        <Head dark eyebrow="07 · Mobile" title="Real phones. Real screens.">
          Phone screens are captured at each device&apos;s true viewport, in light and dark. These are from Ostler, a fleet van rental app designed by Raja.
        </Head>
        <div className="ph-row mt-16 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-8">
          {SCREENS.map((s, i) => (
            <div key={s} className={`ph ${i % 2 ? "md:mt-24" : ""}`}>
              <img src={`/ostler/${s}.webp`} alt={`Ostler app screen ${i + 1} in an iPhone frame`} className="block w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 08 Open source -------------------------------------------------------------- */

const BOX = [
  { n: "18", t: "Tested patterns", c: "bg-lilac" },
  { n: "7", t: "Device frames", c: "bg-mint" },
  { n: "3", t: "Sizes per render", c: "bg-sky" },
  { n: "11", t: "Ground types", c: "bg-sky" },
  { n: "5", t: "Overlays", c: "bg-lilac" },
  { n: "2", t: "Themes", c: "bg-mint" },
];

const DOCS = [
  ["README", `${REPO}#readme`],
  ["Config reference", `${REPO}/blob/main/docs/config.md`],
  ["Pattern specs", `${REPO}/blob/main/docs/patterns.md`],
  ["MIT licence", `${REPO}/blob/main/LICENSE`],
  ["Issues", `${REPO}/issues`],
];

export function OpenSource() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  return (
    <section id="open-source" ref={root} className="wrap section">
      <div className="grid gap-x-8 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Head eyebrow="08 · Open source" title="Free and open source.">
            MIT licence, yours to change. It needs Node 20 and Chrome, nothing else. No account, no API key, no server.
          </Head>
          <div data-rise-group>
            <a href={REPO} className="rise group mt-10 block max-w-[440px] rounded-tile border border-line p-6 transition-colors hover:border-ink">
              <span className="label flex items-center gap-3">
                <GitHubMark size={20} />
                rx4u / cover-studio
                <span aria-hidden="true" className="ml-auto transition-transform group-hover:translate-x-1">→</span>
              </span>
              <span className="body mt-4 block">Presentation covers and device mockups from your live design.</span>
              <span className="mt-5 flex flex-wrap gap-2 font-mono text-[12px]">
                {["MIT", "TypeScript", "Node 20", "Playwright"].map((t) => (
                  <span key={t} className="rounded-full bg-ink/5 px-3 py-1.5">{t}</span>
                ))}
              </span>
            </a>
          </div>
        </div>
        <div data-rise-group className="lg:col-span-6 lg:col-start-7">
          <ul className="grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3">
            {BOX.map((b) => (
              <li key={b.t} className={`rise ${b.c} flex min-h-[168px] flex-col justify-between rounded-tile p-6`}>
                <span data-count={b.n} className="display block text-[56px] leading-[0.85]">{b.n}</span>
                <span className="mt-6 block text-[15px] leading-[1.35] font-medium">{b.t}</span>
              </li>
            ))}
          </ul>
          <ul className="rise label mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {DOCS.map(([l, h]) => (
              <li key={l}><a href={h} className="link hover:text-cobalt">{l}</a></li>
            ))}
          </ul>
          <p className="rise mt-6 max-w-[520px] text-[14px] leading-[1.6] text-mute">
            Device frames come from react-mockframe (MIT). Status bar icons come from Ionicons and Material Icons.
          </p>
        </div>
      </div>
    </section>
  );
}

/* 09 About -------------------------------------------------------------------- */

const LINKS = [
  ["Portfolio", "https://rajaraman.vercel.app/"],
  ["Dribbble", "https://dribbble.com/raja-raman"],
  ["X", "https://x.com/1bsfraja"],
  ["GitHub", "https://github.com/rx4u"],
];

export function About() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  return (
    <section id="about" ref={root} className="wrap section">
      <div data-rise-group data-clip className="grid gap-x-8 gap-y-10 rounded-card bg-lilac p-8 sm:p-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow rise text-ink-2">09 · About</p>
          <h2 className="h2 split mt-5 text-[clamp(36px,4.6vw,56px)]">{"Made by\u00a0Raja."}</h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="rise max-w-[560px] text-[clamp(18px,1.5vw,20px)] leading-[1.5]">
            I&apos;m a product designer with 18 years across enterprise AI, SaaS, fintech and logistics. I design and build new concepts most weeks, and each one needs covers before I can post it.
          </p>
          <p className="rise body mt-5 max-w-[560px]">
            I kept rebuilding the same frames by hand, size after size. cover-studio is the tool I made to stop. It is free and open source.
          </p>
          <p className="rise body mt-4 max-w-[560px]">
            Everything shown on this page is my own work: Aequor, Haven and Lune on the web, Ostler on the phone.
          </p>
          <div className="rise mt-8">
            <a href={CONTRA} className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-cobalt">
              Hire me on Contra
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
          <ul className="rise mt-4 flex flex-wrap gap-2">
            {LINKS.map(([l, h]) => (
              <li key={l}><a href={h} className="inline-block rounded-full bg-paper/70 px-5 py-2.5 text-[15px] font-medium transition-colors hover:bg-ink hover:text-paper">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Closing --------------------------------------------------------------------- */

const START = [
  "git clone https://github.com/rx4u/cover-studio",
  "cd cover-studio && npm install",
  "npm run cover -- init my-design",
  "npm run cover -- render cover.config.ts",
];

export function Closing() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  return (
    <section ref={root} data-clip="flat" className="mt-[clamp(96px,11vw,160px)] bg-cobalt text-white">
      <div className="wrap grid gap-x-8 gap-y-12 py-24 lg:grid-cols-12 lg:items-center lg:py-32">
        <div data-rise-group className="lg:col-span-6">
          <h2 className="h2 split text-[clamp(44px,6.4vw,80px)]">Make your next cover.</h2>
          <p className="rise mt-6 max-w-[440px] text-[clamp(17px,1.4vw,19px)] leading-[1.55] text-white/90">
            Clone it, point it at your live design and render. The first covers are a few minutes away.
          </p>
          <a href={REPO} className="rise mt-9 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[16px] font-semibold text-ink transition-colors hover:bg-white/85">
            <GitHubMark size={18} />
            Get it on GitHub
          </a>
        </div>
        <div data-rise-group className="min-w-0 lg:col-span-6">
          <div className="rise">
            <Terminal lines={START} />
          </div>
        </div>
      </div>
      <footer className="border-t border-white/20">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-8 text-[14px] text-white/90">
          <Logo light />
          <p>Designed and built by Raja. MIT licence.</p>
          <ul className="flex gap-6">
            <li><a href={REPO} className="link text-white">GitHub</a></li>
            <li><a href={CONTRA} className="link text-white">Hire Raja on Contra</a></li>
          </ul>
        </div>
      </footer>
    </section>
  );
}
