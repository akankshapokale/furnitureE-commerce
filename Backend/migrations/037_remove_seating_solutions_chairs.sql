-- Remove chair products from Seating Solutions. Sofas and stools remain in the catalog.
BEGIN;

DO $$
DECLARE
  chair_product RECORD;
BEGIN
  FOR chair_product IN
    SELECT p.id, p.name
    FROM products AS p
    LEFT JOIN sub_categories AS subcategory ON subcategory.id = p.sub_category_id
    WHERE p.category_id = 18
      AND (
        LOWER(p.name) LIKE '%chair%'
        OR LOWER(COALESCE(subcategory.name, '')) LIKE '%chair%'
      )
    ORDER BY p.id
  LOOP
    BEGIN
      DELETE FROM products WHERE id = chair_product.id;
    EXCEPTION WHEN foreign_key_violation THEN
      UPDATE products
      SET status = 'archived', updated_at = CURRENT_TIMESTAMP
      WHERE id = chair_product.id;
    END;
  END LOOP;
END $$;

COMMIT;
