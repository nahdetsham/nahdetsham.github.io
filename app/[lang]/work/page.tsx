import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, getContent, isLang } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import Shell from "@/components/Shell";
import PageHero from "@/components/PageHero";
import Work from "@/components/Work";
import SectionHead from "@/components/SectionHead";
import Trailer from "@/components/Trailer";
import Cta from "@/components/Cta";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const p = getContent(lang).t.pages.work;
  return pageMeta(lang, "work", p.kicker, p.intro);
}

export default async function WorkPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = getContent(lang);
  const p = c.t.pages.work;
  return (
    <Shell c={c}>
      <PageHero kicker={p.kicker} title={p.title} intro={p.intro} />
      <Work c={c} />
      <section className="ads" aria-labelledby="ads-title">
        <div className="wrap">
          <SectionHead kicker={p.adsKicker} title={p.adsTitle} intro={p.adsText} id="ads-title" />
        </div>
        <ul className="ads-row">
          {c.courses.map((k, i) => (
            <li key={k.id} data-reveal style={{ ["--i" as string]: i }}>
              <a href={`/${lang}/courses/${k.id}/`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={k.poster} alt={k.title} width={540} height={960} loading="lazy" />
                <span>{k.short}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <Trailer c={c} />
      <Cta c={c} />
    </Shell>
  );
}
