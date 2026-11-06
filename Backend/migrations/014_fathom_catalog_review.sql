-- Catalogue changes requested during the October 19 Fathom review.
-- Existing orders and product records are preserved; removed listings are archived.
BEGIN;

-- Rename existing catalogue sections while keeping their IDs and public URLs stable.
UPDATE sub_categories SET name = 'Employee Desks', updated_at = CURRENT_TIMESTAMP WHERE id = 40;
UPDATE sub_categories SET name = 'Manager & Executive Tables', updated_at = CURRENT_TIMESTAMP WHERE id = 43;
UPDATE sub_categories SET name = 'Premium Front Desk', updated_at = CURRENT_TIMESTAMP WHERE id = 44;
UPDATE sub_categories SET name = 'Modular Office Workstation', updated_at = CURRENT_TIMESTAMP WHERE id = 45;
UPDATE sub_categories SET name = 'Conference & Meeting Tables', updated_at = CURRENT_TIMESTAMP WHERE id = 46;
UPDATE sub_categories SET name = 'Storewells', updated_at = CURRENT_TIMESTAMP WHERE id = 1;
UPDATE sub_categories SET name = 'Heavy-Duty Racks', updated_at = CURRENT_TIMESTAMP WHERE id = 66;

-- Add the storage and home-furniture categories requested in the review.
INSERT INTO sub_categories (id, category_id, name, is_active)
SELECT v.id, v.category_id, v.name, TRUE
FROM (VALUES
  (72, 10, 'Low Height Storage'),
  (73, 10, 'Full Height Storage'),
  (74, 10, 'Small Storage'),
  (75, 10, 'Side Runner'),
  (76, 13, 'TV Unit'),
  (77, 13, 'Bar Unit'),
  (78, 13, 'Foldable Table'),
  (79, 8, 'Three-Door Steel Storage'),
  (80, 8, 'Corporate Storage'),
  (81, 13, 'Side Table')
) AS v(id, category_id, name)
WHERE NOT EXISTS (SELECT 1 FROM sub_categories existing WHERE existing.id = v.id);

-- Hide categories removed during the review and archive their products rather than deleting records.
UPDATE sub_categories SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id IN (51, 63, 69, 50);
UPDATE products SET status = 'archived', updated_at = CURRENT_TIMESTAMP
WHERE sub_category_id IN (51, 63, 69, 50) AND status <> 'archived';

-- The old home sofa listing was explicitly removed from Home Furniture.
UPDATE products SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = 401 AND status <> 'archived';

-- Put the three-door steel cabinet in its own requested category.
UPDATE products SET sub_category_id = 79, updated_at = CURRENT_TIMESTAMP WHERE id = 708;

-- Apply the exact title requested for the two-door almirah. Retain its existing images and variants.
UPDATE products
SET name = 'Classic 2-Door Steel Almirah',
    slug = 'classic-2-door-steel-almirah-705',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 705;

-- Conference/meeting product names requested in the review.
UPDATE products
SET name = 'Professional Meeting Table',
    slug = 'professional-meeting-table-123',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 123;

UPDATE products
SET name = 'Premium Leadership Office Desk',
    slug = 'premium-leadership-office-desk-116',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 116;

UPDATE products SET description = 'Draft listing for a TV unit. Add the approved product photo and final price before publishing.', short_description = 'Draft listing for a TV unit. Add the approved product photo and final price before publishing.' WHERE sku = 'DRAFT-TV-UNIT' AND description LIKE 'Draft catalogue entry%';
UPDATE products SET description = 'Draft listing for a home bar unit. Add the approved product photo and final price before publishing.', short_description = 'Draft listing for a home bar unit. Add the approved product photo and final price before publishing.' WHERE sku = 'DRAFT-BAR-UNIT' AND description LIKE 'Draft catalogue entry%';
UPDATE products SET description = 'Draft listing for a foldable table. Add the approved product photo and final price before publishing.', short_description = 'Draft listing for a foldable table. Add the approved product photo and final price before publishing.' WHERE sku = 'DRAFT-FOLDABLE-TABLE' AND description LIKE 'Draft catalogue entry%';
UPDATE products SET description = 'Draft listing for a side table. Add the approved product photo and final price before publishing.', short_description = 'Draft listing for a side table. Add the approved product photo and final price before publishing.' WHERE sku = 'DRAFT-SIDE-TABLE' AND description LIKE 'Draft catalogue entry%';
UPDATE products SET description = 'Draft listing for a sliding library cupboard with glass doors. Add the approved gallery photos and final price before publishing.', short_description = 'Draft listing for a sliding library cupboard with glass doors. Add the approved gallery photos and final price before publishing.' WHERE sku = 'DRAFT-SLIDING-LIBRARY' AND description LIKE 'Draft catalogue entry%';
UPDATE products SET description = 'Draft listing for a corporate storage cabinet. Add the approved product photos and final price before publishing.', short_description = 'Draft listing for a corporate storage cabinet. Add the approved product photos and final price before publishing.' WHERE sku = 'DRAFT-CORPORATE-STORAGE' AND description LIKE 'Draft catalogue entry%';
UPDATE products SET description = 'A lightweight plastic chair for everyday seating. Add the approved product photo and final price before publishing.', short_description = 'A lightweight plastic chair for everyday seating. Add the approved product photo and final price before publishing.' WHERE sku = 'DRAFT-PLASTIC-CHAIR' AND description LIKE 'Draft catalogue entry%';
UPDATE products SET description = 'A sturdy metal stool for versatile seating in home, office, and workshop settings. Add the approved photo and final price before publishing.', short_description = 'A sturdy metal stool for versatile seating in home, office, and workshop settings. Add the approved photo and final price before publishing.' WHERE sku = 'DRAFT-METAL-STOOL' AND description LIKE 'Draft catalogue entry%';
UPDATE products SET description = 'A sturdy metal stool with a stainless steel top for easy-to-clean everyday seating. Add the approved photo and final price before publishing.', short_description = 'A sturdy metal stool with a stainless steel top for easy-to-clean everyday seating. Add the approved photo and final price before publishing.' WHERE sku = 'DRAFT-METAL-STOOL-SS' AND description LIKE 'Draft catalogue entry%';

-- Existing chair listings specifically requested for the homepage seating selection.
-- New product entries are intentionally drafts until the promised photographs and final prices arrive.
INSERT INTO products
  (category_id, sub_category_id, name, slug, description, short_description, price,
   sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
SELECT v.category_id, v.sub_category_id, v.name, v.slug, v.description, v.description, 0,
       v.sku, 0, 'draft', FALSE, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb
FROM (VALUES
  (13, 76, 'TV Unit', 'tv-unit-draft', 'Draft listing for a TV unit. Add the approved product photo and final price before publishing.', 'DRAFT-TV-UNIT'),
  (13, 77, 'Bar Unit', 'bar-unit-draft', 'Draft listing for a home bar unit. Add the approved product photo and final price before publishing.', 'DRAFT-BAR-UNIT'),
  (13, 78, 'Foldable Table', 'foldable-table-draft', 'Draft listing for a foldable table. Add the approved product photo and final price before publishing.', 'DRAFT-FOLDABLE-TABLE'),
  (13, 81, 'Side Table', 'side-table-draft', 'Draft listing for a side table. Add the approved product photo and final price before publishing.', 'DRAFT-SIDE-TABLE'),
  (8, 7, 'Sliding Library Cupboard with Glass Door', 'sliding-library-cupboard-glass-door-draft', 'Draft listing for a sliding library cupboard with glass doors. Add the approved gallery photos and final price before publishing.', 'DRAFT-SLIDING-LIBRARY'),
  (8, 80, 'Corporate Storage Cabinet', 'corporate-storage-cabinet-draft', 'Draft listing for a corporate storage cabinet. Add the approved product photos and final price before publishing.', 'DRAFT-CORPORATE-STORAGE'),
  (18, 55, 'Plastic Chair', 'plastic-chair-draft', 'A lightweight plastic chair for everyday seating. Add the approved product photo and final price before publishing.', 'DRAFT-PLASTIC-CHAIR'),
  (18, 56, 'Metal Stool', 'metal-stool-draft', 'A sturdy metal stool for versatile seating in home, office, and workshop settings. Add the approved photo and final price before publishing.', 'DRAFT-METAL-STOOL'),
  (18, 56, 'Metal Stool with Stainless Steel Top', 'metal-stool-stainless-steel-top-draft', 'A sturdy metal stool with a stainless steel top for easy-to-clean everyday seating. Add the approved photo and final price before publishing.', 'DRAFT-METAL-STOOL-SS')
) AS v(category_id, sub_category_id, name, slug, description, sku)
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.sku = v.sku);

-- Keep future admin-created subcategories beyond the inserted IDs.
SELECT setval(pg_get_serial_sequence('sub_categories', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM sub_categories), 1), TRUE);

COMMIT;
