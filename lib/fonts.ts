// The brand font Samim (OFL), served from the project so the build needs no network.
import localFont from "next/font/local";

export const samim = localFont({
  src: [
    { path: "../app/fonts/Samim.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/Samim-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-samim",
  display: "swap",
  fallback: ["Tahoma", "Segoe UI", "Arial", "sans-serif"],
});
