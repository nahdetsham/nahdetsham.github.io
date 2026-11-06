// Tiny static server for the exported site (like GitHub Pages: /x/ -> /x/index.html, 404.html otherwise).
// usage: node tools/serve.mjs out 4100
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const root = resolve(process.argv[2] || "out");
const port = Number(process.argv[3] || 4100);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2",
  ".mp4": "video/mp4", ".webm": "video/webm", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".ico": "image/x-icon",
};

async function file(p) {
  try {
    const s = await stat(p);
    if (s.isDirectory()) return file(join(p, "index.html"));
    return p;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const p = normalize(join(root, url));
  if (!p.startsWith(root)) return res.writeHead(403).end();
  let f = await file(p);
  let code = 200;
  if (!f) {
    f = await file(join(root, "404.html"));
    code = 404;
  }
  if (!f) return res.writeHead(404).end("not found");
  let body = await readFile(f);
  const head = { "content-type": types[extname(f)] || "application/octet-stream", "cache-control": "no-store" };
  // compress text like GitHub Pages does, so local Lighthouse numbers are comparable
  if (/\.(html|js|css|json|svg|txt|xml)$/.test(f) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    body = gzipSync(body);
    head["content-encoding"] = "gzip";
  }
  res.writeHead(code, head).end(body);
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}`));
