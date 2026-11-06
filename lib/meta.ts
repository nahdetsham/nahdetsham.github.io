// Metadata for every page: canonical + hreflang alternates, Open Graph with the language's share image.
import type { Metadata } from "next";
import { getContent, type Lang } from "./content";

export function pageMeta(lang: Lang, path: string, title: string | null, description?: string): Metadata {
  const c = getContent(lang);
  const p = path.replace(/^\/|\/$/g, "");
  const url = (l: Lang) => `/${l}/${p ? p + "/" : ""}`;
  const desc = description ?? c.t.meta.description;
  const og = `/og-${lang}.jpg`;
  return {
    title: title ?? { absolute: c.t.meta.title },
    description: desc,
    alternates: { canonical: url(lang), languages: { ar: url("ar"), en: url("en"), "x-default": url("ar") } },
    openGraph: {
      type: "website",
      title: title ? `${title} · ${c.t.meta.name}` : c.t.meta.title,
      description: desc,
      url: url(lang),
      siteName: c.t.meta.name,
      locale: lang === "ar" ? "ar_SY" : "en_US",
      images: [{ url: og, width: 1200, height: 630, alt: c.t.meta.name }],
    },
    twitter: { card: "summary_large_image", title: title ?? c.t.meta.title, description: desc, images: [og] },
  };
}
