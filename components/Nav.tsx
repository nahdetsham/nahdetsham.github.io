"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Content } from "@/lib/content";
import { Mark, Wordmark } from "./Brand";
import { Burger, Close } from "./Icons";

const ITEMS = ["services", "courses", "work", "about", "contact"] as const;

export default function Nav({ c }: { c: Content }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname() || `/${c.lang}/`;
  const t = c.t.nav;
  // the same page in the other language
  const otherHref = path.replace(/^\/(ar|en)(?=\/|$)/, `/${c.other}`);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className={`nav${solid ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <a className="skip" href="#main">{t.skip}</a>
      <div className="wrap nav-row">
        <a className="nav-brand" href={`/${c.lang}/`} aria-label={t.home}>
          <Mark className="nav-mark" />
          <Wordmark lang={c.lang} className="nav-wm" />
        </a>
        <nav className="nav-links" aria-label={t.menu}>
          {ITEMS.map((k) => {
            const href = `/${c.lang}/${k}/`;
            const here = path.startsWith(href);
            return (
              <a key={k} href={href} aria-current={here ? "page" : undefined} onClick={() => setOpen(false)}>{t[k]}</a>
            );
          })}
        </nav>
        <div className="nav-end">
          <a className="nav-lang" href={otherHref} lang={c.other} aria-label={t.langLabel}>{t.lang}</a>
          {c.links.register ? (
            <a className="btn btn-gold btn-sm nav-cta" href={c.links.register} target="_blank" rel="noopener">{c.t.hero.ctaCourse}</a>
          ) : null}
          <button className="nav-burger" type="button" aria-expanded={open} aria-label={open ? t.close : t.menu} onClick={() => setOpen(!open)}>
            {open ? <Close /> : <Burger />}
          </button>
        </div>
      </div>
    </header>
  );
}
