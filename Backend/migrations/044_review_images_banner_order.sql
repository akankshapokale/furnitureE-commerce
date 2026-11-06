-- Keep existing review records valid while allowing optional customer photos.
ALTER TABLE product_reviews
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Existing banners retain their current id-ascending display sequence.
ALTER TABLE hero_banners
  ADD COLUMN IF NOT EXISTS display_order INTEGER;

WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id ASC) AS next_order
  FROM hero_banners
)
UPDATE hero_banners AS banners
SET display_order = ordered.next_order
FROM ordered
WHERE banners.id = ordered.id
  AND banners.display_order IS NULL;

ALTER TABLE hero_banners
  ALTER COLUMN display_order SET DEFAULT 0,
  ALTER COLUMN display_order SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_hero_banners_display_order
  ON hero_banners (display_order, id);
