-- 1. Swap product images for Executive Office Desk (product_id = 102)
-- Make image 2 (mesa-diretor...) the primary image (display_order = 0, is_primary = true)
-- and image 1 (anderson-executive...) the secondary image (display_order = 1, is_primary = false).
BEGIN;

UPDATE product_images
SET display_order = 0, is_primary = true
WHERE product_id = 102
  AND image_url LIKE '%mesa-diretor%';

UPDATE product_images
SET display_order = 1, is_primary = false
WHERE product_id = 102
  AND image_url LIKE '%anderson-executive%';

UPDATE products
SET updated_at = CURRENT_TIMESTAMP
WHERE id = 102;

-- 2. Rename Premium Table / Premium Front Desk subcategory to Reception Desk across CMS and storefront
UPDATE sub_categories
SET name = 'Reception Desk', updated_at = CURRENT_TIMESTAMP
WHERE id = 44
   OR (category_id = 10 AND LOWER(TRIM(name)) IN ('premium table', 'premium front desk', 'reception table'));

COMMIT;
