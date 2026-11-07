import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, getContent, isLang, wa } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import Shell from "@/components/Shell";
import PageHero from "@/components/PageHero";
import Soon from "@/components/Soon";
import { Arrow, Mail, SocialIcon, Whatsapp } from "@/components/Icons";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const p = getContent(lang).t.pages.contact;
  return pageMeta(lang, "contact", p.kicker, p.intro);
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = getContent(lang);
  const p = c.t.pages.contact;
  const s = c.t.pages.services;
  const k = c.shared.contact;
  const services = [...s.build, ...s.design].map((x) => x.title);

  return (
    <Shell c={c}>
      <PageHero kicker={p.kicker} title={p.title} intro={p.intro} />
      <section className="ct">
        <div className="wrap ct-grid">
          <a className="ct-card ct-wa" href={c.links.whatsappProject} target="_blank" rel="noopener" data-reveal>
            <Whatsapp className="ct-ic" />
            <span className="ct-t">{p.whatsappTitle}</span>
            <bdi className="ct-big" dir="ltr">{k.phone}</bdi>
            <span className="ct-s">{p.whatsappText}</span>
            <Arrow className="ic flip ct-go" />
          </a>
          {c.links.register ? (
            <a className="ct-card" href={c.links.register} target="_blank" rel="noopener" data-reveal>
              <span className="ct-t">{p.formTitle}</span>
              <span className="ct-s">{p.formText}</span>
              <span className="ct-link">{p.formCta} <Arrow className="ic flip" /></span>
            </a>
          ) : (
            <div className="ct-card" data-reveal>
              <span className="ct-t">{p.formTitle}</span>
              <Soon label={c.t.courses.labels.soon} small />
              <span className="ct-s">{c.t.courses.soonNote}</span>
            </div>
          )}
          <a className="ct-card" href={c.links.email} data-reveal>
            <Mail className="ct-ic" />
            <span className="ct-t">{p.emailTitle}</span>
            <bdi className="ct-mid" dir="ltr">{k.email}</bdi>
          </a>
          <div className="ct-card ct-follow" data-reveal>
            <span className="ct-t">{p.followTitle}</span>
            <ul>
              {c.social.map((x) => (
                <li key={x.id}>
                  <a href={x.url} target="_blank" rel="noopener" aria-label={`${x.label} ${x.handle}`}>
                    <SocialIcon id={x.id} className="ic" />
                    <bdi dir="ltr">{x.handle}</bdi>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="wrap ct-services">
          <h2 className="cd-h" data-reveal>{p.servicesTitle}</h2>
          <ul data-reveal>
            {[...(c.links.register ? [c.t.hero.ctaCourse] : []), ...services].map((title) => (
              <li key={title}>
                <a href={title === c.t.hero.ctaCourse ? c.links.whatsappCourse : wa(k.whatsapp, `${s.requestText}: ${title}`)} target="_blank" rel="noopener">
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Shell>
  );
}
