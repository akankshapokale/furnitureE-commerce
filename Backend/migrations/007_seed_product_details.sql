-- MOCK CONTENT for the product details page, for products 1-8 from 003_seed_catalog.sql.
-- Replace/edit it from the dashboard (Products -> a product). Only fills in products that
-- have no content yet, so re-running it never overwrites real edits.

-- Shared "more information" copy
WITH shared AS (
  SELECT '[
    {"title": "Delivery & Assembly", "content": "Free delivery across India within 7-10 working days. Our team delivers to your room of choice and completes assembly at no extra charge."},
    {"title": "Care Instructions", "content": "Wipe with a soft, dry cloth. Avoid direct sunlight and moisture, and keep away from sharp objects. For stains, use a mild soap solution and dry immediately."},
    {"title": "Warranty", "content": "Covered by a 2-year warranty against manufacturing defects. Normal wear and tear and damage from misuse are not covered."},
    {"title": "Returns & Exchanges", "content": "Easy 7-day returns if the product arrives damaged or not as described. Contact us with photos and we will arrange a pickup or replacement."}
  ]'::jsonb AS sections
)
UPDATE products p SET info_sections = s.sections
FROM shared s
WHERE p.id BETWEEN 1 AND 8 AND p.info_sections = '[]'::jsonb;

UPDATE products SET
  short_description = 'Deep, plush seating in rich emerald velvet.',
  highlights = '["Solid wood frame with high-density foam cushions", "Soft-touch velvet upholstery", "Seats three adults comfortably", "Removable cushion covers", "Tapered wooden legs"]',
  specifications = '[{"label":"Material","value":"Solid wood frame, velvet upholstery"},{"label":"Dimensions","value":"210 L x 90 W x 85 H cm"},{"label":"Seating capacity","value":"3 seats"},{"label":"Colour","value":"Emerald green"},{"label":"Weight","value":"46 kg"},{"label":"Warranty","value":"2 years"}]',
  related_product_ids = '{2,7,3}'
WHERE id = 1 AND specifications = '[]'::jsonb;

UPDATE products SET
  short_description = 'A relaxed lounge chair with a sculpted back.',
  highlights = '["Ergonomic sculpted backrest", "Hand-finished tufted upholstery", "Turned solid-wood legs", "Compact footprint for any room"]',
  specifications = '[{"label":"Material","value":"Beech wood, linen-blend fabric"},{"label":"Dimensions","value":"72 L x 78 W x 90 H cm"},{"label":"Seating capacity","value":"1 seat"},{"label":"Colour","value":"Ivory"},{"label":"Weight","value":"11 kg"},{"label":"Warranty","value":"2 years"}]',
  related_product_ids = '{7,1,3}'
WHERE id = 2 AND specifications = '[]'::jsonb;

UPDATE products SET
  short_description = 'A minimal round coffee table in warm natural oak.',
  highlights = '["Solid oak top with a natural matte finish", "Angled legs for stability", "Scratch and water-resistant coating", "Easy flat-pack assembly"]',
  specifications = '[{"label":"Material","value":"Solid oak, PU coating"},{"label":"Dimensions","value":"90 dia x 42 H cm"},{"label":"Shape","value":"Round"},{"label":"Colour","value":"Natural oak"},{"label":"Weight","value":"14 kg"},{"label":"Warranty","value":"2 years"}]',
  related_product_ids = '{5,1,2}'
WHERE id = 3 AND specifications = '[]'::jsonb;

UPDATE products SET
  short_description = 'A king-size bed with a tall upholstered headboard.',
  highlights = '["King size: fits a 180 x 200 cm mattress", "Padded headboard with deep channel stitching", "Reinforced slat base, no box spring needed", "Under-bed clearance for storage boxes"]',
  specifications = '[{"label":"Material","value":"Engineered wood, solid pine slats, fabric"},{"label":"Dimensions","value":"215 L x 195 W x 115 H cm"},{"label":"Mattress size","value":"King (180 x 200 cm)"},{"label":"Colour","value":"Warm grey"},{"label":"Weight","value":"78 kg"},{"label":"Warranty","value":"3 years"}]',
  related_product_ids = '{8,6,2}'
WHERE id = 4 AND specifications = '[]'::jsonb;

UPDATE products SET
  short_description = 'A six-seater dining table with a clean, modern top.',
  highlights = '["Seats six comfortably", "Thick engineered-wood top, heat resistant", "Sturdy powder-coated legs", "Easy-clean surface"]',
  specifications = '[{"label":"Material","value":"Engineered wood, powder-coated steel"},{"label":"Dimensions","value":"180 L x 90 W x 76 H cm"},{"label":"Seating capacity","value":"6 seats"},{"label":"Colour","value":"Walnut"},{"label":"Weight","value":"52 kg"},{"label":"Warranty","value":"2 years"}]',
  related_product_ids = '{3,7,2}'
WHERE id = 5 AND specifications = '[]'::jsonb;

UPDATE products SET
  short_description = 'A tall three-door wardrobe with smart internal storage.',
  highlights = '["Three doors with soft-close hinges", "Hanging rail plus four adjustable shelves", "Built-in drawer for small items", "Anti-tilt wall fixing included"]',
  specifications = '[{"label":"Material","value":"Engineered wood with veneer finish"},{"label":"Dimensions","value":"150 L x 55 W x 200 H cm"},{"label":"Doors","value":"3, with mirror on the centre door"},{"label":"Colour","value":"Natural wood"},{"label":"Weight","value":"96 kg"},{"label":"Warranty","value":"3 years"}]',
  related_product_ids = '{4,8,1}'
WHERE id = 6 AND specifications = '[]'::jsonb;

UPDATE products SET
  short_description = 'A statement accent chair with a bold patterned weave.',
  highlights = '["Patterned textured fabric", "Curved, supportive back", "Brass-finish tapered legs", "Fits living rooms and bedrooms"]',
  specifications = '[{"label":"Material","value":"Fabric upholstery, metal legs"},{"label":"Dimensions","value":"68 L x 74 W x 88 H cm"},{"label":"Seating capacity","value":"1 seat"},{"label":"Colour","value":"Grey pattern"},{"label":"Weight","value":"9 kg"},{"label":"Warranty","value":"2 years"}]',
  related_product_ids = '{2,1,5}'
WHERE id = 7 AND specifications = '[]'::jsonb;

UPDATE products SET
  short_description = 'A queen-size bed with a softly curved headboard.',
  highlights = '["Queen size: fits a 150 x 200 cm mattress", "Curved padded headboard", "Strong slatted base", "Quiet, wobble-free joints"]',
  specifications = '[{"label":"Material","value":"Engineered wood, solid pine slats, fabric"},{"label":"Dimensions","value":"212 L x 168 W x 110 H cm"},{"label":"Mattress size","value":"Queen (150 x 200 cm)"},{"label":"Colour","value":"Beige"},{"label":"Weight","value":"66 kg"},{"label":"Warranty","value":"3 years"}]',
  related_product_ids = '{4,6,2}'
WHERE id = 8 AND specifications = '[]'::jsonb;

-- Mock customer reviews (only for products with no reviews yet)
INSERT INTO product_reviews (product_id, reviewer_name, rating, title, comment, is_verified_purchase, status, created_at)
SELECT p.id, r.reviewer_name, r.rating, r.title, r.comment, r.verified, 'approved', NOW() - (r.days_ago || ' days')::interval
FROM products p
CROSS JOIN (VALUES
  ('Aarav M.',  5, 'Exactly as pictured',      'Looks even better in person. Build quality is solid and delivery was on time. Assembly team was very professional.', true,  4),
  ('Priya S.',  5, 'Worth every rupee',        'Very comfortable and the finish is premium. Gets compliments from every guest.',                                     true,  11),
  ('Rohan K.',  4, 'Great, minor delay',       'Quality is great. Delivery took two days longer than promised but the team kept me informed.',                         true,  19),
  ('Neha D.',   4, 'Good value',               'Good quality for the price. The colour is slightly different from the photo under warm light, but still lovely.',     false, 27),
  ('Vikram P.', 5, 'Highly recommend',         'Sturdy, stylish and easy to maintain. Would buy from Staging Spaces again.',                                           true,  40)
) AS r(reviewer_name, rating, title, comment, verified, days_ago)
WHERE p.id BETWEEN 1 AND 8
  AND NOT EXISTS (SELECT 1 FROM product_reviews x WHERE x.product_id = p.id);
