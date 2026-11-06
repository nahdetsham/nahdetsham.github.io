import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, getContent, isLang } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import Shell from "@/components/Shell";
import PageHero from "@/components/PageHero";
import Story from "@/components/Story";
import Pillars from "@/components/Pillars";
import Founder from "@/components/Founder";
import Lessons from "@/components/Lessons";
import Cta from "@/components/Cta";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const p = getContent(lang).t.pages.about;
  return pageMeta(lang, "about", p.kicker, p.intro);
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = getContent(lang);
  const p = c.t.pages.about;
  return (
    <Shell c={c}>
      <PageHero kicker={p.kicker} title={p.title} intro={p.intro} />
      <Story c={c} />
      <Pillars c={c} />
      <Founder c={c} />
      {/* the team section appears once names are added to content/shared.json "team" */}
      {c.shared.team.length ? (
        <section className="team" aria-labelledby="team-title">
          <div className="wrap">
            <h2 className="h2" id="team-title" data-reveal>{p.teamTitle}</h2>
          </div>
        </section>
      ) : null}
      <Lessons c={c} />
      <Cta c={c} />
    </Shell>
  );
}
