-- Move the bunk bed dimensions entered in Description into the Dimensions specification.
UPDATE products
SET specifications = CASE
      WHEN EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(specifications, '[]'::jsonb)) spec
        WHERE LOWER(TRIM(spec->>'label')) = LOWER('Dimensions')
      ) THEN specifications
      ELSE COALESCE(specifications, '[]'::jsonb) || jsonb_build_array(
        jsonb_build_object('label', 'Dimensions', 'value', description)
      )
    END,
    description = NULLIF(TRIM(short_description), ''),
    updated_at = CURRENT_TIMESTAMP
WHERE id = 905
  AND LOWER(TRIM(name)) = LOWER('3 Tier Metal Bunk Bed')
  AND NULLIF(TRIM(description), '') IS NOT NULL;
