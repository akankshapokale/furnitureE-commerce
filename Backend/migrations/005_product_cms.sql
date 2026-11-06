-- Product CMS: free-form specifications and a short description on products.
-- Images live in product_images and variants in product_variants (both already exist).
-- Safe to run more than once.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS specifications jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images (product_id, display_order);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants (product_id);
