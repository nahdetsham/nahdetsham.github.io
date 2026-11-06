"""List the vector drawings (fill colour, bbox, item count) on chosen .ai pages, and dump each page as raw SVG."""
import os, sys
import pymupdf

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
PAGES = [(r"D:\my company\THE_PANNER_TEAM\1x\for_intro\Untitled-1.ai", 1), (r"D:\my company\THE_PANNER_TEAM\1x\for_intro\Untitled-1.ai", 2),
         (r"D:\my company\THE_PANNER_TEAM\panner_2.ai", 0)]
for p, n in PAGES:
    pg = pymupdf.open(p)[n]
    tag = f"{os.path.basename(os.path.dirname(p))}_{n}"
    print("==", tag, pg.rect)
    for k, d in enumerate(pg.get_drawings()):
        col = d.get("fill")
        print(k, d["type"], "fill", None if col is None else "#%02x%02x%02x" % tuple(int(c * 255) for c in col[:3]),
              "stroke", d.get("color"), "w", d.get("width"), [round(v) for v in d["rect"]], len(d["items"]), "items")
    txt = pg.get_text("dict")
    for b in txt["blocks"]:
        for l in b.get("lines", []):
            for s in l["spans"]:
                print("  text:", repr(s["text"]), s["font"], round(s["size"]))
    open(os.path.join(OUT, tag + ".svg"), "w", encoding="utf-8").write(pg.get_svg_image(text_as_path=True))
