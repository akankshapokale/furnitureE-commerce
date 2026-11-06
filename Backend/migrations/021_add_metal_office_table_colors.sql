-- Add the standard steel finish options to active Office Furniture Metal Office Tables.
-- Each finish keeps the product's current image until a color-specific image is uploaded.
INSERT INTO product_variants
  (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT p.id,
       colors.color_name,
       NULL,
       NULL,
       p.stock_quantity,
       jsonb_build_object(
         'type', 'color',
         'color_key', colors.color_key,
         'color', colors.color_name,
         'color_code', colors.color_code,
         'badge', colors.badge,
         'image', primary_image.image_url
       ),
       TRUE
FROM products p
CROSS JOIN (VALUES
  ('white', 'Pearl White', '#f0f0ee', 'Classic'),
  ('black', 'Matte Black', '#1c1c20', 'Modern'),
  ('grey', 'Steel Grey', '#64748b', 'Standard'),
  ('ivory', 'Ivory Cream', '#d4a373', 'Dual Tone')
) AS colors(color_key, color_name, color_code, badge)
JOIN LATERAL (
  SELECT image_url
  FROM product_images
  WHERE product_id = p.id
  ORDER BY is_primary DESC, display_order, id
  LIMIT 1
) AS primary_image ON TRUE
WHERE p.category_id = 10
  AND p.sub_category_id = 48
  AND p.status = 'active'
  AND NOT EXISTS (
    SELECT 1
    FROM product_variants existing
    WHERE existing.product_id = p.id
      AND existing.attributes->>'type' = 'color'
      AND existing.attributes->>'color_key' = colors.color_key
  );
