"""Build clean SVGs of the Nahdet Sham calligraphic mark from the company's Illustrator file.

Source: D:\\my company\\THE_PANNER_TEAM\\1x\\for_intro\\Untitled-1.ai page 2 (index 1): the mark as 14 filled paths.
Path 13 is the lower swoosh (gold in the official logo), the rest is the body (blue #284878 in the official logo).
usage: python -I tools/extract_logo.py <out_dir>
writes mark.svg (official colours), mark-gold.svg (body ink + gold swoosh, for navy grounds),
       mark-paths.json (raw path data + viewBox, used by the site to draw it stroke by stroke)
"""
import json, os, sys
import pymupdf

SRC = r"D:\my company\THE_PANNER_TEAM\1x\for_intro\Untitled-1.ai"
PAGE = 1
SWOOSH = 13
PAD = 6


def f(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def path_d(items, ox, oy):
    out, cur = [], None
    for it in items:
        op = it[0]
        if op == "l":
            a, b = it[1], it[2]
            if cur is None or abs(cur.x - a.x) > 1e-3 or abs(cur.y - a.y) > 1e-3:
                out.append(f"M{f(a.x - ox)} {f(a.y - oy)}")
            out.append(f"L{f(b.x - ox)} {f(b.y - oy)}")
            cur = b
        elif op == "c":
            a, c1, c2, b = it[1], it[2], it[3], it[4]
            if cur is None or abs(cur.x - a.x) > 1e-3 or abs(cur.y - a.y) > 1e-3:
                out.append(f"M{f(a.x - ox)} {f(a.y - oy)}")
            out.append(f"C{f(c1.x - ox)} {f(c1.y - oy)} {f(c2.x - ox)} {f(c2.y - oy)} {f(b.x - ox)} {f(b.y - oy)}")
            cur = b
        elif op == "re":
            r = it[1]
            out.append(f"M{f(r.x0 - ox)} {f(r.y0 - oy)}H{f(r.x1 - ox)}V{f(r.y1 - oy)}H{f(r.x0 - ox)}Z")
            cur = None
        elif op == "qu":
            q = it[1]
            pts = [q.ul, q.ur, q.lr, q.ll]
            out.append(f"M{f(pts[0].x - ox)} {f(pts[0].y - oy)}" + "".join(f"L{f(p.x - ox)} {f(p.y - oy)}" for p in pts[1:]) + "Z")
            cur = None
    return "".join(out) + "Z"


LOCKUP = r"D:\my company\THE_PANNER_TEAM\panner_2.ai"   # page 1: the logo with the name; it has the gold dot of the ض


def gold_dot(swoosh_rect):
    """The small gold diamond above the middle stroke, missing from SRC (and from the PNG marks).
    Taken from the lockup and moved into SRC's coordinates by matching the two swooshes' boxes."""
    d = pymupdf.open(LOCKUP)[0].get_drawings()
    gold = [x for x in d if x.get("fill") and x["fill"][0] > 0.55 and x["fill"][2] < 0.4]
    dot = min(gold, key=lambda x: x["rect"].width * x["rect"].height)
    sw = max(gold, key=lambda x: x["rect"].width * x["rect"].height)
    k = (swoosh_rect.width / sw["rect"].width + swoosh_rect.height / sw["rect"].height) / 2
    mx = lambda p: pymupdf.Point(swoosh_rect.x0 + (p.x - sw["rect"].x0) * k, swoosh_rect.y0 + (p.y - sw["rect"].y0) * k)
    items = []
    for it in dot["items"]:
        if it[0] in ("l", "c"):
            items.append((it[0], *[mx(p) for p in it[1:]]))
        elif it[0] == "qu":
            q = it[1]
            items.append(("qu", pymupdf.Quad(mx(q.ul), mx(q.ur), mx(q.ll), mx(q.lr))))
        elif it[0] == "re":
            r = it[1]
            items.append(("qu", pymupdf.Quad(mx(r.tl), mx(r.tr), mx(r.bl), mx(r.br))))
    rect = pymupdf.Rect(mx(dot["rect"].tl), mx(dot["rect"].br))
    return {"items": items, "rect": rect, "even_odd": False}


def main():
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    draws = pymupdf.open(SRC)[PAGE].get_drawings()
    draws.append(gold_dot(draws[SWOOSH]["rect"]))
    x0 = min(d["rect"].x0 for d in draws) - PAD
    y0 = min(d["rect"].y0 for d in draws) - PAD
    x1 = max(d["rect"].x1 for d in draws) + PAD
    y1 = max(d["rect"].y1 for d in draws) + PAD
    w, h = x1 - x0, y1 - y0
    paths = [{"d": path_d(d["items"], x0, y0), "evenodd": bool(d.get("even_odd")),
              "part": "swoosh" if i == SWOOSH else "dot" if i == len(draws) - 1 else "body"}
             for i, d in enumerate(draws)]
    vb = f"0 0 {f(w)} {f(h)}"

    def svg(body, swoosh):
        rows = [f'<path d="{p["d"]}" fill="{body if p["part"] == "body" else swoosh}"'
                + (' fill-rule="evenodd"' if p["evenodd"] else "") + "/>" for p in paths]
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">' + "".join(rows) + "</svg>\n"

    open(os.path.join(out, "mark.svg"), "w", encoding="utf-8").write(svg("#284878", "#B08A3E"))
    open(os.path.join(out, "mark-gold.svg"), "w", encoding="utf-8").write(svg("#F1ECDC", "#D2B06A"))
    json.dump({"viewBox": vb, "paths": paths}, open(os.path.join(out, "mark-paths.json"), "w", encoding="utf-8"))
    print(len(paths), "paths, viewBox", vb)


if __name__ == "__main__":
    main()
