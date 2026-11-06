-- Make the drawer pedestal products visible on the storefront and fill blank
-- descriptions across the subcategory catalog.
UPDATE products
SET status = 'active',
    short_description = CASE id
      WHEN 723 THEN COALESCE(NULLIF(TRIM(short_description), ''), 'Compact 1 drawer pedestal for organized office storage and everyday work essentials.')
      WHEN 724 THEN COALESCE(NULLIF(TRIM(short_description), ''), 'Compact 2 drawer pedestal for organized office storage and everyday work essentials.')
      ELSE short_description
    END,
    description = CASE id
      WHEN 723 THEN COALESCE(NULLIF(TRIM(description), ''), 'A compact office pedestal with one drawer to keep documents and frequently used work essentials organized and close at hand.')
      WHEN 724 THEN COALESCE(NULLIF(TRIM(description), ''), 'A compact office pedestal with two drawers to organize documents and frequently used work essentials beside the workspace.')
      ELSE description
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (723, 724);

UPDATE sub_categories AS sc
SET description = CASE c.name
  WHEN 'Office Furniture' THEN sc.name || ' options for organized office workspaces, combining practical design with everyday functionality.'
  WHEN 'Cupboards & Almirahs' THEN sc.name || ' options for secure, well-organized storage at home or in the workplace.'
  WHEN 'Bunk Beds' THEN 'Space-saving ' || sc.name || ' options designed for comfortable, durable sleeping arrangements.'
  WHEN 'Home Furniture' THEN sc.name || ' designed to bring practical storage and everyday functionality to home interiors.'
  WHEN 'Outdoor Furniture' THEN sc.name || ' designed for outdoor spaces, combining durable materials with functional style.'
  WHEN 'Seating Solutions' THEN sc.name || ' seating designed for comfort and dependable everyday use.'
  ELSE sc.name || ' designed for ' || LOWER(c.name) || ', with practical features for everyday use.'
END
FROM categories AS c
WHERE c.id = sc.category_id
  AND NULLIF(TRIM(sc.description), '') IS NULL;
