"use client";
// "How we work": four steps on one gold line that draws itself across, each diamond lighting up in turn.
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Steps({ title, steps }: { title: string; steps: { title: string; text: string }[] }) {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: q(".st-row")[0], start: "top 80%", once: true } });
      tl.fromTo(q(".st-rail"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .fromTo(q(".st-gem"), { scale: 0, rotation: -45 }, { scale: 1, rotation: 45, duration: 0.5, stagger: 0.4, ease: "back.out(2)" }, 0.1)
        .fromTo(q(".st-step > div"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.4, ease: "power3.out" }, 0.25);
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="steps" ref={root} aria-labelledby="steps-title">
      <div className="wrap">
        <h2 className="h2 st-title" id="steps-title" data-reveal>{title}</h2>
        <div className="st-wrap">
        <span className="st-rail" aria-hidden="true" />
        <ol className="st-row">
          {steps.map((s, i) => (
            <li className="st-step" key={s.title}>
              <span className="st-gem" aria-hidden="true" />
              <div>
                <span className="st-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
