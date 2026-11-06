-- Move the Premium Executive Table product into the Employee Table category.
-- CMS stores Employee Table as the Employee Desk subcategory (id 40).
UPDATE products
SET sub_category_id = 40,
    updated_at = CURRENT_TIMESTAMP
WHERE category_id = 10
  AND sub_category_id = 43
  AND LOWER(TRIM(name)) = 'premium executive table'
  AND EXISTS (
    SELECT 1
    FROM sub_categories
    WHERE id = 40
      AND category_id = 10
  );
