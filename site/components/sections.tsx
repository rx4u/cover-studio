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

/* 01 Why ------------------------------------------------------------------ */

const WHY = [
  { bg: "bg-lilac", n: "01", t: "A screenshot is not a cover.", d: "A raw capture sits next to designed posts and looks unfinished. The work deserves a frame." },
  { bg: "bg-mint", n: "02", t: "Every channel wants another size.", d: "4:3 for Dribbble, 16:9 for slides, 1.91:1 for link previews. Rebuilding each one by hand eats the afternoon." },
  { bg: "bg-sky", n: "03", t: "Mockup tools make things up.", d: "Stock scenes, placeholder text, a device you do not ship on. cover-studio only uses what is on your site." },
];

export function Why() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".why-card", {
        y: 140,
        rotate: (i) => [-4, 2, 5][i],
        opacity: 0,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".why-grid", start: "top 80%" },
      });
    },
    { scope: root },
  );
  return (
    <section id="why" ref={root} className="wrap pt-32 sm:pt-40">
      <Head eyebrow="01 · Why it exists" title="Your work is finished. The post is not." />
      <div className="why-grid mt-16 grid gap-4 md:grid-cols-3">
        {WHY.map((w) => (
          <article key={w.n} className={`why-card ${w.bg} flex min-h-[340px] flex-col justify-between rounded-[28px] p-8`}>
            <span className="font-mono text-[13px]">{w.n}</span>
            <div>
              <h3 className="display text-[34px] leading-[0.98]">{w.t}</h3>
              <p className="mt-4 text-[16px] leading-[1.55] text-ink-2">{w.d}</p>
            </div>
          </article>
        ))}
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

/* 03 Patterns teaser -------------------------------------------------------- */

const PATTERNS = [
  { id: "bento", d: "Hero, phone, photos and a component on one grid" },
  { id: "floating", d: "Phone and desktop as one overlapping group" },
  { id: "phone-trio", d: "Three phones, mixed models, real system UI" },
  { id: "cascade", d: "Three sections layered off the edge" },
  { id: "overview-grid", d: "The whole site as a staggered mosaic" },
  { id: "tilt", d: "The mosaic, turned and leaning back" },
];

export function Patterns() {
  const root = useRef<HTMLElement>(null);
  const [on, setOn] = useState(0);
  useRise(root);
  const show = (i: number) => {
    if (i === on) return;
    setOn(i);
    if (reduced()) return;
    gsap.fromTo(`.pat-img-${i}`, { opacity: 0, scale: 1.04, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "expo.out" });
  };
  return (
    <section id="patterns" ref={root} className="wrap pt-32 sm:pt-40">
      <Head eyebrow="03 · Patterns" title="Eighteen layouts, measured from the best." line="Each one is taken from a reference cover and built in proportions of the canvas. Here are six." />
      <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-center">
        <ul data-rise-group className="lg:col-span-5">
          {PATTERNS.map((p, i) => (
            <li key={p.id} className="rise border-t border-line last:border-b">
              <button
                type="button"
                onMouseEnter={() => show(i)}
                onFocus={() => show(i)}
                onClick={() => show(i)}
                aria-pressed={on === i}
                className="group flex w-full cursor-pointer items-baseline gap-5 py-5 text-left"
              >
                <span className={`font-mono text-[12px] transition-colors ${on === i ? "text-cobalt" : "text-mute"}`}>P{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className={`display block text-[30px] transition-transform duration-500 ${on === i ? "translate-x-2" : ""}`}>{p.id}</span>
                  <span className={`mt-1 block text-[15px] text-ink-2 transition-opacity ${on === i ? "opacity-100" : "opacity-60"}`}>{p.d}</span>
                </span>
                <span aria-hidden="true" className={`text-[22px] transition-all duration-500 ${on === i ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}>→</span>
              </button>
            </li>
          ))}
          <li className="rise pt-6">
            <a href={`${REPO}/blob/main/docs/patterns.md`} className="font-mono text-[14px] underline decoration-ink/30 underline-offset-4 hover:text-cobalt">
              And twelve more in the docs
            </a>
          </li>
        </ul>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] lg:col-span-7">
          {PATTERNS.map((p, i) => (
            <img
              key={p.id}
              src={`/covers/p-${p.id}.webp`}
              alt={`${p.id} cover made by cover-studio`}
              className={`pat-img-${i} absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${on === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* 04 Sizes ---------------------------------------------------------------- */

const SIZES = [
  { id: "4x3", r: 4 / 3, l: "1600 × 1200", u: "Dribbble, Contra" },
  { id: "16x9", r: 16 / 9, l: "1600 × 900", u: "Slides, video" },
  { id: "og", r: 1200 / 630, l: "1200 × 630", u: "Link previews" },
];

export function Sizes() {
  const root = useRef<HTMLElement>(null);
  useRise(root);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const box = root.current!.querySelector<HTMLElement>(".size-box")!;
        const H = () => box.offsetWidth / (4 / 3);
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".size-pin", start: "top top", end: "+=1800", pin: true, scrub: 0.8, invalidateOnRefresh: true } });
        tl.to(box, { height: () => box.offsetWidth / (16 / 9), duration: 1, ease: "power2.inOut" }, 0.3)
          .to(".size-img-0", { opacity: 0, duration: 0.3 }, 0.6)
          .to(".size-img-1", { opacity: 1, duration: 0.3 }, 0.6)
          .to(".size-lab-0", { opacity: 0.3, duration: 0.2 }, 0.6)
          .to(".size-lab-1", { opacity: 1, duration: 0.2 }, 0.6)
          .to(box, { height: () => box.offsetWidth / (1200 / 630), duration: 1, ease: "power2.inOut" }, 1.6)
          .to(".size-img-1", { opacity: 0, duration: 0.3 }, 1.9)
          .to(".size-img-2", { opacity: 1, duration: 0.3 }, 1.9)
          .to(".size-lab-1", { opacity: 0.3, duration: 0.2 }, 1.9)
          .to(".size-lab-2", { opacity: 1, duration: 0.2 }, 1.9)
          .to({}, { duration: 0.6 });
        gsap.set(box, { height: H() });
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="pt-32 sm:pt-40">
      <div className="wrap">
        <Head eyebrow="04 · Every size" title="Laid out again, never cropped." line="The same cover, recomposed for each channel's canvas." />
      </div>
      <div className="size-pin">
        <div className="wrap flex flex-col items-center gap-8 py-14 md:min-h-screen md:justify-center">
          <div className="size-box relative aspect-[4/3] w-full max-w-[980px] overflow-hidden rounded-[22px] bg-night md:aspect-auto">
            {SIZES.map((s, i) => (
              <img key={s.id} src={`/covers/s-${s.id}.webp`} alt={`The floating cover at ${s.l}`} className={`size-img-${i} absolute inset-0 h-full w-full object-cover ${i === 0 ? "opacity-100" : "opacity-0"}`} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 font-mono text-[13px]">
            {SIZES.map((s, i) => (
              <p key={s.id} className={`size-lab-${i} ${i === 0 ? "" : "md:opacity-30"}`}>
                <span className="font-medium">{s.l}</span> <span className="text-mute">· {s.u}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 05 Phones (Ostler) -------------------------------------------------------- */

const SCREENS = {
  light: ["driver-light-00", "driver-light-04", "driver-light-05", "manager-light-04"],
  dark: ["driver-dark-00", "driver-dark-04", "driver-dark-05", "manager-dark-04"],
};

export function Phones() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"light" | "dark">("light");
  useRise(root);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".ph", {
        y: 200,
        rotate: (i) => [-6, -2, 3, 7][i],
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".ph-row", start: "top 85%" },
      });
      gsap.utils.toArray<HTMLElement>(".ph").forEach((el, i) => {
        gsap.to(el, { y: [-40, 30, -20, 40][i], ease: "none", scrollTrigger: { trigger: ".ph-row", start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );
  const flip = (m: "light" | "dark") => {
    if (m === mode) return;
    if (reduced()) return setMode(m);
    gsap.to(".ph img", {
      rotateY: 90,
      duration: 0.25,
      ease: "power2.in",
      stagger: 0.05,
      onComplete: () => {
        setMode(m);
        gsap.fromTo(".ph img", { rotateY: -90 }, { rotateY: 0, duration: 0.45, ease: "expo.out", stagger: 0.05 });
      },
    });
  };
  return (
    <section ref={root} className="bg-night pt-32 pb-36 text-paper sm:pt-40">
      <div className="wrap">
        <div data-rise-group className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-[760px]">
            <p className="eyebrow rise !text-white/55">05 · Mobile, too</p>
            <h2 className="display rise mt-5 text-[48px] sm:text-[64px]">Phones at their real size, with their real screens.</h2>
            <p className="rise mt-6 max-w-[600px] text-[19px] leading-[1.55] text-white/70">
              Phone screens are captured at each device&apos;s true viewport, light and dark. These are from Ostler, a fleet van rental app.
            </p>
          </div>
          <div role="group" aria-label="Screen theme" className="rise flex gap-1 rounded-full p-1 ring-1 ring-white/20">
            {(["light", "dark"] as const).map((m) => (
              <button key={m} type="button" onClick={() => flip(m)} aria-pressed={mode === m} className={`cursor-pointer rounded-full px-5 py-2.5 text-[14px] font-medium capitalize ${mode === m ? "bg-paper text-ink" : "text-white/70 hover:text-white"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="ph-row mt-20 grid grid-cols-2 gap-6 [perspective:1400px] md:grid-cols-4">
          {SCREENS[mode].map((s, i) => (
            <div key={i} className={`ph ${i % 2 ? "md:mt-24" : ""}`}>
              <img src={`/ostler/${s}.webp`} alt={`Ostler app screen ${i + 1}`} className="block w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)]" />
            </div>
          ))}
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
          <p className="eyebrow rise !text-ink-2">06 · About</p>
          <h2 className="display rise mt-5 text-[44px] sm:text-[56px]">Made by Rajaraman Arumugam.</h2>
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
