-- Keep storewell listings under Cupboards & Almirahs, not Office Furniture.
BEGIN;

UPDATE products
SET category_id = 8,
    sub_category_id = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE sub_category_id = 47
  AND category_id = 10;

UPDATE sub_categories
SET is_active = FALSE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 47
  AND category_id = 10
  AND is_active = TRUE;

COMMIT;
