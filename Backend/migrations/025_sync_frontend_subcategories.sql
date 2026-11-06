-- Fill the frontend subcategory entries that were missing from the CMS catalog.
-- Safe to rerun: category/name pairs are inserted only once.
INSERT INTO sub_categories (category_id, name, is_active)
SELECT c.id, v.name, TRUE
FROM (VALUES
  (8, 'Industrial Locker'),
  (8, 'Bookcase'),
  (19, 'Metal Sofa')
) AS v(category_id, name)
JOIN categories c ON c.id = v.category_id
WHERE NOT EXISTS (
  SELECT 1
  FROM sub_categories sc
  WHERE sc.category_id = c.id
    AND LOWER(TRIM(sc.name)) = LOWER(TRIM(v.name))
);
