import type { Metadata } from "next";
import ar from "@/content/ar.json";
import en from "@/content/en.json";
import { samim } from "@/lib/fonts";
import { Mark, squarePath, starOutline } from "@/components/Brand";
import "../../globals.css";
import "../../home.css";

// Exported to /404/index.html, then copied to /404.html by tools/postbuild.mjs (GitHub Pages serves that file).
export const metadata: Metadata = { title: "404 · شركة نهضة شام | Nahdet Sham", robots: { index: false } };

export default function NotFoundPage() {
  const a = ar.pages.notFound;
  const e = en.pages.notFound;
  return (
    <div className={`${samim.variable} nf`}>
      <svg className="nf-star" viewBox="0 0 600 600" aria-hidden="true">
        <path d={squarePath(300, 300, 280, -Math.PI / 2)} />
        <path d={squarePath(300, 300, 280, -Math.PI / 4)} />
        <path d={starOutline(300, 300, 232)} />
      </svg>
      <div className="nf-box">
        <Mark className="nf-mark" title="شركة نهضة شام" />
        <p className="nf-code">404</p>
        <h1>{a.title}</h1>
        <p>{a.text}</p>
        <a className="btn btn-gold" href="/ar/">{a.home}</a>
        <div className="nf-en" dir="ltr" lang="en">
          <h2>{e.title}</h2>
          <p>{e.text}</p>
          <a className="btn btn-line" href="/en/">{e.home}</a>
        </div>
      </div>
    </div>
  );
}
