BEGIN;

DELETE FROM product_images
WHERE product_id IN (
  SELECT id
  FROM products
  WHERE category_id = 18
    AND sub_category_id IN (55, 56)
);

COMMIT;
