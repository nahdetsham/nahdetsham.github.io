import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, getContent, isLang, type Lang } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { courseLd, ld } from "@/lib/jsonld";
import Shell from "@/components/Shell";
import PageHero from "@/components/PageHero";
import Film from "@/components/Film";
import CodeWin from "@/components/CodeWin";
import Cta from "@/components/Cta";
import Soon from "@/components/Soon";
import { Arrow, Whatsapp } from "@/components/Icons";

export function generateStaticParams() {
  const ids = getContent("ar").courses.map((k) => k.id);
  return LANGS.flatMap((lang) => ids.map((id) => ({ lang, id })));
}

function find(lang: string, id: string) {
  if (!isLang(lang)) return null;
  const c = getContent(lang as Lang);
  const k = c.courses.find((x) => x.id === id);
  return k ? { c, k } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const f = find(lang, id);
  return f ? pageMeta(f.c.lang, `courses/${id}`, f.k.short, `${f.k.title}: ${f.k.hook}`) : {};
}

export default async function CoursePage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const f = find(lang, id);
  if (!f) notFound();
  const { c, k } = f;
  const L = c.t.courses.labels;
  const P = c.t.pages.course;
  return (
    <Shell c={c}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(courseLd(c, k)) }} />
      <PageHero kicker={`${P.kicker} ${k.num}`} title={k.title} intro={k.hook}>
        <dl className="cd-facts">
          <div><dt>{P.level}</dt><dd>{k.level}</dd></div>
          <div><dt>{L.prereq}</dt><dd>{k.prereq}</dd></div>
          <div><dt>{L.trainer}</dt><dd>{L.trainerName}</dd></div>
        </dl>
        <div className="ctas">
          {c.links.register ? (
            <a className="btn btn-gold" href={c.links.register} target="_blank" rel="noopener">
              {L.register}
              <Arrow className="ic flip" />
            </a>
          ) : (
            <Soon label={L.soon} />
          )}
          <a className="btn btn-line" href={k.ask} target="_blank" rel="noopener">
            <Whatsapp className="ic" />
            {L.ask}
          </a>
        </div>
      </PageHero>

      <section className="cd">
        <div className="wrap cd-grid">
          <div className="cd-main">
            <h2 className="cd-h" data-reveal>{L.modules}</h2>
            <ol className="cd-mods">
              {k.modules.map((m, i) => (
                <li key={m} data-reveal>
                  <span className="cd-n">{String(i + 1).padStart(2, "0")}</span>
                  {m}
                </li>
              ))}
            </ol>
            <h2 className="cd-h" data-reveal>{L.projects}</h2>
            <ul className="cd-proj">
              {k.projects.map((p) => (
                <li key={p} data-reveal>{p}</li>
              ))}
            </ul>
            <div className="cd-out" data-reveal>
              <span>{L.outcome}</span>
              <p>{k.outcome}</p>
            </div>
            <ul className="cs-tags cd-tags" dir="ltr" data-reveal>
              {k.tags.map((tg) => (
                <li key={tg}>{tg}</li>
              ))}
            </ul>
          </div>
          <aside className="cd-side">
            <Film src={k.film} poster={k.poster} label={`${L.film}: ${k.short}`} />
            <p className="cs-cap"><span>{L.film}</span> {k.short}</p>
            <CodeWin code={k.code} file={k.file} />
            <p className="cd-code-cap">{P.code}</p>
          </aside>
        </div>
      </section>

      <section className="cd-others" aria-labelledby="others-title">
        <div className="wrap">
          <div className="cd-others-head">
            <h2 className="cd-h" id="others-title" data-reveal>{P.others}</h2>
            <a className="thread-link" href={`/${c.lang}/courses/`} data-reveal>
              {P.back}
              <Arrow className="ic flip" />
            </a>
          </div>
          <ul className="cd-others-list">
            {c.courses.filter((x) => x.id !== k.id).map((x) => (
              <li key={x.id} data-reveal>
                <a href={`/${c.lang}/courses/${x.id}/`}>
                  <span className="cs-num">{x.num}</span>
                  <span className="cd-o-title">{x.short}</span>
                  <span className="cd-o-level">{x.level}</span>
                  <Arrow className="ic flip" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Cta c={c} />
    </Shell>
  );
}
