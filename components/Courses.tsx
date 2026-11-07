"use client";
// Courses: five rows. On wide screens a phone beside the list plays the film of the row in the middle of the
// screen (or the one under the pointer); on phones each row carries its own film, playing while it is in view.
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/lib/content";
import SectionHead from "./SectionHead";
import Soon from "./Soon";
import { Arrow, Whatsapp } from "./Icons";

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return r;
}

export default function Courses({ c, head = true }: { c: Content; head?: boolean }) {
  const t = c.t.courses;
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [near, setNear] = useState(false);
  const root = useRef<HTMLElement>(null);
  const stageVids = useRef<(HTMLVideoElement | null)[]>([]);
  const reduced = useReducedMotion();

  // which row is in the middle of the screen
  useEffect(() => {
    const rows = root.current!.querySelectorAll<HTMLElement>(".cs-row");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    const sec = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px 0px" });
    sec.observe(root.current!);
    // posters load only when the section gets close (keeps the first page load light)
    const nearIo = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "900px 0px" });
    nearIo.observe(root.current!);
    return () => { io.disconnect(); sec.disconnect(); nearIo.disconnect(); };
  }, []);

  // the stage plays only the active film, and only while the section is on screen
  useEffect(() => {
    if (reduced) return;
    stageVids.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView && getComputedStyle(v).display !== "none") {
        if (v.preload !== "auto") v.preload = "auto";
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [active, inView, reduced]);

  // phones: each row's own film plays while it is mostly visible
  useEffect(() => {
    if (reduced) return;
    const vids = root.current!.querySelectorAll<HTMLVideoElement>(".cs-row-media video");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting && getComputedStyle(v).display !== "none") v.play().catch(() => {});
        else v.pause();
      }),
      { threshold: 0.6 },
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section className={`courses${head ? "" : " courses-flush"}`} id="courses" ref={root} aria-labelledby={head ? "courses-title" : undefined} aria-label={head ? undefined : t.kicker}>
      <div className="wrap">
        {head ? <SectionHead kicker={t.kicker} title={t.title} intro={t.intro} id="courses-title" /> : null}
        <div className="cs-grid">
          <ol className="cs-list">
            {c.courses.map((k, i) => (
              <li
                key={k.id}
                className={`cs-row${i === active ? " is-active" : ""}`}
                data-i={i}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <div className="cs-head" data-reveal>
                  <span className="cs-num">{k.num}</span>
                  <div>
                    <h3 className="cs-title">{k.title}</h3>
                    <p className="cs-level">{k.level}</p>
                  </div>
                </div>
                <div className="cs-row-media">
                  <video src={k.film} poster={near ? k.poster : undefined} muted loop playsInline preload="none" controls={reduced} aria-label={`${t.labels.film}: ${k.short}`} />
                </div>
                <p className="cs-hook" data-reveal>{k.hook}</p>
                <div className="cs-proj" data-reveal>
                  <span>{t.labels.projects}</span>
                  <ul>
                    {k.projects.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="cs-foot" data-reveal>
                  <ul className="cs-tags" dir="ltr">
                    {k.tags.map((tg) => (
                      <li key={tg}>{tg}</li>
                    ))}
                  </ul>
                  <div className="cs-actions">
                    {c.links.register ? (
                      <a className="btn btn-gold btn-sm" href={c.links.register} target="_blank" rel="noopener">
                        {t.labels.register}
                        <Arrow className="ic flip" />
                      </a>
                    ) : (
                      <Soon label={t.labels.soon} small />
                    )}
                    <a className="btn btn-line btn-sm" href={k.ask} target="_blank" rel="noopener">
                      <Whatsapp className="ic" />
                      {t.labels.ask}
                    </a>
                    <a className="cs-more" href={`/${c.lang}/courses/${k.id}/`}>
                      {t.labels.details}
                      <Arrow className="ic flip" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="cs-stage" aria-hidden="true">
            <div className="cs-phone">
              {c.courses.map((k, i) => (
                <video
                  key={k.id}
                  ref={(v) => { stageVids.current[i] = v; }}
                  className={i === active ? "is-on" : ""}
                  src={k.film}
                  poster={near ? k.poster : undefined}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? "metadata" : "none"}
                  tabIndex={-1}
                />
              ))}
              <span className="cs-isl" />
            </div>
            <p className="cs-cap">
              <span>{t.labels.film}</span> {c.courses[active].short}
            </p>
          </div>
        </div>
        {c.links.register ? null : (
          <div className="cs-soon" data-reveal>
            <Soon label={t.labels.soon} />
            <p>{t.soonNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}
