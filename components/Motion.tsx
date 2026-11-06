"use client";
// Smooth scrolling (Lenis) driven by GSAP's ticker, so ScrollTrigger scenes stay in step.
// Skipped entirely for visitors who ask for reduced motion.
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -72 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // fonts change line heights: measure the scenes again once they are in
    document.fonts?.ready.then(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
