"""Draw the company wordmark in the brand's DG Heaven font as plain SVG paths (no font file needed on the site).

The font subset rebuilt from the .ai files has no shaping table, so the Arabic text is pre-shaped with
D:\\Nahdet\\_source\\brand_fonts\\dgshape.py and laid out right to left by advance width.
usage: python -I tools/wordmark.py <out_dir>   -> wordmark-ar.svg, wordmark-en.svg (fill="currentColor")
"""
import os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

BRAND = r"D:\Nahdet\_source\brand_fonts"
sys.path.insert(0, BRAND)
from dgshape import dg  # noqa: E402

FONT = TTFont(os.path.join(BRAND, "DGHeaven-Thin.merged.ttf"))
CMAP = FONT.getBestCmap()
GS = FONT.getGlyphSet()
HMTX = FONT["hmtx"]
UPM = FONT["head"].unitsPerEm
SPACE = int(UPM * 0.28)


def layout(text, rtl):
    chars = list(dg(text) if rtl else text)
    if rtl:
        chars.reverse()           # visual order, left to right
    x, parts = 0, []
    for ch in chars:
        if ch == " ":
            x += SPACE
            continue
        name = CMAP.get(ord(ch))
        if name is None:
            raise SystemExit(f"no glyph for {ch!r} in {text!r}")
        pen = SVGPathPen(GS)
        GS[name].draw(pen)
        bp = BoundsPen(GS)
        GS[name].draw(bp)
        parts.append((x, pen.getCommands(), bp.bounds))
        x += HMTX[name][0]
    return parts


def svg(text, rtl, out):
    parts = layout(text, rtl)
    xs = [x + b[0] for x, _, b in parts if b] + [x + b[2] for x, _, b in parts if b]
    ys = [b[1] for _, _, b in parts if b] + [b[3] for _, _, b in parts if b]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    pad = 10
    w, h = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
    # font units are y-up: flip each glyph into the SVG's y-down box
    g = "".join(f'<path transform="translate({x - x0 + pad} {y1 + pad}) scale(1 -1)" d="{d}"/>' for x, d, _ in parts if d)
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" fill="currentColor">{g}</svg>\n'
    open(out, "w", encoding="utf-8").write(s)
    print(os.path.basename(out), f"{w:.0f}x{h:.0f}")


if __name__ == "__main__":
    o = sys.argv[1]
    svg("شركة نهضة شام", True, os.path.join(o, "wordmark-ar.svg"))
    svg("nahdet sham", False, os.path.join(o, "wordmark-en.svg"))
