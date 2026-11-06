"""Render every page of the company .ai files to small PNGs so we can find the logo vectors."""
import os, sys
import pymupdf

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
SRC = [r"D:\my company\THE_PANNER_TEAM\1x\for_intro\Untitled-1.ai", r"D:\my company\THE_PANNER_TEAM\panner_2.ai",
       r"D:\my company\THE_PANNER_TEAM\Untitled-1.ai"]
for i, p in enumerate(SRC):
    d = pymupdf.open(p)
    for n, pg in enumerate(d):
        z = 600 / max(pg.rect.width, pg.rect.height)
        pg.get_pixmap(matrix=pymupdf.Matrix(z, z)).save(os.path.join(OUT, f"f{i}_p{n}.png"))
        print(i, n, pg.rect, len(pg.get_drawings()), "drawings", len(pg.get_images()), "images")
