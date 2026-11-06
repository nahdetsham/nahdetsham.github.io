import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, getContent, isLang } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import Shell from "@/components/Shell";
import PageHero from "@/components/PageHero";
import Courses from "@/components/Courses";
import Lessons from "@/components/Lessons";
import Cta from "@/components/Cta";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const p = getContent(lang).t.pages.courses;
  return pageMeta(lang, "courses", p.kicker, p.intro);
}

export default async function CoursesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = getContent(lang);
  const p = c.t.pages.courses;
  return (
    <Shell c={c}>
      <PageHero kicker={p.kicker} title={p.title} intro={p.intro} />
      <Courses c={c} head={false} />
      <Lessons c={c} />
      <Cta c={c} />
    </Shell>
  );
}
