import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { LANGS, getContent, isLang } from "@/lib/content";
import { samim } from "@/lib/fonts";
import "../globals.css";
import "../home.css";
import "../pages.css";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#16294B", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const c = getContent(lang);
  // pages add their own title, canonical, alternates and Open Graph (lib/meta.ts)
  return {
    metadataBase: new URL(c.shared.site.url),
    title: { default: c.t.meta.title, template: `%s · ${c.t.meta.name}` },
    description: c.t.meta.description,
    icons: { icon: "/brand/icon.svg", apple: "/brand/logo-512.png" },
  };
}

// Before first paint: mark the page as animated (hidden start states apply), unless the visitor asks for
// reduced motion. If no animation has started 3 s later (script error), show everything as it is.
const BOOT = `(function(d){var h=d.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;h.classList.add('js');setTimeout(function(){if(!window.__nsAnim)h.classList.add('no-anim')},3000)})(document)`;

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className={samim.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
