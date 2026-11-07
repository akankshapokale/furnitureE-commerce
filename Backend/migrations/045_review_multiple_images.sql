-- Allow several customer photos per review. image_url stays as the first photo.
ALTER TABLE product_reviews
  ADD COLUMN IF NOT EXISTS image_urls JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE product_reviews
SET image_urls = jsonb_build_array(image_url)
WHERE image_url IS NOT NULL AND image_url <> '' AND image_urls = '[]'::jsonb;
