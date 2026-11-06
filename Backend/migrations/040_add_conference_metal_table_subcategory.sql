-- Add Conference Metal Table under the Metal Furniture group in Office Furniture.
WITH office_furniture AS (
  SELECT id
  FROM categories
  WHERE LOWER(TRIM(name)) = LOWER('Office Furniture')
  ORDER BY id
  LIMIT 1
), existing AS (
  UPDATE sub_categories sc
  SET group_name = 'Metal Furniture',
      is_active = TRUE,
      updated_at = CURRENT_TIMESTAMP
  FROM office_furniture ofc
  WHERE sc.category_id = ofc.id
    AND LOWER(TRIM(sc.name)) = LOWER('Conference Metal Table')
  RETURNING sc.id
)
INSERT INTO sub_categories (category_id, name, group_name, is_active)
SELECT ofc.id, 'Conference Metal Table', 'Metal Furniture', TRUE
FROM office_furniture ofc
WHERE NOT EXISTS (SELECT 1 FROM existing);
