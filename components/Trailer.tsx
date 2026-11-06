"use client";
// The 60 s trailer: only the poster loads with the page; the video loads and plays when the visitor asks.
import { useState } from "react";
import type { Content } from "@/lib/content";
import SectionHead from "./SectionHead";

export default function Trailer({ c }: { c: Content }) {
  const t = c.t.trailer;
  const [on, setOn] = useState(false);
  return (
    <section className="trailer" id="film" aria-labelledby="film-title">
      <div className="wrap">
        <SectionHead kicker={t.kicker} title={t.title} id="film-title" center />
        <div className="tr-frame" data-reveal>
          {on ? (
            <video src="/media/trailer.mp4" poster="/media/trailer.webp" controls autoPlay playsInline />
          ) : (
            <button type="button" className="tr-poster" onClick={() => setOn(true)} aria-label={t.play}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/trailer.webp" alt="" width={1280} height={720} loading="lazy" />
              <span className="tr-play" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <path className="tr-ring" d="M60 4L116 60L60 116L4 60Z" />
                  <path className="tr-tri" d="M50 44L76 60L50 76Z" />
                </svg>
              </span>
              <span className="tr-label">{t.play}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
