import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export const dynamic = "force-static";

// Every page in both languages, each listing its other-language twin.
export default function sitemap(): MetadataRoute.Sitemap {
  const c = getContent("ar");
  const base = c.shared.site.url;
  const paths = ["", "services/", "courses/", ...c.courses.map((k) => `courses/${k.id}/`), "work/", "about/", "contact/"];
  return paths.flatMap((p) =>
    (["ar", "en"] as const).map((lang) => ({
      url: `${base}/${lang}/${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p.startsWith("courses") ? 0.8 : 0.6,
      alternates: { languages: { ar: `${base}/ar/${p}`, en: `${base}/en/${p}` } },
    })),
  );
}
