BEGIN;

UPDATE products
SET short_description = 'Office discussion table with a 50 mm thick wooden top for meetings and collaborative work.',
    description = 'Bring teams together around this Discussion Table, designed for office meetings, collaborative planning, and group conversations. It features a 50 mm thick wooden tabletop supported by sturdy legs, providing a stable, practical surface for documents, laptops, and day-to-day discussions.',
    updated_at = NOW()
WHERE id = 720
  AND name = 'Discussion Table';

COMMIT;
