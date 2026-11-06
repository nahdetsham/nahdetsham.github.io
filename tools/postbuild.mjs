// After `next build`: our bilingual 404 page becomes /404.html (what GitHub Pages serves for unknown paths),
// and .nojekyll keeps folders starting with "_" (Next's /_next) published.
import { copyFileSync, existsSync, writeFileSync } from "node:fs";

const src = "out/404/index.html";
if (!existsSync(src)) throw new Error(`${src} is missing: did the build export the 404 page?`);
copyFileSync(src, "out/404.html");
writeFileSync("out/.nojekyll", "");
console.log("postbuild: out/404.html from the custom 404 page, out/.nojekyll");
