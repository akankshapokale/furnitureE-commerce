-- Keep the existing three-door storage listing in Unit Cupboard and reuse the
-- established Storewell photo set in its product gallery.
BEGIN;

UPDATE products
SET sub_category_id = 4,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 708
  AND category_id = 8
  AND EXISTS (
    SELECT 1 FROM sub_categories
    WHERE id = 4 AND category_id = 8 AND is_active = TRUE
  );

UPDATE product_images
SET image_url = CASE display_order
      WHEN 0 THEN '/images-webp/cupboard1.webp'
      WHEN 1 THEN '/images-webp/cupboard2.webp'
      WHEN 2 THEN '/images-webp/cupboard5.webp'
      ELSE image_url
    END,
    alt_text = 'Heavy-Duty Three-Door Steel Storage Cabinet',
    display_order = LEAST(display_order, 2),
    is_primary = (display_order = 0)
WHERE product_id = 708
  AND display_order BETWEEN 0 AND 2;

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 708, desired.image_url, 'Heavy-Duty Three-Door Steel Storage Cabinet', desired.display_order, desired.display_order = 0
FROM (VALUES
  ('/images-webp/cupboard1.webp', 0),
  ('/images-webp/cupboard2.webp', 1),
  ('/images-webp/cupboard5.webp', 2)
) AS desired(image_url, display_order)
WHERE EXISTS (SELECT 1 FROM products WHERE id = 708 AND category_id = 8 AND sub_category_id = 4)
  AND NOT EXISTS (
    SELECT 1 FROM product_images existing
    WHERE existing.product_id = 708 AND existing.image_url = desired.image_url
  );

UPDATE product_images
SET is_primary = (image_url = '/images-webp/cupboard1.webp'),
    display_order = CASE image_url
      WHEN '/images-webp/cupboard1.webp' THEN 0
      WHEN '/images-webp/cupboard2.webp' THEN 1
      WHEN '/images-webp/cupboard5.webp' THEN 2
      ELSE display_order
    END
WHERE product_id = 708
  AND image_url IN (
    '/images-webp/cupboard1.webp',
    '/images-webp/cupboard2.webp',
    '/images-webp/cupboard5.webp'
  );

COMMIT;
