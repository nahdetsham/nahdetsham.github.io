"use client";
// An editor window whose code types itself once when it scrolls into view.
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { typingUnits } from "@/lib/code";

export default function CodeWin({ code, file, title }: { code: string; file: string; title?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const units = typingUnits(code);
  useLayoutEffect(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(el.querySelectorAll(".ch"), { autoAlpha: 0 }, {
        autoAlpha: 1, duration: 0.01, stagger: 1.6 / units.length, ease: "none",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
    return () => mm.revert();
  }, [units.length]);
  return (
    <div className="code-win" ref={root}>
      <div className="code-bar" dir="ltr">
        <i /><i /><i />
        <span>{file}</span>
        {title ? <b>{title}</b> : null}
      </div>
      <pre dir="ltr">
              <span className="sr-only">{code}</span>
              <code aria-hidden="true">
          {units.map((u, i) => (
            <span key={i} className={`ch${u.c ? " t-" + u.c : ""}`}>{u.t}</span>
          ))}
          <span className="caret" />
        </code>
      </pre>
    </div>
  );
}
