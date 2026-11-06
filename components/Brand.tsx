// Brand drawings: the calligraphic mark (vector paths from the company's .ai file, tools/extract_logo.py),
// the wordmark (DG Heaven, tools/wordmark.py) and the Damascene eight-point star.
import mark from "@/content/mark-paths.json";

type Part = { d: string; evenodd: boolean; part: string };

export function MarkPaths({ className = "mk" }: { className?: string }) {
  return (
    <g className={className}>
      {(mark.paths as Part[]).map((p, i) => (
        <path key={i} d={p.d} className={p.part === "body" ? "mk-body" : "mk-sw"} fillRule={p.evenodd ? "evenodd" : undefined} />
      ))}
    </g>
  );
}

const [, , MW, MH] = mark.viewBox.split(" ").map(Number);
export const MARK_W = MW;
export const MARK_H = MH;

/** The mark alone, sized by CSS. */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox={mark.viewBox} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <MarkPaths />
    </svg>
  );
}

/** The wordmark as a CSS mask, so it takes the text colour (currentColor). */
export function Wordmark({ lang, className = "" }: { lang: "ar" | "en"; className?: string }) {
  return <span className={`wm wm-${lang} ${className}`} aria-hidden="true" />;
}

// Eight-point star from two squares (centre c, outer radius r), as point lists.
const P = (cx: number, cy: number, r: number, a: number) =>
  `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;

export function squarePath(cx: number, cy: number, r: number, rot: number) {
  const pts = [0, 1, 2, 3].map((k) => P(cx, cy, r, rot + (k * Math.PI) / 2));
  return `M${pts.join("L")}Z`;
}

/** The 16-point outline of the two overlapping squares. */
export function starOutline(cx: number, cy: number, r: number) {
  const ri = (r * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  const pts = Array.from({ length: 16 }, (_, k) => P(cx, cy, k % 2 ? ri : r, -Math.PI / 2 + (k * Math.PI) / 8));
  return `M${pts.join("L")}Z`;
}

/** The hero emblem: rosette of gold line-work around the mark. viewBox 0 0 600 600. */
export function Emblem() {
  const c = 300;
  const R = 286;
  const ring = 176;
  const markScale = (ring * 1.42) / MARK_H;
  const mw = MARK_W * markScale;
  const mh = MARK_H * markScale;
  const tips = Array.from({ length: 8 }, (_, k) => -Math.PI / 2 + (k * Math.PI) / 4);
  return (
    <svg className="emblem" viewBox="0 0 600 600" aria-hidden="true">
      <g className="star">
        <path className="st-line st-sq" d={squarePath(c, c, R, -Math.PI / 2)} />
        <path className="st-line st-sq" d={squarePath(c, c, R, -Math.PI / 4)} />
        <path className="st-line st-outer" d={starOutline(c, c, R * 0.86)} />
        <circle className="st-line st-ring" cx={c} cy={c} r={ring + 22} />
        <circle className="st-line st-ring st-ring-thin" cx={c} cy={c} r={ring + 10} />
        {tips.map((a, k) => (
          <path key={k} className="st-dot" d={squarePath(c + R * Math.cos(a), c + R * Math.sin(a), 7, a)} />
        ))}
      </g>
      <g transform={`translate(${(c - mw / 2).toFixed(2)} ${(c - mh / 2).toFixed(2)}) scale(${markScale.toFixed(4)})`}>
        <MarkPaths />
      </g>
    </svg>
  );
}
