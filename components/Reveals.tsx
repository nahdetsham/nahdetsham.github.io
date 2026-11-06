"use client";
// Page-wide entrances: every [data-reveal] element rises in, and every .draw path (gold line-work) draws itself.
// What is already on screen when the page opens animates straight away; the rest waits until it is scrolled to.
// Pinned scenes animate their own parts. Triggers here use refreshPriority -1, so they are measured after the
// pinned scenes have added their scroll length (otherwise everything below a pin would fire too early).
import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger, markAnimated } from "@/lib/gsap";

const RISE = { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true } as const;

export default function Reveals() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      markAnimated();
      const onScreen = (e: Element) => e.getBoundingClientRect().top < window.innerHeight * 0.92;

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const now = items.filter(onScreen);
      if (now.length) gsap.fromTo(now, { opacity: 0, y: 30 }, { ...RISE, delay: 0.1 });

      // elements entering in the same frame rise together, one after another
      let queue: HTMLElement[] = [];
      const flush = () => {
        gsap.fromTo(queue, { opacity: 0, y: 30 }, RISE);
        queue = [];
      };
      items.filter((e) => !now.includes(e)).forEach((e) =>
        ScrollTrigger.create({
          trigger: e, start: "top 90%", once: true, refreshPriority: -1,
          onEnter: () => {
            if (!queue.length) requestAnimationFrame(flush);
            queue.push(e);
          },
        }),
      );

      gsap.utils.toArray<SVGGeometryElement>(".draw").forEach((el) => {
        const v = { drawSVG: "100%", duration: 1.4, ease: "power2.inOut" };
        if (onScreen(el)) gsap.fromTo(el, { drawSVG: "0%" }, { ...v, duration: 1.8, delay: 0.1 });
        else gsap.fromTo(el, { drawSVG: "0%" }, { ...v, scrollTrigger: { trigger: el, start: "top 90%", once: true, refreshPriority: -1 } });
      });
    });
    return () => mm.revert();
  }, []);
  return null;
}
