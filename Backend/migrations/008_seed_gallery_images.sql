-- MOCK gallery images (room shots) so product pages show a real gallery. Edit or replace them
-- from the dashboard (Products -> a product -> Images). Only adds to products that still have
-- a single image, so re-running never duplicates or overwrites real images.

INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
SELECT p.id, g.image_url, p.name || ' in a room', g.display_order, false
FROM products p
JOIN (VALUES
  -- living-room pieces
  (1, 1, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e'),
  (1, 2, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'),
  (2, 1, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'),
  (2, 2, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6'),
  (3, 1, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e'),
  (3, 2, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6'),
  (5, 1, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0'),
  (5, 2, 'https://images.unsplash.com/photo-1513694203232-719a280e022f'),
  (7, 1, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6'),
  (7, 2, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'),
  -- bedroom pieces
  (4, 1, 'https://images.unsplash.com/photo-1540518614846-7eded433c457'),
  (4, 2, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace'),
  (6, 1, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace'),
  (6, 2, 'https://images.unsplash.com/photo-1540518614846-7eded433c457'),
  (8, 1, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace'),
  (8, 2, 'https://images.unsplash.com/photo-1540518614846-7eded433c457')
) AS g(product_id, display_order, image_url) ON g.product_id = p.id
WHERE (SELECT COUNT(*) FROM product_images i WHERE i.product_id = p.id) = 1;
