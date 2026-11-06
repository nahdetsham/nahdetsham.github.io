"use client";
// SHAM UNITY: the section pins and scrolling walks through the app like the trailer does: a gold tap on the
// icon, the header changes, the new screen slides in, and the matching feature lights up in the list.
import { useLayoutEffect, useRef } from "react";
import type { Content } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { Whatsapp } from "./Icons";

// icon centres on the 420 x 500 flat screen (D:\Nahdet\_source\_work\phone_html.py)
const ICON_X = [55.2, 133.7, 214.5, 297.5, 375.0];
const ICON_Y = 77.0;

export default function Work({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const t = c.t.work;

  useLayoutEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.classList.add("is-pinned");
      const hd = q(".ph-hd"), bd = q(".ph-bd"), tap = q(".ph-tap"), li = q(".wk-feat li");
      gsap.set(hd.slice(1), { autoAlpha: 0 });
      gsap.set(bd.slice(1), { xPercent: -100, autoAlpha: 0 });
      // the feature list follows the timeline's playhead (a screen switches at n - 0.05)
      let on = -1;
      const mark = (time: number) => {
        const n = [1, 2, 3, 4].filter((k) => time >= k - 0.05).length;
        if (n === on) return;
        on = n;
        li.forEach((x, k) => x.classList.toggle("is-on", k === n));
      };
      mark(0);
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onUpdate: () => mark(tl.time()),
        scrollTrigger: { trigger: el, start: "top top", end: "+=260%", pin: true, scrub: 0.5, anticipatePin: 1 },
      });
      tl.fromTo(q(".ph"), { rotation: -2, y: 40 }, { rotation: 1, y: 0, duration: 4.4, ease: "sine.inOut" }, 0);
      for (let n = 1; n < 5; n++) {
        const at = n - 0.2;
        tl.fromTo(tap[n - 1], { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.12 }, at)
          .to(tap[n - 1], { autoAlpha: 0, scale: 1.7, duration: 0.3 }, at + 0.12)
          .to(hd[n], { autoAlpha: 1, duration: 0.2 }, at + 0.1)
          .set(hd[n - 1], { autoAlpha: 0 }, at + 0.32)
          .fromTo(bd[n], { xPercent: -100, autoAlpha: 1 }, { xPercent: 0, duration: 0.4, ease: "power3.inOut" }, at + 0.1)
          .to(bd[n - 1], { xPercent: 30, autoAlpha: 0, duration: 0.4, ease: "power3.inOut" }, at + 0.1);
      }
      tl.to({}, { duration: 0.6 });
      return () => {
        el.classList.remove("is-pinned");
        li.forEach((x) => x.classList.remove("is-on"));
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="work" id="work" ref={root} aria-labelledby="work-title">
      <div className="wrap wk-grid">
        <div className="wk-copy">
          <p className="kicker" data-reveal>
            <span className="kicker-line" aria-hidden="true" />
            {t.kicker}
          </p>
          <h2 className="h2 wk-title" id="work-title" dir="ltr" data-reveal>{t.title}</h2>
          <p className="wk-text" data-reveal>{t.text}</p>
          <ol className="wk-feat" data-reveal>
            {t.features.map((f, i) => (
              <li key={f}>
                <span className="wk-n">0{i + 1}</span>
                {f}
              </li>
            ))}
          </ol>
          <a className="btn btn-navy" href={c.links.whatsappProject} target="_blank" rel="noopener" data-reveal>
            <Whatsapp className="ic" />
            {t.cta}
          </a>
        </div>
        <div className="wk-stage">
          <div className="ph" role="img" aria-label={`${t.title}: ${t.features.join("، ")}`}>
            <span className="ph-btn ph-btn-1" />
            <span className="ph-btn ph-btn-2" />
            <span className="ph-btn ph-btn-3" />
            <div className="ph-scr">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="ph-hd" style={{ backgroundImage: `url(/media/app-${i}.webp)` }} />
              ))}
              <div className="ph-bdw">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="ph-bd" style={{ backgroundImage: `url(/media/app-${i}.webp)` }} />
                ))}
              </div>
              {ICON_X.slice(1).map((x, i) => (
                <span key={i} className="ph-tap" style={{ left: `${(x / 420) * 100}%`, top: `calc(var(--sw) * ${ICON_Y / 420})` }} />
              ))}
              <span className="ph-isl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
