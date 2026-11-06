// Loads and validates the editable content in /content.
// shared.json holds language-neutral data (contact, links, ids); ar.json / en.json hold the text.
// Both languages must have exactly the same keys: a missing text fails the build.
import { z } from "zod";
import sharedRaw from "@/content/shared.json";
import arRaw from "@/content/ar.json";
import enRaw from "@/content/en.json";

export const LANGS = ["ar", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);

const SocialId = z.enum(["instagram", "facebook", "youtube"]);
export type SocialId = z.infer<typeof SocialId>;

const Shared = z.object({
  site: z.object({ url: z.string().url(), defaultLang: z.enum(LANGS), year: z.number() }),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string().regex(/^\d+$/, "whatsapp: digits only, with country code"),
    email: z.string().email(),
    registerForm: z.union([z.string().url(), z.literal("")]),
  }),
  social: z.array(z.object({ id: SocialId, url: z.string().url(), handle: z.string() })),
  courses: z.array(
    z.object({ id: z.string().regex(/^[a-z]+$/), num: z.string(), tags: z.array(z.string()), file: z.string(), code: z.string() }),
  ),
  lessons: z.array(z.object({ id: z.enum(["java", "web"]), count: z.number(), playlist: z.string().url(), first: z.string().url() })),
  founder: z.object({ site: z.string().url() }),
  team: z.array(z.object({ id: z.string(), photo: z.string().optional() })),
});

const Item = z.object({ title: z.string(), text: z.string() });

const CourseText = z.object({
  title: z.string(), short: z.string(), level: z.string(), hook: z.string(),
  modules: z.array(z.string()).length(6), projects: z.array(z.string()).length(3), prereq: z.string(), outcome: z.string(),
});

const Text = z.object({
  meta: z.object({ title: z.string(), description: z.string(), name: z.string() }),
  nav: z.object({
    services: z.string(), courses: z.string(), work: z.string(), about: z.string(), contact: z.string(),
    lang: z.string(), langLabel: z.string(), menu: z.string(), close: z.string(), skip: z.string(), home: z.string(),
  }),
  hero: z.object({
    kicker: z.string(), title1: z.string(), title2: z.string(), titleGold: z.string(), pillars: z.string(),
    lead: z.string(), ctaCourse: z.string(), ctaProject: z.string(), scroll: z.string(),
  }),
  story: z.object({ kicker: z.string(), lines: z.array(z.string()).length(3), sub: z.string(), code: z.string(), file: z.string() }),
  pillars: z.object({
    kicker: z.string(), title: z.string(), more: z.string(),
    items: z.array(z.object({ id: z.enum(["teach", "build", "design"]), title: z.string(), text: z.string(), points: z.array(z.string()) })).length(3),
  }),
  courses: z.object({
    kicker: z.string(), title: z.string(), intro: z.string(),
    labels: z.object({
      modules: z.string(), projects: z.string(), prereq: z.string(), outcome: z.string(), register: z.string(), ask: z.string(),
      askText: z.string(), film: z.string(), trainer: z.string(), trainerName: z.string(), details: z.string(),
    }),
    items: z.record(CourseText),
  }),
  work: z.object({ kicker: z.string(), title: z.string(), text: z.string(), features: z.array(z.string()).length(5), cta: z.string() }),
  lessons: z.object({
    kicker: z.string(), title: z.string(), text: z.string(), items: z.object({ java: z.string(), web: z.string() }), count: z.string(), watch: z.string(),
  }),
  trailer: z.object({ kicker: z.string(), title: z.string(), play: z.string() }),
  founder: z.object({ kicker: z.string(), name: z.string(), role: z.string(), bio: z.array(z.string()), link: z.string(), photoAlt: z.string() }),
  cta: z.object({ title: z.string(), text: z.string() }),
  whatsapp: z.object({ course: z.string(), project: z.string() }),
  footer: z.object({
    tagline: z.string(), contactTitle: z.string(), followTitle: z.string(), whatsapp: z.string(), email: z.string(), rights: z.string(),
  }),
  social: z.record(SocialId, z.string()),
  pages: z.object({
    courses: z.object({ kicker: z.string(), title: z.string(), intro: z.string() }),
    course: z.object({ kicker: z.string(), back: z.string(), others: z.string(), code: z.string(), level: z.string() }),
    services: z.object({
      kicker: z.string(), title: z.string(), intro: z.string(), request: z.string(), requestText: z.string(), teachLink: z.string(),
      build: z.array(Item).length(3), design: z.array(Item).length(6), stepsTitle: z.string(), steps: z.array(Item).length(4),
    }),
    work: z.object({ kicker: z.string(), title: z.string(), intro: z.string(), adsKicker: z.string(), adsTitle: z.string(), adsText: z.string() }),
    about: z.object({ kicker: z.string(), title: z.string(), intro: z.string(), teamTitle: z.string() }),
    contact: z.object({
      kicker: z.string(), title: z.string(), intro: z.string(), whatsappTitle: z.string(), whatsappText: z.string(),
      formTitle: z.string(), formText: z.string(), formCta: z.string(), emailTitle: z.string(), followTitle: z.string(), servicesTitle: z.string(),
    }),
    notFound: z.object({ title: z.string(), text: z.string(), home: z.string() }),
  }),
});

function parse<S extends z.ZodTypeAny>(schema: S, data: unknown, file: string): z.infer<S> {
  const r = schema.safeParse(data);
  if (!r.success) {
    const issues = r.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`content/${file} is invalid:\n${issues}`);
  }
  return r.data;
}

const shared = parse(Shared, sharedRaw, "shared.json");
const texts = { ar: parse(Text.strict(), arRaw, "ar.json"), en: parse(Text.strict(), enRaw, "en.json") };

// every course in shared.json needs its text in both languages
for (const [lang, t] of Object.entries(texts)) {
  const missing = shared.courses.filter((c) => !(c.id in t.courses.items)).map((c) => c.id);
  if (missing.length) throw new Error(`content/${lang}.json is missing course text for: ${missing.join(", ")}`);
}

// the two languages must carry the same keys at every level (catches a text added to one file only)
function keys(o: unknown, p = ""): string[] {
  if (Array.isArray(o)) return o.flatMap((v, i) => keys(v, `${p}[${i}]`));
  if (o && typeof o === "object") return Object.entries(o).flatMap(([k, v]) => [`${p}.${k}`, ...keys(v, `${p}.${k}`)]);
  return [];
}
{
  const a = new Set(keys(arRaw)), e = new Set(keys(enRaw));
  const onlyAr = [...a].filter((k) => !e.has(k)), onlyEn = [...e].filter((k) => !a.has(k));
  if (onlyAr.length || onlyEn.length)
    throw new Error(`content: keys differ between languages.\n only in ar.json: ${onlyAr.join(", ")}\n only in en.json: ${onlyEn.join(", ")}`);
}

export const wa = (phone: string, text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

export function getContent(lang: Lang) {
  const t = texts[lang];
  const c = shared.contact;
  return {
    lang,
    dir: lang === "ar" ? ("rtl" as const) : ("ltr" as const),
    other: (lang === "ar" ? "en" : "ar") as Lang,
    shared,
    t,
    links: {
      whatsappCourse: wa(c.whatsapp, t.whatsapp.course),
      whatsappProject: wa(c.whatsapp, t.whatsapp.project),
      // until the public form link is in shared.json, "join a course" opens WhatsApp
      register: c.registerForm || wa(c.whatsapp, t.whatsapp.course),
      email: `mailto:${c.email}`,
    },
    social: shared.social.map((s) => ({ ...s, label: t.social[s.id] })),
    courses: shared.courses.map((s) => {
      const ct = t.courses.items[s.id];
      return {
        ...s, ...ct,
        film: `/media/course-${s.id}.mp4`, poster: `/media/course-${s.id}.webp`,
        ask: wa(c.whatsapp, `${t.courses.labels.askText}: ${ct.title}`),
      };
    }),
    lessons: shared.lessons.map((s) => ({ ...s, title: t.lessons.items[s.id], thumb: `/media/yt-${s.id}.webp` })),
  };
}

export type Content = ReturnType<typeof getContent>;
