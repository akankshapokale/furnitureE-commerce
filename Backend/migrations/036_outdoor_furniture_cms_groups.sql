-- Align Outdoor Furniture CMS groups and place the woven chair/table set under Tables.
BEGIN;

DO $$
DECLARE
  existing_tables_id integer;
  duplicate_tables_id integer;
BEGIN
  SELECT id INTO existing_tables_id
  FROM sub_categories
  WHERE category_id = 19
    AND LOWER(name) IN (LOWER('Table''s'), LOWER('Outdoor Seating Tables'), LOWER('Tables'))
  ORDER BY CASE
    WHEN LOWER(name) = LOWER('Tables') THEN 0
    WHEN LOWER(name) = LOWER('Outdoor Seating Tables') THEN 1
    ELSE 2
  END, id
  LIMIT 1;

  SELECT id INTO duplicate_tables_id
  FROM sub_categories
  WHERE category_id = 19
    AND LOWER(name) IN (LOWER('Table''s'), LOWER('Outdoor Seating Tables'), LOWER('Tables'))
    AND id <> existing_tables_id
  ORDER BY id
  LIMIT 1;

  IF existing_tables_id IS NOT NULL THEN
    IF duplicate_tables_id IS NOT NULL THEN
      UPDATE products
      SET sub_category_id = existing_tables_id, updated_at = CURRENT_TIMESTAMP
      WHERE sub_category_id = duplicate_tables_id;

      DELETE FROM sub_categories WHERE id = duplicate_tables_id;
    END IF;

    UPDATE sub_categories
    SET name = 'Tables',
        group_name = 'Outdoor Seating & Tables',
        is_active = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = existing_tables_id;
  ELSE
    INSERT INTO sub_categories (category_id, name, group_name, is_active)
    SELECT 19, 'Tables', 'Outdoor Seating & Tables', TRUE
    WHERE EXISTS (SELECT 1 FROM categories WHERE id = 19);
  END IF;
END $$;

UPDATE sub_categories
SET group_name = CASE
      WHEN LOWER(name) IN ('metal planter', 'planter stand', 'heavy-duty racks', 'planter trolley with wheels')
        THEN 'Outdoor Furniture'
      WHEN LOWER(name) IN ('garden chair', 'metal sofa', 'tables')
        THEN 'Outdoor Seating & Tables'
      ELSE group_name
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE category_id = 19
  AND LOWER(name) IN (
    'metal planter', 'planter stand', 'heavy-duty racks',
    'planter trolley with wheels', 'garden chair', 'metal sofa', 'tables'
  );

UPDATE products
SET status = 'archived', updated_at = CURRENT_TIMESTAMP
WHERE id = 503
  AND category_id = 19
  AND LOWER(name) = LOWER('Premium Outdoor Lounge Seating');

UPDATE products AS product
SET sub_category_id = subcategory.id,
    updated_at = CURRENT_TIMESTAMP
FROM sub_categories AS subcategory
WHERE product.id = 517
  AND product.category_id = 19
  AND LOWER(product.name) = LOWER('Modern Woven Garden Chair Set')
  AND subcategory.category_id = 19
  AND LOWER(subcategory.name) = LOWER('Tables')
  AND subcategory.is_active = TRUE;

COMMIT;
