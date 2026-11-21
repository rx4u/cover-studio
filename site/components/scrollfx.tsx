"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reduced } from "./motion";

/**
 * Page-wide scroll motion, applied by data attributes and classes so sections stay plain markup:
 * - h2.split: headings break into words that rise out of a mask, staggered, as they enter.
 * - [data-clip]: blocks open from an inset rounded clip to full, scrubbed with the scroll. "flat" ends with square corners.
 * - [data-drift]: elements move against the scroll by the given number of px.
 * - [data-count]: numbers count up from zero when they enter.
 * - .scroll-bar: a cobalt progress line under the header.
 */
export function ScrollFx() {
  useGSAP(() => {
    gsap.to(".scroll-bar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
    if (reduced()) return;

    document.querySelectorAll<HTMLElement>("h2.split").forEach((h) => {
      if (!h.dataset.done) {
        const words = (h.textContent ?? "").trim().split(/[ \n\t]+/); // a non-breaking space keeps two words in one unit
        h.setAttribute("aria-label", words.join(" "));
        h.innerHTML = words
          .map((w) => `<span aria-hidden="true" style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:0.14em;margin-bottom:-0.14em"><span class="w" style="display:inline-block">${w}</span></span>`)
          .join(" ");
        h.dataset.done = "1";
      }
      gsap.from(h.querySelectorAll(".w"), {
        yPercent: 115,
        rotate: 4,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: h, start: "top 88%" },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(8% 6% 8% 6% round 40px)", scale: 0.97 },
        { clipPath: `inset(0% 0% 0% 0% round ${el.dataset.clip === "flat" ? 0 : 28}px)`, scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 100%", end: "top 55%", scrub: 0.6 } },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
      const d = Number(el.dataset.drift) || 60;
      gsap.fromTo(el, { y: d }, { y: -d, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      const o = { v: 0 };
      gsap.to(o, {
        v: end,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => (el.textContent = String(Math.round(o.v))),
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });

    ScrollTrigger.refresh();
  });
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div className="scroll-bar h-full origin-left scale-x-0 bg-mint" />
    </div>
  );
}
