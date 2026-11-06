"""Make the web copies of the company's videos and images into public/media (run again after a source changes).

usage: python -I tools/media.py
- course films (D:\\Nahdet\\08) -> 540x960 H.264, no sound (they play muted on the page), + a poster frame (webp)
- trailer 60 s 16:9 (D:\\Nahdet\\03) -> 1280x720 H.264 with sound (plays only on click), + poster
- SHAM UNITY screens scr_1..5 (trailer assets) -> webp
- founder portrait (hamza-profile) -> webp
- YouTube thumbnails of lecture 01 of each playlist -> webp
"""
import io, os, subprocess, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "media")
FILMS = r"D:\Nahdet\08 - فيديوهات الدورات"
COURSES = {"python": "01 - Python.mp4", "frontend": "02 - Front-End و React.mp4", "backend": "03 - Back-End.mp4",
           "ai": "04 - الذكاء الاصطناعي ML و DL.mp4", "excel": "05 - Excel و Power Pivot و Power BI.mp4"}
TRAILER = r"D:\Nahdet\03 - الفيديو\Nahdet_Sham_Trailer_60s_16x9.mp4"
SCREENS = r"D:\Nahdet\_source\trailer\assets\img"
PORTRAIT = r"D:\hamza-profile\public\images\hamza-portrait.webp"
THUMBS = {"java": "VhKlzCOgtZk", "web": "prpaqR0I4Zw"}
POSTER_AT = 29.0  # seconds into each course film: the company course poster (end card) is complete


def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def frame(src, at, out, w):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(at), "-i", src, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
                         capture_output=True, check=True).stdout
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    im.thumbnail((w, 10_000), Image.LANCZOS)
    im.save(out, "WEBP", quality=82, method=6)


def main():
    os.makedirs(OUT, exist_ok=True)
    for cid, name in COURSES.items():
        src = os.path.join(FILMS, name)
        ff("-i", src, "-vf", "scale=540:960:flags=lanczos", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "27",
           "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", os.path.join(OUT, f"course-{cid}.mp4"))
        frame(src, POSTER_AT, os.path.join(OUT, f"course-{cid}.webp"), 540)
    ff("-i", TRAILER, "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-pix_fmt", "yuv420p",
       "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", os.path.join(OUT, "trailer.mp4"))
    frame(TRAILER, 44.0, os.path.join(OUT, "trailer.webp"), 1280)
    for i in range(1, 6):
        Image.open(os.path.join(SCREENS, f"scr_{i}.png")).convert("RGB").save(os.path.join(OUT, f"app-{i}.webp"), "WEBP", quality=88, method=6)
    im = Image.open(PORTRAIT)
    im.thumbnail((760, 760), Image.LANCZOS)
    im.save(os.path.join(OUT, "founder.webp"), "WEBP", quality=86, method=6)
    for k, vid in THUMBS.items():
        data = urllib.request.urlopen(f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg", timeout=30).read()
        Image.open(io.BytesIO(data)).convert("RGB").save(os.path.join(OUT, f"yt-{k}.webp"), "WEBP", quality=82, method=6)
    for f in sorted(os.listdir(OUT)):
        print(f"{f:28s} {os.path.getsize(os.path.join(OUT, f)) / 1024:8.0f} KB")


if __name__ == "__main__":
    main()
