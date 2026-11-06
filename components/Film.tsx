"use client";
// A course film in a phone frame: plays muted while on screen (never for visitors who ask for reduced motion).
import { useEffect, useRef, useState } from "react";

export default function Film({ src, poster, label }: { src: string; poster: string; label: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(r);
    if (r) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.current?.play().catch(() => {}) : v.current?.pause()), { threshold: 0.4 });
    io.observe(v.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div className="cs-phone film">
      <video ref={v} className="is-on" src={src} poster={poster} muted loop playsInline preload="metadata" controls={reduced} aria-label={label} />
      <span className="cs-isl" />
    </div>
  );
}
