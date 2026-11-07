"use client";
// Opening scene: the gold line-work draws the Damascene star and the calligraphic mark is traced then filled (GSAP),
// while the copy rises in with plain CSS (no wait for JavaScript, so the text is on screen at once).
// Scrolling away turns the star and lifts the copy.
import { useLayoutEffect, useRef } from "react";
import type { Content } from "@/lib/content";
import { gsap, markAnimated } from "@/lib/gsap";
import { Emblem } from "./Brand";
import { Arrow, Whatsapp } from "./Icons";

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

export default function Hero({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const t = c.t.hero;

  useLayoutEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      markAnimated();
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
      tl.fromTo(q(".st-line"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.8, stagger: 0.14, ease: "power2.inOut" }, 0)
        .fromTo(q(".st-dot"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(2.2)" }, 1.2)
        .fromTo(q(".emblem .mk path"), { drawSVG: "0%", fillOpacity: 0, strokeOpacity: 1 },
          { drawSVG: "100%", duration: 1.3, stagger: 0.045, ease: "power1.inOut" }, 0.35)
        .to(q(".emblem .mk path"), { fillOpacity: 1, duration: 0.7, stagger: 0.03, ease: "power1.out" }, 1.45)
        .to(q(".emblem .mk path"), { strokeOpacity: 0, duration: 0.5 }, 2.2)
        .fromTo(q(".cue"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.6)
        .fromTo(q(".cue-line"), { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.9, ease: "power2.inOut" }, 2.0);
      gsap.set(q("[data-pre]"), { visibility: "visible" });

      // leaving the hero: the star keeps turning with the scroll, the copy lifts and fades
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to(q(".emblem .star"), { rotation: 45, svgOrigin: "300 300", ease: "none", scrollTrigger: st });
      gsap.to(q(".hero-art"), { yPercent: 14, ease: "none", scrollTrigger: st });
      gsap.to(q(".hero-copy"), { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { ...st, start: "top+=10% top" } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="kicker" data-hr style={d(0.05)}>
            <span className="kicker-line" aria-hidden="true" />
            {t.kicker}
          </p>
          <h1 className="h1" id="hero-title">
            <span className="ln"><span className="ln-in" style={d(0.1)}>{t.title1}</span></span>
            <span className="ln">
              <span className="ln-in" style={d(0.2)}>
                {t.title2} <em>{t.titleGold}</em>
              </span>
            </span>
          </h1>
          <p className="pillars" data-hr style={d(0.45)}>{t.pillars}</p>
          <p className="lead" data-hr style={d(0.55)}>{t.lead}</p>
          <div className="ctas" data-hr style={d(0.7)}>
            {c.links.register ? (
              <a className="btn btn-gold" href={c.links.register} target="_blank" rel="noopener">
                {t.ctaCourse}
                <Arrow className="ic flip" />
              </a>
            ) : (
              <a className="btn btn-gold" href={`/${c.lang}/courses/`}>
                {t.ctaBrowse}
                <Arrow className="ic flip" />
              </a>
            )}
            <a className="btn btn-line" href={c.links.whatsappProject} target="_blank" rel="noopener">
              <Whatsapp className="ic" />
              {t.ctaProject}
            </a>
          </div>
        </div>
        <div className="hero-art" data-pre>
          <Emblem />
        </div>
      </div>
      <a className="cue" href="#story">
        <span>{t.scroll}</span>
        <span className="cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}
