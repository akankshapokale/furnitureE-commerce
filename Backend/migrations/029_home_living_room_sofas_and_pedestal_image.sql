-- Add separate Home Furniture navigation groups and connect the exact CMS
-- upload for the 2 Drawer Pedestal product.
INSERT INTO sub_categories (category_id, name, description, is_active)
SELECT 13, v.name, v.description, TRUE
FROM (VALUES
  ('Living Room', 'Living room furniture for comfortable, welcoming spaces, including practical pieces for everyday home living.'),
  ('Sofas', 'Home sofas designed for comfortable seating, durable everyday use, and a relaxed living room.')
) AS v(name, description)
WHERE NOT EXISTS (
  SELECT 1 FROM sub_categories sc
  WHERE sc.category_id = 13 AND LOWER(TRIM(sc.name)) = LOWER(TRIM(v.name))
);

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT 724,
       '/uploads/excel-2-drawer-wooden-mobile-pedestal----1792596240581-433579.jpg',
       '2 Drawer Wooden Mobile Pedestal',
       0,
       TRUE
WHERE EXISTS (SELECT 1 FROM products WHERE id = 724)
  AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 724);
