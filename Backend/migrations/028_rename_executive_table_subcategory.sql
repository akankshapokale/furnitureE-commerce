-- Rename the office furniture subcategory to match the shorter storefront label.
UPDATE sub_categories
SET name = 'Executive Table', updated_at = CURRENT_TIMESTAMP
WHERE category_id = 10
  AND LOWER(TRIM(name)) = 'manager & executive tables';
