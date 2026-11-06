"""
Generate WHITE and BLACK color variants for all cupboard/library/metal-drawer images.
- WHITE variant: bright clean white powder coat look (luminance-preserved, near white tone)
- BLACK variant: deep matte black powder coat look (same as charcoal but using true black)
Also copies grey and ivory existing files to ensure consistency.
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import os
import re

IMAGES_DIR = 'public/images-webp'

# Colors: (R, G, B) target color for the powder coat
COLORS = {
    'white': (230, 230, 228),      # Bright white powder coat (warm white with tiny grey tint)
    'black': (30, 30, 35),         # Matte black powder coat
    # grey and ivory already exist, but we'll keep them in the list for reference
}

def make_mask(img_array, w, h):
    """
    Generic mask: colorize everything that is NOT background white/floor.
    Background is identified as high-luminance, desaturated outer regions.
    We'll use a simple color thresholding approach.
    """
    arr_f = img_array.astype(np.float32) / 255.0
    
    # Luminance
    lum = 0.299 * arr_f[:, :, 0] + 0.587 * arr_f[:, :, 1] + 0.114 * arr_f[:, :, 2]
    
    # Max - min channel (saturation proxy)
    c_max = np.max(arr_f, axis=2)
    c_min = np.min(arr_f, axis=2)
    sat = c_max - c_min
    
    # Background: very bright (lum > 0.88) AND low saturation (sat < 0.05)
    # Floor: lum > 0.78, warm (R > B+0.05)
    is_background = (lum > 0.88) & (sat < 0.06)
    is_floor = (lum > 0.75) & (arr_f[:, :, 0] > arr_f[:, :, 2] + 0.04) & (sat < 0.08)
    
    # Product mask = NOT background AND NOT floor
    product_mask = ~(is_background | is_floor)
    
    # Morphological: small erosion to avoid edge fringe
    from PIL import Image as PILImage
    mask_img = PILImage.fromarray((product_mask * 255).astype(np.uint8))
    # Slight blur for smooth edges
    mask_blurred = mask_img.filter(ImageFilter.GaussianBlur(1.5))
    return np.array(mask_blurred).astype(np.float32) / 255.0


def colorize_image(src_path, dst_path, target_rgb):
    """Apply powder coat colorization to a product image."""
    img = Image.open(src_path).convert('RGB')
    w, h = img.size
    arr = np.array(img, dtype=np.float32) / 255.0
    
    # Get product mask
    mask = make_mask(np.array(img), w, h)
    
    # Target color normalized
    tr, tg, tb = [c / 255.0 for c in target_rgb]
    
    # Luminance of source image (preserves texture/depth)
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    
    # For white: we want bright surfaces to look white, dark surfaces to look dark white
    # For black: we want bright surfaces to look lighter black, dark to look very dark
    
    # Method: multiply target color by (lum * scale) clamped
    # scale controls brightness of the tinted output
    if max(target_rgb) > 180:  # WHITE variant
        # For white, we brighten uniformly but keep some texture
        scale = 1.05
        tinted = np.stack([
            tr * np.clip(lum * scale + 0.15, 0, 1),
            tg * np.clip(lum * scale + 0.15, 0, 1),
            tb * np.clip(lum * scale + 0.15, 0, 1),
        ], axis=-1)
    else:  # BLACK variant
        scale = 2.5
        tinted = np.stack([
            tr * np.clip(lum * scale, 0, 1),
            tg * np.clip(lum * scale, 0, 1),
            tb * np.clip(lum * scale, 0, 1),
        ], axis=-1)
    
    tinted = np.clip(tinted, 0, 1)
    
    # Blend: product = tinted, background = original
    mask_3d = mask[:, :, np.newaxis]
    result = arr * (1.0 - mask_3d) + tinted * mask_3d
    result = np.clip(result * 255, 0, 255).astype(np.uint8)
    
    Image.fromarray(result).save(dst_path, format='WEBP', quality=88)
    print(f'  Saved: {dst_path}')


def main():
    all_files = os.listdir(IMAGES_DIR)
    base_images = [
        f for f in all_files
        if f.endswith('.webp') and re.match(r'(cupboard|metal-drawer|library)\d+\.webp$', f)
    ]
    base_images.sort()
    
    print(f'Found {len(base_images)} base images to process.\n')
    
    for base_file in base_images:
        src = os.path.join(IMAGES_DIR, base_file)
        stem = base_file.replace('.webp', '')
        print(f'Processing: {base_file}')
        
        for color_key, rgb in COLORS.items():
            dst = os.path.join(IMAGES_DIR, f'{stem}_{color_key}.webp')
            colorize_image(src, dst, rgb)
        
        print()
    
    print('Done! Generated WHITE and BLACK variants for all products.')


if __name__ == '__main__':
    main()
