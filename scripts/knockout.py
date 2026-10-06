"""Turn studio product photos into solid transparent cutouts.

The previous flood fill walked into the garment: any neighbour within 16
levels was treated as backdrop, then a second pass deleted near-white
fabric. Smooth cream, white, and light-blue cloth was erased.

This version uses BRIA RMBG to separate the studio backdrop from the
clothes, then forces the garment mask fully opaque. It never runs a
light-fabric delete. Olive trousers and washed jeans also lose the white
sticker stroke, peeled only where near-white pixels touch transparency.
"""

from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(r"C:\Users\user\.cursor\projects\c-Users-user-Desktop-Uthkarsh\assets")
PREFIX = "c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_45bc495550e3a3b5277c5bc28b56d4b1_images_"
OUT = Path(r"C:\Users\user\Desktop\Uthkarsh\public\catalogue")

FILES = {
    "striped-jersey": "48c550d5a71b40684a0f46197556859d-bb8865da-6e84-4ad6-9459-d8a53a8a71b1.jpg",
    "cable-polo": "32b0f5eb30d2f6e75f81aa766fdc1989-349db39f-b0dd-49ee-b127-023f3346be47.jpg",
    "washed-jeans": "13b4a6aa64fb0854d8d7d6e582df642d-d2584dd2-31e8-49a7-9bb6-2cd78137faa6.jpg",
    "faded-jeans": "58d5050ef8e9b0c370b099b25fa9187a-a3d79f22-d818-4835-a5d0-698ec00150a7.jpg",
    "light-jeans": "89f249bf770f26595a3dca197cdcb928-9e3844e5-70c5-470e-80cb-afd44963d103.jpg",
    "olive-trousers": "952129590a0cb934971fb405b1ce688d-7f8924e8-f3fb-4d57-91a0-f30853ac7072.jpg",
    "brown-polo": "ba6ad169dc07b97a313f7743df6e3d2d-d0e0b4d2-d4d2-4dde-b859-658414ef90f7.jpg",
    "blue-tee": "c72159872c86159bba194a771580ea89-0a3afc54-cf1e-4564-8e3a-b331b4601a2e.jpg",
    "blueberry-tee": "04be99105b3a0e227a50fc8b94b9528b-906a4a23-596d-4580-b152-305857184018.jpg",
    "crest-sweatshirt": "download-5fdde1ea-ffbd-47af-aad6-67fa7ec66f9a.png",
    "grid-shirt": "download__2_-b8ce193d-9430-4cbc-8df3-470853ea3a18.png",
    "indigo-jeans": "download__1_-c2dd007d-9e7d-431d-98b7-81e62977adf5.jpg",
}

# White sticker stroke sits outside the cloth on these two only.
STICKER_OUTLINE = {"olive-trousers", "washed-jeans"}
MAX_EDGE = 1600
EIGHT = np.ones((3, 3), dtype=int)


def limit_size(image: Image.Image) -> Image.Image:
    width, height = image.size
    if max(width, height) <= MAX_EDGE:
        return image
    scale = MAX_EDGE / max(width, height)
    return image.resize(
        (round(width * scale), round(height * scale)),
        Image.Resampling.LANCZOS,
    )


def largest_component(mask: np.ndarray) -> np.ndarray:
    labeled, count = ndimage.label(mask, structure=EIGHT)
    if count == 0:
        return mask
    sizes = np.bincount(labeled.ravel())
    sizes[0] = 0
    return labeled == int(sizes.argmax())


def solidify(image: Image.Image) -> Image.Image:
    """Keep one garment and make it fully opaque. Backdrop stays clear."""
    array = np.array(image)
    garment = largest_component(array[:, :, 3] >= 16)
    array[:, :, 3] = np.where(garment, 255, 0).astype(np.uint8)
    return Image.fromarray(array)


def strip_sticker_outline(image: Image.Image, rounds: int = 28) -> Image.Image:
    """Peel a near-white stroke that touches transparency. Cloth is not white, so the peel stops."""
    array = np.array(image)
    rgb = array[:, :, :3]
    alpha = array[:, :, 3]
    for _ in range(rounds):
        opaque = alpha > 0
        low = rgb.min(axis=2)
        high = rgb.max(axis=2)
        near_white = opaque & (low >= 232) & ((high - low) <= 18)
        transparent = np.pad(alpha == 0, 1, constant_values=True)
        touches = np.zeros(opaque.shape, dtype=bool)
        for dy in range(3):
            for dx in range(3):
                if dx == 1 and dy == 1:
                    continue
                touches |= transparent[dy : dy + opaque.shape[0], dx : dx + opaque.shape[1]]
        peel = near_white & touches
        if not peel.any():
            break
        alpha[peel] = 0
    array[:, :, 3] = alpha
    # The stroke can leave a disconnected scrap; keep the garment.
    garment = largest_component(alpha > 0)
    array[:, :, 3] = np.where(garment, alpha, 0)
    return Image.fromarray(array)


def crop_pad(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    if not bbox:
        return image
    left, top, right, bottom = bbox
    pad_x = max(8, round((right - left) * 0.04))
    pad_y = max(8, round((bottom - top) * 0.04))
    width, height = image.size
    return image.crop(
        (
            max(0, left - pad_x),
            max(0, top - pad_y),
            min(width, right + pad_x),
            min(height, bottom + pad_y),
        )
    )


def knockout(src: Path, session, name: str) -> Image.Image:
    image = Image.open(src).convert("RGBA")
    image = limit_size(image)
    cutout = remove(image, session=session, post_process_mask=False)
    if not isinstance(cutout, Image.Image):
        raise TypeError(f"unexpected rembg result for {name}")
    cutout = solidify(cutout)
    if name in STICKER_OUTLINE:
        cutout = strip_sticker_outline(cutout)
    return crop_pad(cutout)


def measure(image: Image.Image) -> dict:
    alpha = np.array(image)[:, :, 3]
    opaque = alpha >= 128
    total = opaque.size
    opaque_count = int(opaque.sum())
    ratio = opaque_count / total if total else 0.0
    labeled, count = ndimage.label(opaque, structure=EIGHT)
    sizes = np.bincount(labeled.ravel())
    sizes[0] = 0
    largest = int(sizes.max()) if count else 0
    # Transparent islands that do not touch the canvas edge are holes.
    holes = ~opaque
    hole_labels, hole_count = ndimage.label(holes, structure=EIGHT)
    if hole_count:
        border = np.unique(
            np.concatenate(
                [
                    hole_labels[0, :],
                    hole_labels[-1, :],
                    hole_labels[:, 0],
                    hole_labels[:, -1],
                ]
            )
        )
        hole_sizes = np.bincount(hole_labels.ravel())
        interior = [
            int(hole_sizes[index])
            for index in range(1, len(hole_sizes))
            if index not in border and hole_sizes[index] > 0
        ]
    else:
        interior = []
    speckles = sum(1 for size in interior if size < 80)
    return {
        "opaque": ratio,
        "components": int(count),
        "largest_share": (largest / opaque_count) if opaque_count else 0.0,
        "speckles": speckles,
        "holes": len(interior),
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    session = new_session("bria-rmbg")
    failed: list[str] = []
    for name, filename in FILES.items():
        image = knockout(ROOT / f"{PREFIX}{filename}", session, name)
        destination = OUT / f"{name}.png"
        image.save(destination, "PNG")
        stats = measure(image)
        ok = stats["opaque"] >= 0.15 and stats["largest_share"] >= 0.9 and stats["speckles"] < 25
        flag = "ok" if ok else "BAD"
        if not ok:
            failed.append(name)
        print(
            f"{flag} {name} {image.size[0]}x{image.size[1]} "
            f"opaque={stats['opaque']:.1%} components={stats['components']} "
            f"largest={stats['largest_share']:.1%} speckles={stats['speckles']} holes={stats['holes']}"
        )
    if failed:
        raise SystemExit(f"cutouts still wrong: {', '.join(failed)}")


if __name__ == "__main__":
    main()
