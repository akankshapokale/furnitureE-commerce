-- Put the two existing wooden pedestal products under the 3 Drawer Pedestal CMS option.
UPDATE products
SET sub_category_id = (
      SELECT id FROM sub_categories
      WHERE category_id = 10 AND LOWER(name) = '3 drawer pedestal'
      LIMIT 1
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (104, 124)
  AND category_id = 10
  AND EXISTS (
    SELECT 1 FROM sub_categories
    WHERE category_id = 10 AND LOWER(name) = '3 drawer pedestal'
  );
