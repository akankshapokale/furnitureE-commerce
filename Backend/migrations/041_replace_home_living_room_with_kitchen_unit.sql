-- Replace the Home Furniture Living Room navigation subcategory with Kitchen Unit.
UPDATE sub_categories sc
SET name = 'Kitchen Unit',
    description = 'Kitchen units designed for organized storage and practical everyday use.',
    updated_at = CURRENT_TIMESTAMP
FROM categories c
WHERE c.id = sc.category_id
  AND LOWER(TRIM(c.name)) = LOWER('Home Furniture')
  AND LOWER(TRIM(sc.name)) = LOWER('Living Room');
