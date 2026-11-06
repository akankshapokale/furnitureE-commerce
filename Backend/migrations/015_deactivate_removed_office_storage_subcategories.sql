-- Hide these subcategories from public listings while retaining their records and products.
UPDATE sub_categories
SET is_active = FALSE,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (72, 73, 74, 75)
  AND is_active = TRUE;
