"use client";
// "We teach · We build · We design": on wide screens three full-width panels slide sideways while the page
// scrolls (towards the reading direction), each drawing its own gold line-work; on phones they stack.
import { useLayoutEffect, useRef } from "react";
import type { Content } from "@/lib/content";
import { gsap } from "@/lib/gsap";

const ART: Record<string, string[]> = {
  // open book with lines of text
  teach: [
    "M100 58C80 46 50 44 22 50V154C50 148 80 150 100 162C120 150 150 148 178 154V50C150 44 120 46 100 58Z",
    "M100 58V162",
    "M38 74C56 71 72 72 86 78M38 96C56 93 72 94 86 100M38 118C56 115 72 116 86 122",
    "M114 78C128 72 144 71 162 74M114 100C128 94 144 93 162 96M114 122C128 116 144 115 162 118",
  ],
  // </> brackets inside a diamond
  build: ["M100 8L192 100L100 192L8 100Z", "M74 62L40 100L74 138", "M126 62L160 100L126 138", "M112 52L88 148"],
  // pen nib over the eight-point star
  design: [
    "M100 20L156.6 43.4L180 100L156.6 156.6L100 180L43.4 156.6L20 100L43.4 43.4Z",
    "M100 48L132 108L100 160L68 108Z",
    "M100 160V118",
    "M100 106a8 8 0 1 0 0.01 0",
  ],
};

export default function Pillars({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const t = c.t.pillars;

  useLayoutEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      el.classList.add("is-pinned");
      const track = q(".pl-track")[0] as HTMLElement;
      const rtl = document.documentElement.dir === "rtl";
      const dist = () => track.scrollWidth - window.innerWidth;
      const arts = q(".pl-panel").map((p) => (p as HTMLElement).querySelectorAll(".pl-draw"));
      gsap.fromTo(arts[0], { drawSVG: "0%" }, {
        drawSVG: "100%", duration: 1.6, stagger: 0.18, ease: "power2.inOut",
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: () => "+=" + dist() * 1.2, pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      tl.to(track, { x: () => (rtl ? dist() : -dist()), ease: "none", duration: 2 }, 0);
      [1, 2].forEach((i) => {
        tl.fromTo(arts[i], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.45, stagger: 0.06, ease: "power1.inOut" }, i - 0.45);
        tl.fromTo(q(`.pl-panel:nth-child(${i + 1}) .pl-copy > *`), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 }, i - 0.35);
      });
      return () => el.classList.remove("is-pinned");
    });

    mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      q(".pl-panel").forEach((p) => {
        gsap.fromTo((p as HTMLElement).querySelectorAll(".pl-draw"), { drawSVG: "0%" }, {
          drawSVG: "100%", duration: 1.3, stagger: 0.15, ease: "power2.inOut",
          scrollTrigger: { trigger: p, start: "top 80%", once: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="pillars" id="services" ref={root} aria-label={t.title}>
      <div className="pl-track">
        {t.items.map((p, i) => (
          <article className="pl-panel" key={p.id}>
            <div className="wrap pl-inner">
              <div className="pl-art" aria-hidden="true">
                <span className="pl-num">0{i + 1}</span>
                <svg viewBox="0 0 200 200">
                  {ART[p.id].map((d, k) => (
                    <path key={k} className="pl-draw" d={d} />
                  ))}
                </svg>
              </div>
              <div className="pl-copy">
                <h3 className="pl-title">{p.title}</h3>
                <p className="pl-text">{p.text}</p>
                <ul className="pl-points">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
