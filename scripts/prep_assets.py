"""Prepare the ChatGPT-generated source art for use on the site.

Reads from `images/` and writes web-ready WebP into `public/images/`:

  1. Splits the four-up `Styles.png` contact sheet into one image per service.
  2. Knocks the baked-in white background off the logo and masks it to its circle.
  3. Centre-crops and re-encodes any new drops listed in MANIFEST.

Safe to re-run — it simply overwrites. Drop new artwork into `images/` with a
filename containing the keyword shown in the "missing" list, then run:

    python scripts/prep_assets.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images"
OUT = ROOT / "public" / "images"

WHITE_CUTOFF = 242  # a pixel counts as background above this on every channel

# keyword in source filename -> (output name, max width, target aspect w/h)
MANIFEST: dict[str, tuple[str, int, float | None]] = {
    "about": ("interior", 1800, 16 / 9),
    "promo": ("promo-card", 1200, 4 / 3),
}

# Source files consumed by the bespoke passes, so they're skipped by MANIFEST.
RESERVED = {"logo", "styles", "hero image", "home page", "full web page", "barber portraits"}

# The portraits contact sheet, read left-to-right then top-to-bottom. Three of
# the eight are the team; the rest become service photography, which is what
# stops the same four images repeating across the services page.
PORTRAIT_GRID = [
    "barber-barbra",    # afro, laughing — same person as the logo and hero
    "barber-neo",       # fade, full beard, hair design
    "service-shave",    # head tilted back, heavy beard
    "barber-zuri",      # tapered sides, short natural
    "service-package",  # fade and beard together
    "service-twists",   # twisted natural styling
    "service-lineup",   # waves with a sharp line-up
    "service-styling",  # cornrows
]


def non_white_mask(img: Image.Image) -> Image.Image:
    """1-bit mask: white where the pixel is *not* page background."""
    grey = img.convert("L")
    return grey.point(lambda v: 0 if v >= WHITE_CUTOFF else 255, mode="1")


def runs(flags: list[bool], min_len: int) -> list[tuple[int, int]]:
    """Collapse a boolean sequence into (start, end) spans of True, dropping noise."""
    spans, start = [], None
    for i, flag in enumerate(flags):
        if flag and start is None:
            start = i
        elif not flag and start is not None:
            if i - start >= min_len:
                spans.append((start, i))
            start = None
    if start is not None and len(flags) - start >= min_len:
        spans.append((start, len(flags)))
    return spans


def save_webp(img: Image.Image, dest: Path, max_width: int, quality: int = 82) -> None:
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, round(img.height * ratio)), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=quality, method=6)


def centre_crop(img: Image.Image, aspect: float) -> Image.Image:
    """Crop to the given width/height ratio, keeping the middle of the frame."""
    current = img.width / img.height
    if abs(current - aspect) < 0.01:
        return img

    if current > aspect:  # too wide — trim the sides
        width = round(img.height * aspect)
        left = (img.width - width) // 2
        return img.crop((left, 0, left + width, img.height))

    # too tall — trim top and bottom, biased slightly upward to favour faces
    height = round(img.width / aspect)
    top = round((img.height - height) * 0.35)
    return img.crop((0, top, img.width, top + height))


def split_contact_sheet(path: Path, names: list[str]) -> None:
    """Cut a horizontal strip of panels separated by white gutters."""
    img = Image.open(path).convert("RGB")
    mask = non_white_mask(img)
    w, h = img.size

    cols = [
        sum(mask.getpixel((x, y)) > 0 for y in range(0, h, 4)) > (h / 4) * 0.15
        for x in range(w)
    ]
    spans = runs(cols, min_len=w // 20)

    if len(spans) != len(names):
        raise SystemExit(
            f"Expected {len(names)} panels in {path.name}, found {len(spans)}: {spans}"
        )

    for (x0, x1), name in zip(spans, names):
        panel = img.crop((x0, 0, x1, h))
        pmask = non_white_mask(panel)
        pw, ph = panel.size
        rows = [any(pmask.getpixel((x, y)) > 0 for x in range(0, pw, 4)) for y in range(ph)]
        vspans = runs(rows, min_len=ph // 10)
        if vspans:
            panel = panel.crop((0, vspans[0][0], pw, vspans[-1][1]))
        save_webp(panel, OUT / f"{name}.webp", max_width=900)
        print(f"  {name}.webp  <- x{x0}..{x1}  {panel.size[0]}x{panel.size[1]}")


def split_grid(path: Path, names: list[str], cols: int, rows: int, aspect: float) -> None:
    """Cut a grid of panels separated by white gutters, read row by row."""
    img = Image.open(path).convert("RGB")
    mask = non_white_mask(img)
    w, h = img.size

    col_flags = [
        sum(mask.getpixel((x, y)) > 0 for y in range(0, h, 6)) > (h / 6) * 0.2
        for x in range(w)
    ]
    row_flags = [
        sum(mask.getpixel((x, y)) > 0 for x in range(0, w, 6)) > (w / 6) * 0.2
        for y in range(h)
    ]

    col_spans = runs(col_flags, min_len=w // (cols * 3))
    row_spans = runs(row_flags, min_len=h // (rows * 3))

    if len(col_spans) != cols or len(row_spans) != rows:
        raise SystemExit(
            f"Expected a {cols}x{rows} grid in {path.name}, "
            f"found {len(col_spans)} columns and {len(row_spans)} rows"
        )

    for row_index, (y0, y1) in enumerate(row_spans):
        for col_index, (x0, x1) in enumerate(col_spans):
            name = names[row_index * cols + col_index]
            panel = centre_crop(img.crop((x0, y0, x1, y1)), aspect)
            save_webp(panel, OUT / f"{name}.webp", max_width=800)
            print(f"  {name}.webp  <- r{row_index + 1}c{col_index + 1}  {panel.size[0]}x{panel.size[1]}")


def circular_logo(path: Path) -> None:
    """The logo is a circular badge sitting on an opaque white square. Cut it out."""
    img = Image.open(path).convert("RGBA")
    mask = non_white_mask(img)
    box = mask.getbbox()
    if box is None:
        raise SystemExit("Logo appears to be blank")

    x0, y0, x1, y1 = box
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    radius = min(x1 - x0, y1 - y0) / 2

    # Supersample the mask so the circle edge antialiases cleanly.
    scale = 4
    big = Image.new("L", (img.width * scale, img.height * scale), 0)
    ImageDraw.Draw(big).ellipse(
        [
            (cx - radius) * scale,
            (cy - radius) * scale,
            (cx + radius) * scale,
            (cy + radius) * scale,
        ],
        fill=255,
    )
    alpha = big.resize(img.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.4))
    img.putalpha(alpha)

    logo = img.crop(
        (int(cx - radius), int(cy - radius), int(cx + radius), int(cy + radius))
    ).resize((512, 512), Image.LANCZOS)

    OUT.mkdir(parents=True, exist_ok=True)
    logo.save(OUT / "logo.webp", "WEBP", quality=92, method=6)
    logo.save(OUT / "logo.png", "PNG", optimize=True)  # favicon / OG source
    logo.resize((180, 180), Image.LANCZOS).save(ROOT / "src" / "app" / "apple-icon.png", "PNG")
    logo.save(ROOT / "src" / "app" / "icon.png", "PNG")
    print(f"  logo.webp + logo.png + app icons  <- circle r={radius:.0f}")


def process_manifest() -> set[str]:
    """Convert any new drops that match a MANIFEST keyword. Returns keywords done."""
    done: set[str] = set()

    for path in sorted(SRC.iterdir()):
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        stem = path.stem.lower()
        if any(word in stem for word in RESERVED):
            continue

        match = next((key for key in MANIFEST if key in stem), None)
        if match is None:
            print(f"  (skipped, no manifest match) {path.name}")
            continue

        name, max_width, aspect = MANIFEST[match]
        img = Image.open(path).convert("RGB")
        before = img.size
        if aspect:
            img = centre_crop(img, aspect)
        save_webp(img, OUT / f"{name}.webp", max_width=max_width)
        done.add(match)
        print(f"  {name}.webp  <- {path.name}  {before[0]}x{before[1]} -> {img.size[0]}x{img.size[1]}")

    return done


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    print("Logo:")
    circular_logo(SRC / "Logo.png")

    print("Service contact sheet:")
    split_contact_sheet(
        SRC / "Styles.png",
        ["service-haircut", "service-fade", "service-beard", "service-kids"],
    )

    print("Portraits contact sheet:")
    split_grid(SRC / "Barber Portraits.png", PORTRAIT_GRID, cols=4, rows=2, aspect=3 / 4)

    print("Hero:")
    hero = Image.open(SRC / "Hero Image.png").convert("RGB")
    save_webp(hero, OUT / "hero.webp", max_width=1920, quality=80)
    save_webp(hero, OUT / "hero-mobile.webp", max_width=900, quality=78)
    print(f"  hero.webp + hero-mobile.webp  <- {hero.size[0]}x{hero.size[1]}")

    print("New drops:")
    done = process_manifest()
    if not done:
        print("  (none found)")

    missing = [key for key in MANIFEST if key not in done]
    if missing:
        print("\nStill outstanding — drop a file whose name contains:")
        for key in missing:
            name, _, aspect = MANIFEST[key]
            ratio = "any" if aspect is None else f"{aspect:.2f}:1"
            print(f"  '{key}'  -> public/images/{name}.webp   (crops to {ratio})")

    print("\nOutput:")
    for f in sorted(OUT.glob("*")):
        print(f"  {f.name:28} {f.stat().st_size / 1024:8.1f} KB")


if __name__ == "__main__":
    main()
