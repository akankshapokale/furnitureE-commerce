-- Remove duplicate metal drawer pedestal entries that have no products.
DELETE FROM sub_categories
WHERE id IN (87, 88, 89)
  AND category_id = 10
  AND name IN ('3 Drawer Metal Pedestal', '2 Drawer Metal Pedestal', '1 Drawer Metal Pedestal')
  AND NOT EXISTS (
    SELECT 1 FROM products WHERE products.sub_category_id = sub_categories.id
  );
