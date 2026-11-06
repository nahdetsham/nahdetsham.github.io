import type { Content } from "@/lib/content";
import { squarePath, starOutline } from "./Brand";
import { Arrow } from "./Icons";

export default function Founder({ c }: { c: Content }) {
  const t = c.t.founder;
  return (
    <section className="founder" id="about" aria-labelledby="founder-title">
      <div className="wrap fd-grid">
        <div className="fd-photo">
          <svg className="fd-star" viewBox="0 0 600 600" aria-hidden="true">
            <path className="draw" d={squarePath(300, 300, 280, -Math.PI / 2)} />
            <path className="draw" d={squarePath(300, 300, 280, -Math.PI / 4)} />
            <path className="draw fd-star-in" d={starOutline(300, 300, 240)} />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/founder.webp" alt={t.photoAlt} width={760} height={709} loading="lazy" data-reveal />
        </div>
        <div className="fd-copy">
          <p className="kicker" data-reveal>
            <span className="kicker-line" aria-hidden="true" />
            {t.kicker}
          </p>
          <h2 className="h2" id="founder-title" data-reveal>{t.name}</h2>
          <p className="fd-role" data-reveal>{t.role}</p>
          {t.bio.map((p) => (
            <p className="fd-bio" key={p} data-reveal>{p}</p>
          ))}
          <a className="fd-link" href={c.shared.founder.site} target="_blank" rel="noopener" data-reveal>
            {t.link}
            <Arrow className="ic flip" />
          </a>
        </div>
      </div>
    </section>
  );
}
