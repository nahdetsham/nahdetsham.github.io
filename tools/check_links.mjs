// Checks every internal link and asset in the exported site (out/) and lists the external links.
// usage: node tools/check_links.mjs [--external]   (--external also fetches each external URL once)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const pages = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) walk(p);
  else if (p.endsWith(".html")) pages.push(p);
});
walk(OUT);

const bad = [], external = new Map();
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const m of html.matchAll(/\b(?:href|src|poster)="([^"#]+)/g)) {
    const u = m[1].replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|tel:)/.test(u)) {
      if (u.startsWith("http")) external.set(u, (external.get(u) || 0) + 1);
      continue;
    }
    if (!u.startsWith("/")) continue;
    const path = decodeURIComponent(u.split("?")[0]);
    const f = join(OUT, path);
    const ok = existsSync(f) && (statSync(f).isFile() || existsSync(join(f, "index.html")));
    if (!ok) bad.push(`${page}: ${u}`);
  }
}
console.log(`${pages.length} pages checked, ${bad.length} broken internal links`);
bad.slice(0, 40).forEach((b) => console.log("  BROKEN", b));
console.log(`${external.size} external links`);
if (process.argv.includes("--external")) {
  for (const u of external.keys()) {
    try {
      const r = await fetch(u, { method: "GET", redirect: "follow", headers: { "user-agent": "Mozilla/5.0 link-check" } });
      console.log(`  ${r.status} ${u.slice(0, 110)}`);
    } catch (e) {
      console.log(`  ERR ${u.slice(0, 110)} ${e.message}`);
    }
  }
}
if (bad.length) process.exit(1);
