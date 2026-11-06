-- Ensure Office Furniture has an active Metal Table CMS subcategory, then
-- create two unpublished listings for staff to complete and add images to.
BEGIN;

INSERT INTO sub_categories (category_id, name, is_active)
SELECT 10, 'Metal Table', TRUE
WHERE EXISTS (SELECT 1 FROM categories WHERE id = 10)
  AND NOT EXISTS (
    SELECT 1 FROM sub_categories
    WHERE category_id = 10 AND LOWER(name) = LOWER('Metal Table')
  );

UPDATE sub_categories
SET is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE category_id = 10
  AND LOWER(name) = LOWER('Metal Table');

INSERT INTO products
  (category_id, sub_category_id, name, slug, description, short_description,
   price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
SELECT 10, sc.id, draft.name, draft.slug, draft.description, draft.description,
       0, draft.sku, 0, 'draft', FALSE, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb
FROM sub_categories sc
CROSS JOIN (VALUES
  ('Metal Table 1', 'metal-table-draft-1', 'DRAFT-METAL-TABLE-1', 'Add the approved product description, price, and images in the CMS before publishing.'),
  ('Metal Table 2', 'metal-table-draft-2', 'DRAFT-METAL-TABLE-2', 'Add the approved product description, price, and images in the CMS before publishing.')
) AS draft(name, slug, sku, description)
WHERE sc.category_id = 10
  AND LOWER(sc.name) = LOWER('Metal Table')
  AND NOT EXISTS (SELECT 1 FROM products existing WHERE existing.sku = draft.sku);

COMMIT;
