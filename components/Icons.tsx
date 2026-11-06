// Line icons drawn in the brand's gold line-work style (24 grid, stroke = currentColor).
type P = { className?: string };
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const Instagram = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" strokeWidth={2.4} /></svg>
);
export const Facebook = ({ className }: P) => (
  <svg {...base} className={className}><path d="M14.5 8.2h2.2V4.6h-2.6c-2.6 0-4 1.6-4 4.1v2.1H7.6v3.5h2.5v6.1h3.6v-6.1h2.6l.5-3.5h-3.1V9.3c0-.7.3-1.1.8-1.1z" /></svg>
);
export const Youtube = ({ className }: P) => (
  <svg {...base} className={className}><rect x="2.8" y="5.5" width="18.4" height="13" rx="3.6" /><path d="M10.2 9.3v5.4l4.6-2.7z" /></svg>
);
export const Whatsapp = ({ className }: P) => (
  <svg {...base} className={className}><path d="M4.3 19.7l1.1-3.9A8.2 8.2 0 1 1 8.6 19z" /><path d="M9.2 8.3c.3-.4.7-.4 1-.1l.8 1.4c.1.3 0 .6-.2.8l-.5.5c.5 1.1 1.4 2 2.5 2.6l.5-.5c.2-.2.5-.3.8-.2l1.4.7c.3.2.4.6.1 1-.6.9-1.5 1.2-2.4.9-2.3-.8-4.1-2.6-4.8-4.9-.2-.8.1-1.6.8-2.2z" /></svg>
);
export const Mail = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3" y="5.5" width="18" height="13" rx="2.4" /><path d="M3.8 7l8.2 6 8.2-6" /></svg>
);
export const Arrow = ({ className }: P) => (
  <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Burger = ({ className }: P) => (
  <svg {...base} className={className}><path d="M4 8h16M4 16h16" /></svg>
);
export const Close = ({ className }: P) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
);

export const SocialIcon = ({ id, className }: { id: "instagram" | "facebook" | "youtube"; className?: string }) =>
  id === "instagram" ? <Instagram className={className} /> : id === "facebook" ? <Facebook className={className} /> : <Youtube className={className} />;
