import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, getContent, isLang } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { ld, orgLd } from "@/lib/jsonld";
import Shell from "@/components/Shell";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Thread from "@/components/Thread";
import Pillars from "@/components/Pillars";
import Courses from "@/components/Courses";
import Work from "@/components/Work";
import Lessons from "@/components/Lessons";
import Trailer from "@/components/Trailer";
import Founder from "@/components/Founder";
import Cta from "@/components/Cta";
import { Arrow } from "@/components/Icons";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? pageMeta(lang, "", null) : {};
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = getContent(lang);
  return (
    <Shell c={c}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(orgLd(c)) }} />
      <Hero c={c} />
      <Story c={c} />
      <section className="sec-thread" aria-labelledby="pillars-title">
        <Thread>
          <p className="kicker kicker-center">{c.t.pillars.kicker}</p>
          <h2 className="thread-big" id="pillars-title">{c.t.pillars.title}</h2>
          <a className="thread-link" href={`/${lang}/services/`}>
            {c.t.pillars.more}
            <Arrow className="ic flip" />
          </a>
        </Thread>
      </section>
      <Pillars c={c} />
      <Courses c={c} />
      <Work c={c} />
      <Lessons c={c} />
      <Trailer c={c} />
      <Founder c={c} />
      <Cta c={c} />
    </Shell>
  );
}
