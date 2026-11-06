import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

IMAGES_DIR = "public/images-webp"

TARGET_COLORS = {
    "white": (238, 238, 235),
    "black": (36, 37, 40),
    "ivory": (222, 198, 162),
}

def apply_finish(arr_rgb, mask, target_rgb, finish_key):
    arr_f = arr_rgb.astype(np.float32) / 255.0
    lum = 0.299 * arr_f[:, :, 0] + 0.587 * arr_f[:, :, 1] + 0.114 * arr_f[:, :, 2]
    tr, tg, tb = [c / 255.0 for c in target_rgb]

    if finish_key == "white":
        tinted = np.stack([
            tr * np.clip(lum * 0.85 + 0.35, 0, 1),
            tg * np.clip(lum * 0.85 + 0.35, 0, 1),
            tb * np.clip(lum * 0.85 + 0.35, 0, 1),
        ], axis=-1)
    elif finish_key == "black":
        tinted = np.stack([
            tr * np.clip(lum * 1.8 + 0.05, 0, 1),
            tg * np.clip(lum * 1.8 + 0.05, 0, 1),
            tb * np.clip(lum * 1.8 + 0.05, 0, 1),
        ], axis=-1)
    elif finish_key == "ivory":
        tinted = np.stack([
            tr * np.clip(lum * 0.95 + 0.15, 0, 1),
            tg * np.clip(lum * 0.95 + 0.15, 0, 1),
            tb * np.clip(lum * 0.95 + 0.15, 0, 1),
        ], axis=-1)
    else:
        tinted = arr_f

    m3 = mask[:, :, np.newaxis]
    blended = arr_f * (1.0 - m3) + tinted * m3
    return np.clip(blended * 255.0, 0, 255.0).astype(np.uint8)

def get_mask_cupboard1(arr):
    h, w, _ = arr.shape
    im_mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(im_mask)
    draw.polygon([(58, 94), (152, 32), (165, 946), (75, 870)], fill=255)
    draw.polygon([(155, 31), (574, 125), (567, 815), (168, 948)], fill=255)
    draw.rectangle([342, 116, 457, 632], fill=0)
    im_blurred = im_mask.filter(ImageFilter.GaussianBlur(1.2))
    return np.array(im_blurred).astype(np.float32) / 255.0

def get_mask_cupboard2(arr):
    h, w, _ = arr.shape
    mask = np.zeros((h, w), dtype=np.float32)
    for y in range(15, min(h, 1320)):
        for x in range(45, min(w, 725)):
            r, g, b = arr[y, x]
            if r > 240 and g > 240 and b > 240:
                continue
            if 420 <= x <= 590 and 120 <= y <= 975:
                continue
            if r > 190 and g > 190 and b > 190:
                continue
            mask[y, x] = 1.0

    im_m = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
    return np.array(im_m).astype(np.float32) / 255.0

def get_mask_cupboard3(arr):
    is_colored = ((arr[:, :, 0] > 120) & (arr[:, :, 1] < 100)) | \
                 ((arr[:, :, 2] > 65) & (arr[:, :, 1] < 80) & (arr[:, :, 0] > 30))
    im_m = Image.fromarray((is_colored * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    return np.array(im_m).astype(np.float32) / 255.0

def get_mask_cupboard4(arr):
    # Pink has high red & blue compared to green:
    is_pink = (arr[:, :, 0] > arr[:, :, 1] + 25) & (arr[:, :, 2] > arr[:, :, 1] + 15) & (arr[:, :, 0] > 130)
    im_m = Image.fromarray((is_pink * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.0))
    return np.array(im_m).astype(np.float32) / 255.0

def get_mask_cupboard5(arr):
    is_blue = (arr[:, :, 2] > arr[:, :, 0] + 20) & (arr[:, :, 2] > arr[:, :, 1] + 10) & (arr[:, :, 2] > 50)
    im_m = Image.fromarray((is_blue * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.0))
    return np.array(im_m).astype(np.float32) / 255.0

def get_mask_metal_drawer2(arr):
    h, w, _ = arr.shape
    mask = np.zeros((h, w), dtype=np.float32)
    for y in range(450, 935):
        for x in range(56, 392):
            r, g, b = arr[y, x]
            if r < 80 and g < 80 and b < 80:
                continue
            mask[y, x] = 1.0
    im_m = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
    return np.array(im_m).astype(np.float32) / 255.0

def get_mask_white_bg_product(arr):
    is_bg = (arr[:, :, 0] > 242) & (arr[:, :, 1] > 242) & (arr[:, :, 2] > 242)
    is_handle = (arr[:, :, 0] < 55) & (arr[:, :, 1] < 55) & (arr[:, :, 2] < 55)
    mask = (~is_bg & ~is_handle).astype(np.float32)
    im_m = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
    return np.array(im_m).astype(np.float32) / 255.0

def process_file(stem):
    src_file = os.path.join(IMAGES_DIR, f"{stem}.webp")
    if not os.path.exists(src_file):
        return
    img = Image.open(src_file).convert("RGB")
    arr = np.array(img)

    if stem == "cupboard1":
        mask = get_mask_cupboard1(arr)
    elif stem == "cupboard2":
        mask = get_mask_cupboard2(arr)
    elif stem == "cupboard3":
        mask = get_mask_cupboard3(arr)
    elif stem == "cupboard4":
        mask = get_mask_cupboard4(arr)
    elif stem == "cupboard5":
        mask = get_mask_cupboard5(arr)
    elif stem == "metal-drawer2":
        mask = get_mask_metal_drawer2(arr)
    else:
        mask = get_mask_white_bg_product(arr)

    img.save(os.path.join(IMAGES_DIR, f"{stem}_grey.webp"), quality=90)

    for color_key, target_rgb in TARGET_COLORS.items():
        recolored = apply_finish(arr, mask, target_rgb, color_key)
        out_path = os.path.join(IMAGES_DIR, f"{stem}_{color_key}.webp")
        Image.fromarray(recolored).save(out_path, quality=90)

def main():
    stems = [
        "cupboard1", "cupboard2", "cupboard3", "cupboard4", "cupboard5",
        "metal-drawer1", "metal-drawer2", "metal-drawer3", "metal-drawer4", "metal-drawer5",
        "library1", "library2", "library3", "library4", "library5", "library6", "library7"
    ]
    for s in stems:
        process_file(s)
    print("Recoloring complete!")

if __name__ == "__main__":
    main()
