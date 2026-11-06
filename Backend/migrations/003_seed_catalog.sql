-- Seeds the storefront catalogue (website/src/types/product.ts) into the database.
-- order_items.product_id has a foreign key to products(id), so the ids below must
-- match the ids the website sends at checkout. Safe to run more than once.

INSERT INTO categories (id, name) VALUES
  (1, 'Sofas'),
  (2, 'Chairs'),
  (3, 'Tables'),
  (4, 'Beds'),
  (5, 'Wardrobes')
ON CONFLICT (id) DO NOTHING;

-- price = list price, discount_price = the selling price shown on the site
INSERT INTO products
  (id, category_id, name, slug, description, price, discount_price, sku, stock_quantity, status, is_featured)
VALUES
  (1, 1, 'Luna 3-Seater Sofa',    'luna-3-seater-sofa',    'A comfortable modern 3-seater sofa designed for contemporary living spaces.', 29999, 24999, 'WV-001', 25, 'active', true),
  (2, 2, 'Milo Lounge Chair',     'milo-lounge-chair',     'A stylish lounge chair with a comfortable design for relaxing spaces.',      10999,  8499, 'WV-002', 25, 'active', true),
  (3, 3, 'Oakline Coffee Table',  'oakline-coffee-table',  'A premium wooden coffee table with a clean and minimal design.',              8499,  6999, 'WV-003', 25, 'active', true),
  (4, 4, 'Nordic King Bed',       'nordic-king-bed',       'A modern king-size bed designed for comfort and elegant bedrooms.',          39999, 32999, 'WV-004', 25, 'active', true),
  (5, 3, 'Aurelia Dining Table',  'aurelia-dining-table',  'A premium dining table crafted for modern dining spaces.',                   22999, 18999, 'WV-005', 25, 'active', false),
  (6, 5, 'Madera Wardrobe',       'madera-wardrobe',       'A spacious wardrobe with a modern wooden finish and elegant styling.',       34999, 28999, 'WV-006', 25, 'active', false),
  (7, 2, 'Arlo Accent Chair',     'arlo-accent-chair',     'A contemporary accent chair that adds character to any room.',              11999,  9499, 'WV-007', 25, 'active', false),
  (8, 4, 'Elara Queen Bed',       'elara-queen-bed',       'A refined queen-size bed with a comfortable and timeless design.',          32999, 27999, 'WV-008', 25, 'active', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT v.product_id, v.image_url, v.alt_text, 0, true
FROM (VALUES
  (1, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', 'Luna 3-Seater Sofa'),
  (2, 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c', 'Milo Lounge Chair'),
  (3, 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc', 'Oakline Coffee Table'),
  (4, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Nordic King Bed'),
  (5, 'https://images.unsplash.com/photo-1617098900591-3f90928e8c54', 'Aurelia Dining Table'),
  (6, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2', 'Madera Wardrobe'),
  (7, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91', 'Arlo Accent Chair'),
  (8, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Elara Queen Bed')
) AS v(product_id, image_url, alt_text)
WHERE NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = v.product_id);

-- Keep the id sequences ahead of the seeded rows so new dashboard-created items don't collide.
SELECT setval(pg_get_serial_sequence('categories', 'id'), GREATEST((SELECT MAX(id) FROM categories), 1));
SELECT setval(pg_get_serial_sequence('products', 'id'), GREATEST((SELECT MAX(id) FROM products), 1));
