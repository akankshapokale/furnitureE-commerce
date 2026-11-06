-- Product details page CMS: highlights, "more information" sections, hand-picked similar
-- products, and customer reviews. Safe to run more than once.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS info_sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS related_product_ids integer[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id integer REFERENCES users(id) ON DELETE SET NULL,
  reviewer_name varchar(120) NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title varchar(160),
  comment text,
  is_verified_purchase boolean NOT NULL DEFAULT false,
  status varchar(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews (product_id, status);
-- A customer can review a product once.
CREATE UNIQUE INDEX IF NOT EXISTS uq_product_reviews_user ON product_reviews (product_id, user_id) WHERE user_id IS NOT NULL;
