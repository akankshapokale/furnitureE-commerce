ALTER TABLE sub_categories
  ADD COLUMN IF NOT EXISTS group_name text;

UPDATE sub_categories
SET is_active = TRUE,
    group_name = 'Modular Storage',
    description = COALESCE(
      NULLIF(TRIM(description), ''),
      name || ' office storage designed for practical workspace organization.'
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE category_id = 10
  AND LOWER(TRIM(name)) IN ('low height storage', 'side runner', 'full height storage');
