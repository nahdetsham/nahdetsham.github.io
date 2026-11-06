"""Site icon: the mark (ink body, gold swoosh) on a navy rounded square. usage: python -I tools/make_icon.py"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
m = json.load(open(os.path.join(ROOT, "content", "mark-paths.json"), encoding="utf-8"))
_, _, w, h = map(float, m["viewBox"].split())
S = 512
inner = S * 0.74
k = inner / max(w, h)
tx, ty = (S - w * k) / 2, (S - h * k) / 2
paths = "".join(
    f'<path d="{p["d"]}" fill="{"#F1ECDC" if p["part"] == "body" else "#D2B06A"}"' + (' fill-rule="evenodd"' if p["evenodd"] else "") + "/>"
    for p in m["paths"])
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}"><rect width="{S}" height="{S}" rx="96" fill="#16294B"/>'
       f'<g transform="translate({tx:.2f} {ty:.2f}) scale({k:.4f})">{paths}</g></svg>\n')
open(os.path.join(ROOT, "public", "brand", "icon.svg"), "w", encoding="utf-8").write(svg)
print("icon.svg written")
