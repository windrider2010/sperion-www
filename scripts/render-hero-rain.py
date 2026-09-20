"""Deterministic 12-second, 24fps rain-on-glass plate. Requires Pillow and ffmpeg.

Original procedural material: no downloaded footage, no alteration of the base photograph.
The matte uses the original 1672 x 941 image coordinates to exclude mullions,
the subject, and furniture. Black is composited with CSS screen blending.
Run from any directory: python scripts/render-hero-rain.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import math
import random
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "hero"
WIDTH, HEIGHT, FPS, SECONDS = 960, 540, 24, 12
random.seed(731)
OUT.mkdir(parents=True, exist_ok=True)

mask = Image.new("L", (WIDTH, HEIGHT), 0)
draw_mask = ImageDraw.Draw(mask)
def polygon(points, fill):
    draw_mask.polygon([(round(x * WIDTH), round(y * HEIGHT)) for x, y in points], fill=fill)

polygon([(0, 0), (.352, 0), (.352, .79), (0, .80)], 255)
polygon([(.378, 0), (.680, 0), (.680, .60), (.565, .60), (.528, .68), (.435, .73), (.435, .78), (.378, .80)], 255)
polygon([(.715, 0), (.900, 0), (.900, .56), (.715, .60)], 255)
# Deliberately generous silhouette exclusion: rain remains behind the still subject.
polygon([(.805, .22), (.842, .22), (.884, .29), (.898, .42), (.88, .58), (.757, .59), (.747, .50), (.719, .451), (.735, .433), (.768, .445), (.777, .36), (.787, .315), (.785, .27)], 0)
mask = mask.filter(ImageFilter.GaussianBlur(2))

drops = [(random.uniform(0, WIDTH), random.random(), random.choice([1, 1, 2]), random.uniform(.35, .85), random.uniform(0, math.tau), random.randint(50, 118)) for _ in range(110)]
beads = [(random.randrange(WIDTH), random.randrange(HEIGHT), random.uniform(.4, 1), random.uniform(0, math.tau)) for _ in range(170)]

command = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo", "-pixel_format", "gray", "-video_size", f"{WIDTH}x{HEIGHT}", "-framerate", str(FPS), "-i", "pipe:0", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(OUT / "rain.mp4")]
encoder = subprocess.Popen(command, stdin=subprocess.PIPE)
for frame in range(FPS * SECONDS):
    phase = frame / (FPS * SECONDS)
    plate = Image.new("L", (WIDTH, HEIGHT), 0)
    pen = ImageDraw.Draw(plate)
    for x, offset, cycles, radius, wave, brightness in drops:
        p = (offset + phase * cycles) % 1
        # Accelerating rivulets with a periodic velocity; wrap occurs off-frame.
        travel = p - .065 * math.sin(math.tau * p)
        y = travel * (HEIGHT + 110) - 55
        xx = x + 1.1 * math.sin(math.tau * phase + wave)
        length = 8 + 13 * radius
        pen.line([(xx - .5, y - length), (xx, y - 4)], fill=int(brightness * .24), width=1)
        pen.ellipse((xx - radius, y - radius * 2.1, xx + radius, y + radius * 1.2), fill=brightness)
        pen.point((round(xx - .6), round(y - 1)), fill=min(210, brightness + 28))
    for x, y, radius, wave in beads:
        value = int(28 + 12 * math.sin(math.tau * phase + wave))
        pen.ellipse((x - radius, y - radius, x + radius, y + radius), fill=value)
    plate = ImageChops.multiply(plate.filter(ImageFilter.GaussianBlur(.35)), mask)
    encoder.stdin.write(plate.tobytes())
encoder.stdin.close()
if encoder.wait() != 0:
    raise RuntimeError("Rain MP4 encode failed")
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(OUT / "rain.mp4"), "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34", "-row-mt", "1", str(OUT / "rain.webm")], check=True)
for asset in (OUT / "rain.mp4", OUT / "rain.webm"):
    print(f"{asset.name}: {asset.stat().st_size / 1024:.0f} KiB")
