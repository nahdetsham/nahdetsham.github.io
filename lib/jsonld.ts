// Structured data (schema.org) for search engines.
import type { Content } from "./content";

export function orgLd(c: Content) {
  const s = c.shared;
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: c.t.meta.name,
    alternateName: c.lang === "ar" ? "Nahdet Sham" : "شركة نهضة شام",
    url: `${s.site.url}/${c.lang}/`,
    logo: `${s.site.url}/brand/logo-512.png`,
    description: c.t.meta.description,
    email: s.contact.email,
    telephone: s.contact.phone.replace(/\s/g, ""),
    sameAs: s.social.map((x) => x.url),
    founder: { "@type": "Person", name: c.t.founder.name, url: s.founder.site },
    areaServed: "SY",
  };
}

export function courseLd(c: Content, k: Content["courses"][number]) {
  const s = c.shared;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: k.title,
    description: k.hook,
    url: `${s.site.url}/${c.lang}/courses/${k.id}/`,
    inLanguage: "ar",
    teaches: k.modules,
    coursePrerequisites: k.prereq,
    provider: { "@type": "EducationalOrganization", name: c.t.meta.name, url: `${s.site.url}/${c.lang}/` },
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so text can never close the tag. */
export const ld = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");
