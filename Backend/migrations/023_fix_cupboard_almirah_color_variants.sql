-- Keep the original cupboard photos and correct only the swatch color values.
UPDATE product_variants pv
SET attributes = pv.attributes || jsonb_build_object(
  'image', CASE pv.attributes->>'color_key'
    WHEN 'white' THEN '/images-webp/cupboard4_white.webp'
    WHEN 'black' THEN '/images-webp/cupboard4_black.webp'
    WHEN 'grey' THEN '/images-webp/cupboard4_grey.webp'
    WHEN 'ivory' THEN '/images-webp/cupboard4_ivory.webp'
  END,
  'color_code', CASE pv.attributes->>'color_key'
    WHEN 'white' THEN '#f7f7f3'
    WHEN 'black' THEN '#202124'
    WHEN 'grey' THEN '#7e8791'
    WHEN 'ivory' THEN '#f1e4c7'
  END
)
FROM products p
WHERE pv.product_id = p.id
  AND p.id = 705
  AND pv.attributes->>'type' = 'color'
  AND pv.attributes->>'color_key' IN ('white', 'black', 'grey', 'ivory');

-- Keep these four swatch colors consistent throughout the Cupboards & Almirahs section.
UPDATE product_variants pv
SET attributes = pv.attributes || jsonb_build_object(
  'color_code', CASE pv.attributes->>'color_key'
    WHEN 'white' THEN '#f7f7f3'
    WHEN 'black' THEN '#202124'
    WHEN 'grey' THEN '#7e8791'
    WHEN 'ivory' THEN '#f1e4c7'
  END
)
FROM products p
WHERE pv.product_id = p.id
  AND p.category_id = 8
  AND pv.attributes->>'type' = 'color'
  AND pv.attributes->>'color_key' IN ('white', 'black', 'grey', 'ivory');
