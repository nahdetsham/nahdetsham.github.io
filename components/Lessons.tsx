import type { Content } from "@/lib/content";
import SectionHead from "./SectionHead";
import { Youtube } from "./Icons";

export default function Lessons({ c }: { c: Content }) {
  const t = c.t.lessons;
  return (
    <section className="lessons" id="lessons" aria-labelledby="lessons-title">
      <div className="wrap">
        <SectionHead kicker={t.kicker} title={t.title} intro={t.text} id="lessons-title" />
        <ul className="ls-grid">
          {c.lessons.map((l) => (
            <li key={l.id} data-reveal>
              <a className="ls-card" href={l.playlist} target="_blank" rel="noopener">
                <span className="ls-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.thumb} alt="" width={480} height={360} loading="lazy" />
                  <span className="ls-play" aria-hidden="true"><Youtube /></span>
                </span>
                <span className="ls-body">
                  <span className="ls-count">
                    <b>{l.count}</b> {t.count}
                  </span>
                  <span className="ls-title">{l.title}</span>
                  <span className="ls-watch">{t.watch}</span>
                </span>
                <svg className="ls-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="99" height="99" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
