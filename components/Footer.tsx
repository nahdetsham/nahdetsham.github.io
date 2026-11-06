import type { Content } from "@/lib/content";
import { Mark, Wordmark } from "./Brand";
import { Mail, SocialIcon, Whatsapp } from "./Icons";

export default function Footer({ c }: { c: Content }) {
  const t = c.t.footer;
  const k = c.shared.contact;
  return (
    <footer className="footer" id="contact">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Mark className="footer-mark" />
          <Wordmark lang={c.lang} className="footer-wm" />
          <p className="footer-tag">{t.tagline}</p>
        </div>
        <div>
          <h2 className="footer-h">{t.contactTitle}</h2>
          <ul className="footer-list">
            <li>
              <a href={c.links.whatsappProject} target="_blank" rel="noopener">
                <Whatsapp className="ic" />
                <span><small>{t.whatsapp}</small><bdi dir="ltr">{k.phone}</bdi></span>
              </a>
            </li>
            <li>
              <a href={c.links.email}>
                <Mail className="ic" />
                <span><small>{t.email}</small><bdi dir="ltr">{k.email}</bdi></span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="footer-h">{t.followTitle}</h2>
          <ul className="footer-list">
            {c.social.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener">
                  <SocialIcon id={s.id} className="ic" />
                  <span><small>{s.label}</small><bdi dir="ltr">{s.handle}</bdi></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>© {c.shared.site.year} {c.t.meta.name}. {t.rights}</span>
      </div>
    </footer>
  );
}
