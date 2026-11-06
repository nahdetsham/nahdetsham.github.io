import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, getContent, isLang, wa } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import Shell from "@/components/Shell";
import PageHero from "@/components/PageHero";
import Steps from "@/components/Steps";
import Cta from "@/components/Cta";
import { Arrow, Whatsapp } from "@/components/Icons";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const p = getContent(lang).t.pages.services;
  return pageMeta(lang, "services", p.kicker, p.intro);
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = getContent(lang);
  const p = c.t.pages.services;
  const [teach, build, design] = c.t.pillars.items;
  const req = (title: string) => wa(c.shared.contact.whatsapp, `${p.requestText}: ${title}`);

  const group = (n: string, g: typeof teach, items: { title: string; text: string }[] | null) => (
    <section className="sv-group" aria-labelledby={`sv-${g.id}`}>
      <div className="wrap sv-grid">
        <header className="sv-head">
          <span className="sv-num" aria-hidden="true">{n}</span>
          <h2 className="h2" id={`sv-${g.id}`} data-reveal>{g.title}</h2>
          <p className="sv-text" data-reveal>{g.text}</p>
          {items ? null : (
            <a className="btn btn-gold" href={`/${lang}/courses/`} data-reveal>
              {p.teachLink}
              <Arrow className="ic flip" />
            </a>
          )}
        </header>
        {items ? (
          <ul className="sv-list">
            {items.map((it) => (
              <li key={it.title} data-reveal>
                <div>
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                </div>
                <a className="btn btn-line btn-sm" href={req(it.title)} target="_blank" rel="noopener">
                  <Whatsapp className="ic" />
                  {p.request}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="sv-list sv-courses">
            {c.courses.map((k) => (
              <li key={k.id} data-reveal>
                <a href={`/${lang}/courses/${k.id}/`}>
                  <span className="cs-num">{k.num}</span>
                  <span>
                    <h3>{k.short}</h3>
                    <p>{k.level}</p>
                  </span>
                  <Arrow className="ic flip" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );

  return (
    <Shell c={c}>
      <PageHero kicker={p.kicker} title={p.title} intro={p.intro} />
      {group("01", teach, null)}
      {group("02", build, p.build)}
      {group("03", design, p.design)}
      <Steps title={p.stepsTitle} steps={p.steps} />
      <Cta c={c} />
    </Shell>
  );
}
