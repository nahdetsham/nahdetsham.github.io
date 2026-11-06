import type { NextConfig } from "next";

// Static site: `npm run build` writes plain HTML to /out (served by GitHub Pages at nahdetsham.github.io).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
