"use client";
// "Our story": on wide screens the section pins and the three lines take turns while the code types itself;
// on phones the lines stack and the code types once when it comes into view.
import { useLayoutEffect, useRef } from "react";
import type { Content } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { typingUnits } from "@/lib/code";
import { Ellipsis } from "./SectionHead";

export default function Story({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const t = c.t.story;
  const units = typingUnits(t.code);

  useLayoutEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      el.classList.add("is-pinned");
      const lines = q(".story-line");
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=240%", pin: true, scrub: 0.6, anticipatePin: 1 },
      });
      tl.fromTo(lines[0], { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.4 }, 0)
        .fromTo(q(".sp-line"), { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration: 3 }, 0)
        .fromTo(q(".ch"), { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 2.6 / units.length, ease: "none" }, 0.2)
        .to(lines[0], { opacity: 0, yPercent: -40, duration: 0.4 }, 0.9)
        .fromTo(lines[1], { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.4 }, 1.1)
        .to(lines[1], { opacity: 0, yPercent: -40, duration: 0.4 }, 1.9)
        .fromTo(lines[2], { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.4 }, 2.1)
        .fromTo(q(".story-sub"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4 }, 2.4)
        .fromTo(q(".sp-gem"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.15, stagger: 1, ease: "back.out(2)" }, 0.05)
        .to({}, { duration: 0.4 });
      return () => el.classList.remove("is-pinned");
    });

    mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(q(".story-line, .story-sub"), { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: q(".story-lines")[0], start: "top 85%", once: true },
      });
      gsap.fromTo(q(".ch"), { opacity: 0 }, {
        opacity: 1, duration: 0.01, stagger: 1.8 / units.length, ease: "none",
        scrollTrigger: { trigger: q(".code-win")[0], start: "top 80%", once: true },
      });
    });
    return () => mm.revert();
  }, [units.length]);

  return (
    <section className="story" id="story" ref={root} aria-labelledby="story-title">
      <div className="wrap story-grid">
        <div className="story-text">
          <p className="kicker" id="story-title">
            <span className="kicker-line" aria-hidden="true" />
            {t.kicker}
          </p>
          <div className="story-body">
            <svg className="story-prog" viewBox="0 0 24 300" aria-hidden="true">
              <path className="sp-track" d="M12 6V294" />
              <path className="sp-line" d="M12 6V294" />
              {[6, 150, 294].map((y) => (
                <path key={y} className="sp-gem" d={`M12 ${y - 7}l7 7-7 7-7-7z`} />
              ))}
            </svg>
            <div className="story-lines">
              {t.lines.map((l, i) => (
                <p className="story-line" key={i}>
                  <Ellipsis text={l} />
                </p>
              ))}
            </div>
          </div>
          <p className="story-sub">{t.sub}</p>
        </div>
        <div className="story-code">
          <div className="code-win">
            <div className="code-bar" dir="ltr">
              <i /><i /><i />
              <span>{t.file}</span>
            </div>
            <pre dir="ltr">
              <span className="sr-only">{t.code}</span>
              <code aria-hidden="true">
                {units.map((u, i) => (
                  <span key={i} className={`ch${u.c ? " t-" + u.c : ""}`}>{u.t}</span>
                ))}
                <span className="caret" />
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
