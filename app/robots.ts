import type { MetadataRoute } from "next";
import shared from "@/content/shared.json";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${shared.site.url}/sitemap.xml` };
}
