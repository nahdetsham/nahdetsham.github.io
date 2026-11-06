import type { Content } from "@/lib/content";
import Thread from "./Thread";
import { Arrow, Whatsapp } from "./Icons";

// The end of the gold thread: the brand line "your future starts here" and the two ways in.
export default function Cta({ c }: { c: Content }) {
  const t = c.t.cta;
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta-bg" aria-hidden="true" />
      <Thread>
        <h2 className="cta-title" id="cta-title">{t.title}</h2>
        <p className="cta-text">{t.text}</p>
        <div className="ctas cta-btns">
          <a className="btn btn-gold" href={c.links.register} target="_blank" rel="noopener">
            {c.t.hero.ctaCourse}
            <Arrow className="ic flip" />
          </a>
          <a className="btn btn-line" href={c.links.whatsappProject} target="_blank" rel="noopener">
            <Whatsapp className="ic" />
            {c.t.hero.ctaProject}
          </a>
        </div>
      </Thread>
    </section>
  );
}
