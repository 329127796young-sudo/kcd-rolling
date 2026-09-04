from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "assets" / "images"
LEFT = IMAGE_DIR / "03B.webp"
RIGHT = IMAGE_DIR / "04B.webp"
OUTPUT = IMAGE_DIR / "homepage-bg-03B-04B.webp"


def main() -> None:
    left = Image.open(LEFT).convert("RGB")
    right = Image.open(RIGHT).convert("RGB")
    canvas = Image.new("RGB", (left.width + right.width, max(left.height, right.height)), (18, 17, 14))
    canvas.paste(left, (0, 0))
    canvas.paste(right, (left.width, 0))
    canvas.save(OUTPUT, "WEBP", quality=90, method=6)
    print(f"generated {OUTPUT} ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()
