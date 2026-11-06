BEGIN;

INSERT INTO product_variants
  (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT p.id,
       'Bed Size (ft): ' || sizes.label,
       NULL,
       p.discount_price,
       p.stock_quantity,
       jsonb_build_object(
         'type', 'size',
         'group', 'Bed Size (ft)',
         'label', sizes.label,
         'price_diff', 0,
         'is_default', sizes.is_default
       ),
       TRUE
FROM products p
CROSS JOIN (VALUES
  ('3 x 6 x 5.5', TRUE),
  ('2.5 x 6 x 6.5', FALSE)
) AS sizes(label, is_default)
WHERE p.id IN (601, 605)
  AND NOT EXISTS (
    SELECT 1
    FROM product_variants existing
    WHERE existing.product_id = p.id
      AND existing.variant_name = 'Bed Size (ft): ' || sizes.label
  );

COMMIT;
