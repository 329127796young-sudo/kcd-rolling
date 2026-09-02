from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images" / "boards" / "noble-hall"
W, H = 1536, 1024
random.seed(9022026)


def clamp(value: float, low: int = 0, high: int = 255) -> int:
    return max(low, min(high, int(value)))


def make_base() -> Image.Image:
    image = Image.new("RGB", (W, H))
    pixels = image.load()
    plank_height = 164
    plank_colors = [
        (63, 39, 27),
        (70, 43, 29),
        (58, 36, 25),
        (76, 47, 31),
        (61, 38, 27),
        (72, 44, 29),
        (55, 34, 24),
    ]

    for y in range(H):
        plank = min(len(plank_colors) - 1, y // plank_height)
        base_r, base_g, base_b = plank_colors[plank]
        plank_phase = (y % plank_height) / plank_height
        for x in range(W):
            grain_a = math.sin(x * 0.020 + y * 0.003 + plank * 1.7)
            grain_b = math.sin(x * 0.071 - y * 0.008 + plank * 0.4)
            grain_c = math.sin(x * 0.0035 + math.sin(y * 0.018) * 2.0)
            edge_shadow = min(1.0, min(x, W - x - 1) / 190, min(y, H - y - 1) / 125)
            edge_shadow = 1.0 - max(0.0, edge_shadow)
            noise = random.uniform(-2.4, 2.4)
            variation = grain_a * 3.1 + grain_b * 1.7 + grain_c * 2.4 + noise
            seam_tone = -8 if y % plank_height < 4 else 0
            warm = (1.0 - plank_phase) * 1.2
            pixels[x, y] = (
                clamp(base_r + variation + seam_tone - edge_shadow * 13),
                clamp(base_g + variation * 0.72 + seam_tone * 0.7 - edge_shadow * 9),
                clamp(base_b + variation * 0.5 + seam_tone * 0.45 - edge_shadow * 6 + warm),
            )

    grain = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(grain)
    for _ in range(460):
        y = random.randint(15, H - 15)
        x = random.randint(-80, W - 100)
        length = random.randint(35, 260)
        bend = random.randint(-13, 13)
        alpha = random.randint(15, 42)
        color = (145, 93, 55, alpha) if random.random() > 0.3 else (25, 14, 9, alpha)
        draw.line((x, y, x + length // 2, y + bend, x + length, y + random.randint(-8, 8)), fill=color, width=random.choice([1, 1, 2]))
    for _ in range(32):
        cx = random.randint(60, W - 60)
        cy = random.randint(50, H - 50)
        rx = random.randint(9, 30)
        ry = max(3, int(rx * random.uniform(0.22, 0.42)))
        draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), outline=(23, 12, 8, 40), width=2)
        draw.arc((cx - rx - 12, cy - ry - 4, cx + rx + 12, cy + ry + 4), 170, 345, fill=(164, 103, 56, 24), width=1)
    grain = grain.filter(ImageFilter.GaussianBlur(0.45))
    image = Image.alpha_composite(image.convert("RGBA"), grain)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Refined leather inset and brass edging, kept outside the play area.
    draw.rounded_rectangle((18, 18, W - 18, H - 18), radius=18, outline=(30, 15, 9, 230), width=24)
    draw.rounded_rectangle((35, 35, W - 35, H - 35), radius=12, outline=(126, 76, 42, 145), width=3)
    draw.rounded_rectangle((48, 48, W - 48, H - 48), radius=9, outline=(185, 142, 76, 85), width=1)
    for x in (72, W - 72):
        for y in (72, H - 72):
            draw.ellipse((x - 7, y - 7, x + 7, y + 7), fill=(149, 109, 56, 180), outline=(226, 190, 112, 120), width=1)
            draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(46, 26, 15, 170))
    image = Image.alpha_composite(image, overlay)

    # Keep the center calm for dice readability while retaining warm peripheral light.
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vp = vignette.load()
    for y in range(H):
        for x in range(W):
            dx = (x - W / 2) / (W / 2)
            dy = (y - H / 2) / (H / 2)
            distance = min(1.0, math.sqrt(dx * dx + dy * dy) / 1.15)
            vp[x, y] = (7, 3, 1, clamp(distance * 88))
    image = Image.alpha_composite(image, vignette)
    return ImageEnhance.Color(image).enhance(0.82)


def make_wear() -> Image.Image:
    wear = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(wear)
    edge_zones = [
        (random.randint(55, W - 55), random.randint(55, 115)),
        (random.randint(55, W - 55), random.randint(H - 115, H - 55)),
        (random.randint(55, 115), random.randint(125, H - 125)),
        (random.randint(W - 115, W - 55), random.randint(125, H - 125)),
    ]
    for _ in range(42):
        x, y = random.choice(edge_zones)
        length = random.randint(18, 94)
        angle = random.uniform(-0.5, 0.5)
        x2 = x + math.cos(angle) * length
        y2 = y + math.sin(angle) * length
        draw.line((x, y, x2, y2), fill=(28, 13, 7, random.randint(35, 95)), width=random.choice([1, 2]))
        if random.random() > 0.5:
            draw.line((x + 2, y + 2, x2 + 5, y2 + 2), fill=(214, 153, 80, random.randint(18, 44)), width=1)
    for _ in range(18):
        x, y = random.choice(edge_zones)
        rx = random.randint(12, 40)
        ry = random.randint(3, 9)
        draw.ellipse((x - rx, y - ry, x + rx, y + ry), outline=(27, 13, 7, random.randint(42, 90)), width=2)
        draw.arc((x - rx - 6, y - ry - 2, x + rx + 6, y + ry + 2), 180, 355, fill=(210, 151, 83, 40), width=1)
    for x, y in [(118, 120), (W - 130, 180), (108, H - 130), (W - 145, H - 120)]:
        draw.line((x, y, x + random.randint(-8, 8), y + random.randint(20, 62)), fill=(211, 165, 95, 62), width=3)
        draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(213, 164, 87, 34))
    return wear


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    base = make_base()
    base.convert("RGB").save(OUT / "base.webp", "WEBP", quality=88, method=6)
    make_wear().save(OUT / "wear.png", "PNG", optimize=True)
    base.convert("RGB").resize((640, 427), Image.Resampling.LANCZOS).save(OUT / "thumbnail.webp", "WEBP", quality=86, method=6)


if __name__ == "__main__":
    main()
