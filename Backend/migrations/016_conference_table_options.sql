-- Add the seating and pop-up box choices requested for conference tables.
-- Prices are intentionally left unset because the recording does not give rates;
-- the product's current base price remains in effect until staff set option rates in CMS.
INSERT INTO product_variants
  (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT p.id,
       choice.variant_name,
       NULL,
       NULL,
       p.stock_quantity,
       choice.attributes::jsonb,
       TRUE
FROM products p
CROSS JOIN (VALUES
  ('Seating Capacity: 2 Seater', '{"type":"capacity","group":"Seating Capacity","label":"2 Seater","is_default":false,"price_diff":0}'),
  ('Seating Capacity: 4 Seater', '{"type":"capacity","group":"Seating Capacity","label":"4 Seater","is_default":true,"price_diff":0}'),
  ('Seating Capacity: 8 Seater', '{"type":"capacity","group":"Seating Capacity","label":"8 Seater","is_default":false,"price_diff":0}'),
  ('Seating Capacity: 12 Seater', '{"type":"capacity","group":"Seating Capacity","label":"12 Seater","is_default":false,"price_diff":0}'),
  ('Pop-up Box: Without Pop-up Box', '{"type":"feature","group":"Pop-up Box","label":"Without Pop-up Box","is_default":true,"price_diff":0}'),
  ('Pop-up Box: With Pop-up Box', '{"type":"feature","group":"Pop-up Box","label":"With Pop-up Box","is_default":false,"price_diff":0}')
) AS choice(variant_name, attributes)
WHERE p.sub_category_id = 46
  AND p.status <> 'archived'
  AND NOT EXISTS (
    SELECT 1
    FROM product_variants existing
    WHERE existing.product_id = p.id
      AND existing.attributes->>'group' = choice.attributes::jsonb->>'group'
      AND existing.attributes->>'label' = choice.attributes::jsonb->>'label'
  );
