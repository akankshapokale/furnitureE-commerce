-- Migration 010: Seed all storefront catalog products and Cupboards & Almirahs products
-- Ensures foreign key fk_order_item_product is always met for all storefront products.

DO $$
DECLARE
  v_cupboard_cat_id INT;
  v_default_cat_id INT;
BEGIN
  -- Get Cupboards and Almirahs category ID
  SELECT id INTO v_cupboard_cat_id FROM categories WHERE name = 'Cupboards and Almirahs' LIMIT 1;
  IF v_cupboard_cat_id IS NULL THEN
    INSERT INTO categories (name, description, is_active)
    VALUES ('Cupboards and Almirahs', 'Steel storewells, almirahs & lockers', true)
    RETURNING id INTO v_cupboard_cat_id;
  END IF;

  SELECT id INTO v_default_cat_id FROM categories WHERE id != v_cupboard_cat_id LIMIT 1;
  IF v_default_cat_id IS NULL THEN
    v_default_cat_id := v_cupboard_cat_id;
  END IF;

  -- 1. Seed Main Storefront Products (IDs 1-8)
  INSERT INTO products (id, category_id, name, slug, description, price, discount_price, sku, stock_quantity, status, is_featured)
  VALUES
    (1, v_default_cat_id, 'Luna 3-Seater Sofa', 'luna-3-seater-sofa', 'Comfortable modern 3-seater sofa', 29999, 24999, 'WV-001', 25, 'active', true),
    (4, v_default_cat_id, 'Nordic King Bed', 'nordic-king-bed', 'Modern king-size bed for bedrooms', 39999, 32999, 'WV-004', 25, 'active', true),
    (5, v_default_cat_id, 'Aurelia Dining Table', 'aurelia-dining-table', 'Premium dining table', 22999, 18999, 'WV-005', 25, 'active', false),
    (6, v_default_cat_id, 'Madera Wardrobe', 'madera-wardrobe', 'Spacious wooden wardrobe', 34999, 28999, 'WV-006', 25, 'active', false),
    (7, v_default_cat_id, 'Arlo Accent Chair', 'arlo-accent-chair', 'Contemporary accent chair', 11999, 9499, 'WV-007', 25, 'active', false),
    (8, v_default_cat_id, 'Elara Queen Bed', 'elara-queen-bed', 'Refined queen-size bed', 32999, 27999, 'WV-008', 25, 'active', false)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price;

  -- 2. Seed Cupboards and Almirahs Products (IDs 701 - 720)
  INSERT INTO products (id, category_id, name, slug, description, price, discount_price, sku, stock_quantity, status, is_featured)
  VALUES
    (701, v_cupboard_cat_id, 'Classic Steel Storewell with Safe Locker', 'classic-steel-storewell', 'Reinforced CRCA steel storewell with locker', 22999, 18999, 'STW-001', 50, 'active', true),
    (702, v_cupboard_cat_id, 'Heavy-Gauge Commercial Storewell Cupboard', 'commercial-storewell-cupboard', 'Commercial storewell cupboard for offices', 25999, 21499, 'STW-002', 40, 'active', true),
    (703, v_cupboard_cat_id, 'Slim Single-Door Steel Storewell', 'slim-single-door-storewell', 'Compact single door storewell', 15999, 12999, 'STW-003', 35, 'active', false),
    (704, v_cupboard_cat_id, '6-Door Industrial Staff Locker Cabinet', '6-door-industrial-staff-locker', 'Staff locker with air louvers', 21000, 17499, 'LCK-001', 30, 'active', true),
    (705, v_cupboard_cat_id, '12-Door Multi-Tier Steel Worker Locker', '12-door-multi-tier-locker', 'Multi-compartment factory locker', 34000, 27999, 'LCK-002', 20, 'active', true),
    (706, v_cupboard_cat_id, '4-Tier Industrial Metal Compartment Locker', '4-tier-metal-locker', 'Heavy duty compartment locker', 18500, 14999, 'LCK-003', 25, 'active', false),
    (707, v_cupboard_cat_id, 'Royal Steel Almirah with Full Mirror', 'royal-steel-almirah-mirror', 'Luxury steel almirah with dressing mirror', 22999, 18999, 'ALM-001', 45, 'active', true),
    (708, v_cupboard_cat_id, 'Triple-Door Master Steel Almirah', 'triple-door-master-almirah', 'Spacious triple door steel almirah', 31999, 25999, 'ALM-002', 25, 'active', false),
    (709, v_cupboard_cat_id, 'Modular Steel Unit Storage Cupboard', 'modular-steel-unit-cupboard', 'Modular steel utility storage cupboard', 11999, 9499, 'UNT-001', 50, 'active', false),
    (710, v_cupboard_cat_id, 'Double Door Multi-Purpose Unit Cupboard', 'double-door-unit-cupboard', 'Multi-purpose steel unit cupboard', 13999, 11299, 'UNT-002', 40, 'active', false),
    (711, v_cupboard_cat_id, 'Heavy-Duty 4-Drawer Steel Filing Cabinet', '4-drawer-steel-filing-cabinet', 'Central key lock vertical filing cabinet', 13500, 10999, 'FLG-001', 35, 'active', true),
    (712, v_cupboard_cat_id, 'Executive 3-Drawer Steel Filing Cabinet', '3-drawer-steel-filing-cabinet', 'Heavy duty metal filing unit', 11500, 9299, 'FLG-002', 30, 'active', false),
    (713, v_cupboard_cat_id, 'Steel Bookcase with Toughened Glass Doors', 'steel-bookcase-glass-doors', '4mm toughened glass bookcase', 19499, 15999, 'BKC-001', 30, 'active', true),
    (714, v_cupboard_cat_id, 'Multi-Shelf Steel Library Bookcase', 'multi-shelf-library-bookcase', 'Heavy encyclopedia load bookcase', 17800, 14499, 'BKC-002', 25, 'active', false),
    (715, v_cupboard_cat_id, 'Heavy-Duty Steel Library Cupboard', 'heavy-duty-library-cupboard', 'Multi-compartment library book cupboard', 20500, 16999, 'LIB-001', 40, 'active', true),
    (716, v_cupboard_cat_id, 'Double-Bay Institutional Library Cupboard', 'double-bay-library-cupboard', 'Double bay high capacity library cupboard', 32000, 26499, 'LIB-002', 20, 'active', false),
    (717, v_cupboard_cat_id, 'High-Density Stacking Library Book Cupboard', 'high-density-library-cupboard', 'Stackable library book storage unit', 24000, 19999, 'LIB-003', 25, 'active', false),
    (718, v_cupboard_cat_id, 'Multi-Compartment Steel Library Record Locker', 'library-record-locker', 'Secure steel record locker', 28000, 22999, 'LIB-004', 15, 'active', false),
    (719, v_cupboard_cat_id, 'Compact Single-Column Library Cupboard', 'single-column-library-cupboard', 'Space saving library cupboard', 14000, 11499, 'LIB-005', 30, 'active', false),
    (720, v_cupboard_cat_id, 'Archival Library Steel Storage Cupboard', 'archival-library-storage-cupboard', 'Air ventilated archival cupboard', 36000, 29999, 'LIB-006', 15, 'active', false)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price;

  -- Ensure serial sequence is well above seeded IDs
  PERFORM setval(pg_get_serial_sequence('products', 'id'), GREATEST((SELECT MAX(id) FROM products), 1000));
END $$;
