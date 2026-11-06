// Share images (Open Graph, 1200x630) for each language + the 512 px logo PNG, rendered with headless Chrome.
// usage: node tools/og.js   (uses puppeteer-core from D:/course_ads and the installed Chrome)
const path = require("path");
const fs = require("fs");
const puppeteer = require("D:/course_ads/node_modules/puppeteer-core");

const ROOT = path.resolve(__dirname, "..");
const url = (p) => "file:///" + path.join(ROOT, p).replace(/\\/g, "/");
const ar = require(path.join(ROOT, "content/ar.json"));
const en = require(path.join(ROOT, "content/en.json"));

function star(cx, cy, r) {
  const P = (rr, a) => `${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  const sq = (rot) => "M" + [0, 1, 2, 3].map((k) => P(r, rot + (k * Math.PI) / 2)).join("L") + "Z";
  const ri = (r * 0.86 * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  const out = "M" + Array.from({ length: 16 }, (_, k) => P(k % 2 ? ri : r * 0.86, -Math.PI / 2 + (k * Math.PI) / 8)).join("L") + "Z";
  return `<path d="${sq(-Math.PI / 2)}"/><path d="${sq(-Math.PI / 4)}"/><path d="${out}" stroke="#D2B06A" stroke-width="1"/>`;
}

function page(lang) {
  const t = lang === "ar" ? ar : en;
  const rtl = lang === "ar";
  return `<!doctype html><html lang="${lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><style>
  @font-face{font-family:Samim;src:url(${url("app/fonts/Samim-Bold.woff2")}) format('woff2');font-weight:700}
  @font-face{font-family:Samim;src:url(${url("app/fonts/Samim.woff2")}) format('woff2');font-weight:400}
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;background:linear-gradient(180deg,#0F1F3A,#16294B);font-family:Samim;color:#F1ECDC;position:relative}
  .lat{position:absolute;inset:0;opacity:.07;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='none' stroke='%23d2b06a' stroke-width='1'%3E%3Cpath d='M60 26L94 60L60 94L26 60Z M36 36H84V84H36Z M60 0V26 M60 94V120 M0 60H26 M94 60H120 M0 14L14 0 M106 0L120 14 M120 106L106 120 M14 120L0 106'/%3E%3C/svg%3E");background-size:120px}
  .art{position:absolute;top:35px;${rtl ? "left" : "right"}:60px;width:560px;height:560px}
  .art svg{width:100%;height:100%}
  .art path{fill:none;stroke:#B08A3E;stroke-width:1.6}
  .mk{position:absolute;left:50%;top:50%;width:230px;transform:translate(-50%,-50%)}
  .copy{position:absolute;top:0;bottom:0;${rtl ? "right" : "left"}:80px;width:520px;display:flex;flex-direction:column;justify-content:center;gap:18px}
  .wm{height:${rtl ? 58 : 50}px;background:#F1ECDC;-webkit-mask:url(${url(`public/brand/wordmark-${lang}.svg`)}) ${rtl ? "right" : "left"}/contain no-repeat}
  .rule{width:90px;height:2px;background:#D2B06A}
  h1{font-size:${rtl ? 64 : 58}px;line-height:1.2;font-weight:700}
  h1 em{font-style:normal;color:#D2B06A}
  p{font-size:28px;color:#D2B06A;font-weight:700}
  </style></head><body><div class="lat"></div>
  <div class="art"><svg viewBox="0 0 600 600">${star(300, 300, 286)}</svg><img class="mk" src="${url("public/brand/mark-gold.svg")}"></div>
  <div class="copy"><div class="wm"></div><div class="rule"></div>
  <h1>${t.hero.title1}<br>${t.hero.title2} <em>${t.hero.titleGold}</em></h1><p>${t.hero.pillars}</p></div></body></html>`;
}

(async () => {
  const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--allow-file-access-from-files"] });
  for (const lang of ["ar", "en"]) {
    const html = path.join(ROOT, "_work", `og-${lang}.html`);
    fs.mkdirSync(path.dirname(html), { recursive: true });
    fs.writeFileSync(html, page(lang));
    const p = await b.newPage();
    await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await p.goto(url(`_work/og-${lang}.html`), { waitUntil: "load" });
    await p.evaluate(async () => { await document.fonts.ready; });
    await p.screenshot({ path: path.join(ROOT, "public", `og-${lang}.jpg`), type: "jpeg", quality: 88 });
    console.log("wrote public/og-" + lang + ".jpg");
    await p.close();
  }
  const p = await b.newPage();
  await p.setViewport({ width: 512, height: 512 });
  await p.goto(url("public/brand/icon.svg"));
  await p.screenshot({ path: path.join(ROOT, "public", "brand", "logo-512.png"), omitBackground: true });
  console.log("wrote public/brand/logo-512.png");
  await b.close();
})();
