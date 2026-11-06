// Section heading: gold kicker, title, a drawn rule (line · diamond · line) and an optional intro.
export default function SectionHead({ kicker, title, intro, id, center = false }: {
  kicker: string; title: string; intro?: string; id?: string; center?: boolean;
}) {
  return (
    <div className={`shead${center ? " shead-center" : ""}`}>
      <p className="kicker" data-reveal>
        <span className="kicker-line" aria-hidden="true" />
        {kicker}
      </p>
      <h2 className="h2" id={id} data-reveal>{title}</h2>
      <svg className="shead-rule" viewBox="0 0 240 14" aria-hidden="true">
        <path className="draw" d="M0 7H100M112 7l8-7 8 7-8 7zM140 7H240" />
      </svg>
      {intro ? <p className="shead-intro" data-reveal>{intro}</p> : null}
    </div>
  );
}

/** Splits "first… second" so the part after the ellipsis can be gold. */
export function Ellipsis({ text }: { text: string }) {
  const i = text.indexOf("…");
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i + 1)} <em>{text.slice(i + 1).trim()}</em>
    </>
  );
}
