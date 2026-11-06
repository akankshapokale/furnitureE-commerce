-- Drawer-count options for wooden and metal pedestal products.
-- Safe to rerun: each category/subcategory name pair is inserted at most once.
INSERT INTO sub_categories (category_id, name, is_active)
SELECT c.id, v.name, TRUE
FROM categories c
CROSS JOIN (VALUES
  ('3 Drawer Pedestal'),
  ('2 Drawer Pedestal'),
  ('1 Drawer Pedestal'),
  ('3 Drawer Metal Pedestal'),
  ('2 Drawer Metal Pedestal'),
  ('1 Drawer Metal Pedestal')
) AS v(name)
WHERE c.id = 10
  AND NOT EXISTS (
    SELECT 1
    FROM sub_categories sc
    WHERE sc.category_id = c.id
      AND LOWER(TRIM(sc.name)) = LOWER(TRIM(v.name))
  );
