import { squarePath, starOutline } from "./Brand";

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

/** Opening of an inner page: kicker, title, intro (CSS entrance, on screen at first paint) and the gold star
 *  drawing itself on the far side. */
export default function PageHero({ kicker, title, intro, children }: {
  kicker: string; title: string; intro?: string; children?: React.ReactNode;
}) {
  return (
    <section className="phero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="wrap phero-grid">
        <div className="phero-copy">
          <p className="kicker" data-hr style={d(0.1)}>
            <span className="kicker-line" aria-hidden="true" />
            {kicker}
          </p>
          <h1 className="phero-title" data-hr style={d(0.2)}>{title}</h1>
          {intro ? <p className="phero-intro" data-hr style={d(0.35)}>{intro}</p> : null}
          {children ? <div className="phero-extra" data-hr style={d(0.5)}>{children}</div> : null}
        </div>
        <svg className="phero-star" viewBox="0 0 600 600" aria-hidden="true">
          <path className="draw" d={squarePath(300, 300, 280, -Math.PI / 2)} />
          <path className="draw" d={squarePath(300, 300, 280, -Math.PI / 4)} />
          <path className="draw" d={starOutline(300, 300, 232)} />
          <circle className="draw" cx="300" cy="300" r="150" />
        </svg>
      </div>
    </section>
  );
}
