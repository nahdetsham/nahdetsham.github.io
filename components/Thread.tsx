"use client";
// The gold thread: a line that draws itself as the page scrolls past, ending in a small diamond.
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Thread({ children, id }: { children?: React.ReactNode; id?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: 0.5 } });
      tl.fromTo(q(".thread-line"), { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration: 1 })
        .fromTo(q(".thread-gem"), { scale: 0, rotation: -90, svgOrigin: "20 392" }, { scale: 1, rotation: 0, duration: 0.25, ease: "back.out(2)" }, 0.85)
        .fromTo(q(".thread-body > *"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.3 }, 0.8);
    });
    return () => mm.revert();
  }, []);
  return (
    <div className="thread" id={id} ref={root}>
      <svg className="thread-svg" viewBox="0 0 40 410" aria-hidden="true">
        <path className="thread-line" d="M20 0V376" />
        <path className="thread-gem" d="M20 378l12 14-12 14-12-14z" />
      </svg>
      {children ? <div className="thread-body">{children}</div> : null}
    </div>
  );
}
