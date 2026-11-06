"use client";
// One place to register the GSAP plugins the site uses (all free since GSAP 3.13).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export { gsap, ScrollTrigger, DrawSVGPlugin };

// Called by every animated component when it starts, so the CSS safety net (layout.tsx) keeps its hands off.
export function markAnimated() {
  (window as unknown as { __nsAnim?: boolean }).__nsAnim = true;
}
