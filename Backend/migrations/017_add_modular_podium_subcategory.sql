-- Add the requested podium table category under Office Furniture without duplicating it.
INSERT INTO sub_categories (category_id, name, is_active)
SELECT 10, 'Modular Podium Table', TRUE
WHERE EXISTS (SELECT 1 FROM categories WHERE id = 10)
  AND NOT EXISTS (
    SELECT 1 FROM sub_categories
    WHERE category_id = 10 AND LOWER(name) = LOWER('Modular Podium Table')
  );

SELECT setval(
  pg_get_serial_sequence('sub_categories', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM sub_categories), 1),
  TRUE
);
