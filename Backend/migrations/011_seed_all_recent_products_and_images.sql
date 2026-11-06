-- Migration 011: Seed all catalog products, categories, subcategories and images
-- Auto-generated from latest storefront catalogue

-- 1. Ensure CMS columns and tables exist
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS specifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS info_sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS related_product_ids integer[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images (product_id, display_order);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants (product_id);

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

-- 2. Categories
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (2, 'Beds', NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (3, 'Chairs', NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (4, 'Tables', NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (5, 'Wardrobes', NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (6, 'Dining Furniture', NULL, NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (7, 'Living Room', 'Furniture for living room', 'https://example.com/living-room.jpg', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (8, 'Cupboards and Almirahs', 'Heavy-gauge steel storewells, almirahs, industrial lockers, bookcases, and library cupboards.', '/images-webp/cupboard1.webp', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (9, 'Metal Racks', 'Durable, multi-tier metal racks for organized industrial and home storage.', 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (10, 'Office Furniture', 'Functional desks, conference tables, and modern setups for workspaces.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (11, 'Office Chairs', 'Ergonomic, revolving, and executive chairs for all-day seating comfort.', 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1000&q=80', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (12, 'Office Metal Furniture', 'Durable metal desks, filing cabinets, and heavy-duty office workstations.', '/images-webp/metal-drawer2.webp', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (13, 'Home Furniture', 'Comfortable sofas, dining tables, and stylish living room sets.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (14, 'Outdoor Chairs', 'Weather-resistant, sturdy chairs designed for patios, gardens, and cafes.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (15, 'Bunk Beds', 'Space-saving and strong bunk bed frames for hostels, kids rooms, and homes.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (18, 'Seating Solutions', 'Ergonomic mesh chairs, executive high-back boss chairs, office sofas, compact stools, and visitor seating.', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, description, image_url, is_active)
VALUES (19, 'Outdoor Furniture', 'Explore outdoor planters, metal tables, garden chairs, planter stands, racks, trolleys and durable steel storage solutions.', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. Subcategories
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (1, 8, 'Storewell', 'Reinforced CRCA steel storewell cupboards with internal safety locker and adjustable shelving.', '/images-webp/cupboard1.webp', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (2, 8, 'Industrial locker', 'Multi-tier staff and worker steel locker units with ventilation louvers and padlock hasps.', '/images-webp/metal-drawer1.webp', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (3, 8, 'Almirah', 'Royal steel home almirahs with full-length dressing mirror, secret locker, and hanging rod.', '/images-webp/cupboard2.webp', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (4, 8, 'Unit cupboard', 'Compact modular steel storage cupboards for utility rooms, offices, and tool storage.', '/images-webp/cupboard3.webp', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (5, 8, 'Filing cabinet', 'Heavy-duty 2, 3, and 4 drawer vertical steel filing cabinets with central gang locking.', '/images-webp/metal-drawer2.webp', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (6, 8, 'Bookcase', 'Glass-door steel display bookcases for library books, office records, and awards.', '/images-webp/cupboard5.webp', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (7, 8, 'Library cupboard', 'High-density multi-compartment institutional library book cupboards with heavy shelf ratings.', '/images-webp/library1.webp', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (40, 10, 'Employee Desk', 'Employee Desk furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (41, 10, 'Storage', 'Storage furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (42, 10, 'Pedestal', 'Pedestal furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (43, 10, 'Executive Boss Table', 'Executive Boss Table furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (44, 10, 'Reception Table', 'Reception Table furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (45, 10, 'Workstation', 'Workstation furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (46, 10, 'Conference Table', 'Conference Table furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (47, 10, 'Storewell', 'Storewell furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (48, 10, 'Metal Office Table', 'Metal Office Table furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (49, 10, 'Metal Pedestal', 'Metal Pedestal furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (50, 10, 'Metal Table', 'Metal Table furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (51, 13, 'Living Room Sofas', 'Living Room Sofas furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (52, 13, 'Solid Wood Dining', 'Solid Wood Dining furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (53, 13, 'Entertainment Units', 'Entertainment Units furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (54, 13, 'Center & Coffee Tables', 'Center & Coffee Tables furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (55, 18, 'Chair', 'Chair furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (56, 18, 'Stool', 'Stool furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (57, 18, 'Boss Chair', 'Boss Chair furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (58, 18, 'Office Chair', 'Office Chair furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (59, 18, 'Office Sofa', 'Office Sofa furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (60, 19, 'Metal Planter', 'Metal Planter furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (61, 19, 'Metal Table', 'Metal Table furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (62, 19, 'Garden Chair', 'Garden Chair furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (63, 19, 'Steel Storage Unit', 'Steel Storage Unit furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (64, 19, 'Metal Sofa', 'Metal Sofa furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (65, 19, 'Planter Stand', 'Planter Stand furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (66, 19, 'Planter Rack', 'Planter Rack furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (67, 19, 'Planter Trolley with Wheels', 'Planter Trolley with Wheels furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (68, 15, 'Commercial Bunk Bed', 'Commercial Bunk Bed furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (69, 15, 'Home Bunk Bed', 'Home Bunk Bed furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (70, 15, 'Kids Bunk Bed', 'Kids Bunk Bed furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active)
VALUES (71, 15, 'Hostel Bunk Bed', 'Hostel Bunk Bed furniture pieces', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;

-- 4. Products
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (1, 2, NULL, 'Luna 3-Seater Sofa', 'luna-3-seater-sofa', 'Comfortable modern 3-seater sofa', NULL, 29999.00, 24999.00, 'WV-001', 25, 'active', true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (2, 2, NULL, 'Modern Bed', 'modern-bed', 'Modern bedroom furniture', NULL, 24999.00, NULL, 'BED-001', 10, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (3, 3, NULL, 'Milo Lounge Chair', 'milo-lounge-chair', 'Comfortable lounge chair', NULL, 8499.00, NULL, 'CHAIR-001', 10, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (4, 2, NULL, 'Nordic King Bed', 'nordic-king-bed', 'Modern king-size bed for bedrooms', NULL, 39999.00, 32999.00, 'WV-004', 25, 'active', true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (5, 2, NULL, 'Aurelia Dining Table', 'aurelia-dining-table', 'Premium dining table', NULL, 22999.00, 18999.00, 'WV-005', 25, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (6, 2, NULL, 'Madera Wardrobe', 'madera-wardrobe', 'Spacious wooden wardrobe', NULL, 34999.00, 28999.00, 'WV-006', 25, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (7, 2, NULL, 'Arlo Accent Chair', 'arlo-accent-chair', 'Contemporary accent chair', NULL, 11999.00, 9499.00, 'WV-007', 25, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (8, 2, NULL, 'Elara Queen Bed', 'elara-queen-bed', 'Refined queen-size bed', NULL, 32999.00, 27999.00, 'WV-008', 25, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (101, 10, 40, 'Professional Employee Work Table', 'professional-employee-work-table-101', 'A professional employee work table designed for daily office tasks, offering a clean and organized workspace.', 'A professional employee work table designed for daily office tasks, offering a clean and organized workspace.', 7200.00, 5499.00, 'WV-101', 50, 'active', true, '[]'::jsonb, '["Bestseller","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (102, 10, 43, 'Executive Boss Office Table', 'executive-boss-office-table-102', 'An executive office table designed to create a distinguished and professional management workspace.', 'An executive office table designed to create a distinguished and professional management workspace.', 31000.00, 24999.00, 'WV-102', 50, 'active', true, '[]'::jsonb, '["Premium","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (103, 10, 45, 'Modular Office Workstation', 'modular-office-workstation-103', 'A modular workstation designed to support collaborative work and organized team seating in modern offices.', 'A modular workstation designed to support collaborative work and organized team seating in modern offices.', 48000.00, 38999.00, 'WV-103', 50, 'active', true, '[]'::jsonb, '["Popular","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (104, 10, 42, 'Wooden Office Storage Pedestal', 'wooden-office-storage-pedestal-104', 'A wooden mobile pedestal designed to keep office essentials organized and easily accessible.', 'A wooden mobile pedestal designed to keep office essentials organized and easily accessible.', 5800.00, 4499.00, 'WV-104', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (105, 10, 44, 'Premium Front Office Reception Desk', 'premium-front-office-reception-desk-105', 'A premium reception counter designed to create a welcoming first impression for visitors and clients.', 'A premium reception counter designed to create a welcoming first impression for visitors and clients.', 27500.00, 21999.00, 'WV-105', 50, 'active', true, '[]'::jsonb, '["Luxury","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (106, 10, 41, 'Modular Office Storage Credenza Cabinet', 'modular-office-storage-credenza-cabinet-106', 'Spacious wooden credenza with sliding shutters, adjustable shelves, and lockable compartments for confidential files.', 'Spacious wooden credenza with sliding shutters, adjustable shelves, and lockable compartments for confidential files.', 15000.00, 11999.00, 'WV-106', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (107, 10, 48, 'Heavy-Duty Steel Office Table', 'heavy-duty-steel-office-table-107', 'A heavy-duty steel office table designed for dependable everyday use in professional work areas.', 'A heavy-duty steel office table designed for dependable everyday use in professional work areas.', 8500.00, 6499.00, 'WV-107', 50, 'active', true, '[]'::jsonb, '["Heavy Duty","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (108, 10, 49, 'Steel Mobile Storage Pedestal', 'steel-mobile-storage-pedestal-108', 'A steel mobile pedestal designed to provide convenient storage for everyday office essentials.', 'A steel mobile pedestal designed to provide convenient storage for everyday office essentials.', 6800.00, 5299.00, 'WV-108', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (109, 10, 50, 'Metal Utility Work Table', 'metal-utility-work-table-109', 'A versatile metal utility table suitable for everyday tasks in office and workshop environments.', 'A versatile metal utility table suitable for everyday tasks in office and workshop environments.', 7800.00, 5999.00, 'WV-109', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (110, 10, 47, 'Prime Steel Office Storewell Cupboard', 'prime-steel-office-storewell-cupboard-110', 'Prime CRCA steel office storage almirah with internal security locker and multi-point lever lock.', 'Prime CRCA steel office storage almirah with internal security locker and multi-point lever lock.', 22999.00, 18999.00, 'WV-110', 50, 'active', true, '[]'::jsonb, '["Heavy Duty","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (111, 10, 40, 'Compact Employee Office Desk', 'compact-employee-office-desk-111', 'A compact office desk ideal for individual workstations and space-efficient employee seating arrangements.', 'A compact office desk ideal for individual workstations and space-efficient employee seating arrangements.', 5499.00, NULL, 'WV-111', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (112, 10, 40, 'Classic Wooden Employee Table', 'classic-wooden-employee-table-112', 'A classic wooden employee table with a spacious work surface, side storage shelves, and drawers for keeping office essentials organized.', 'A classic wooden employee table with a spacious work surface, side storage shelves, and drawers for keeping office essentials organized.', 5499.00, NULL, 'WV-112', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (113, 10, 40, 'Functional Employee Work Desk', 'functional-employee-work-desk-113', 'A functional work desk suitable for organized staff areas and professional office environments.', 'A functional work desk suitable for organized staff areas and professional office environments.', 5499.00, NULL, 'WV-113', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (114, 10, 40, 'Contemporary Employee Desk', 'contemporary-employee-desk-114', 'A contemporary employee desk that brings a simple, professional appearance to modern workspaces.', 'A contemporary employee desk that brings a simple, professional appearance to modern workspaces.', 5499.00, NULL, 'WV-114', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (115, 10, 43, 'Modern Manager Executive Desk', 'modern-manager-executive-desk-115', 'A modern executive desk suited to managerial cabins and professional office interiors.', 'A modern executive desk suited to managerial cabins and professional office interiors.', 24999.00, NULL, 'WV-115', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (116, 10, 43, 'Leadership Office Desk', 'leadership-office-desk-116', 'A premium office desk designed for leadership spaces, combining a refined appearance with everyday functionality.', 'A premium office desk designed for leadership spaces, combining a refined appearance with everyday functionality.', 24999.00, NULL, 'WV-116', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (117, 10, 44, 'Contemporary Reception Counter', 'contemporary-reception-counter-117', 'A contemporary reception desk suitable for maintaining a polished and organized front office.', 'A contemporary reception desk suitable for maintaining a polished and organized front office.', 21999.00, NULL, 'WV-117', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (118, 10, 44, 'Corporate Welcome Reception Desk', 'corporate-welcome-reception-desk-118', 'A professional welcome desk designed to support visitor assistance and daily reception activities.', 'A professional welcome desk designed to support visitor assistance and daily reception activities.', 21999.00, NULL, 'WV-118', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (119, 10, 45, 'Organized Staff Office Workstation', 'organized-staff-office-workstation-119', 'A practical workstation solution for creating structured, comfortable, and productive employee work areas.', 'A practical workstation solution for creating structured, comfortable, and productive employee work areas.', 38999.00, NULL, 'WV-119', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (120, 10, 45, 'Space-Saving Modular Workstation', 'space-saving-modular-workstation-120', 'A space-conscious workstation designed to help offices maintain an efficient and well-organized layout.', 'A space-conscious workstation designed to help offices maintain an efficient and well-organized layout.', 38999.00, NULL, 'WV-120', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (121, 10, 46, 'Corporate Conference Table', 'corporate-conference-table-121', 'A professional conference table suitable for business meetings, team discussions, and corporate presentations.', 'A professional conference table suitable for business meetings, team discussions, and corporate presentations.', 19999.00, NULL, 'WV-121', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (122, 10, 46, 'Modern Boardroom Discussion Table', 'modern-boardroom-discussion-table-122', 'A modern meeting table designed to support collaboration and productive discussions in professional environments.', 'A modern meeting table designed to support collaboration and productive discussions in professional environments.', 19999.00, NULL, 'WV-122', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (123, 10, 46, 'Team Meeting Table', 'team-meeting-table-123', 'A practical table for team meetings, planning sessions, and collaborative decision-making.', 'A practical table for team meetings, planning sessions, and collaborative decision-making.', 19999.00, NULL, 'WV-123', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (124, 10, 42, 'Compact Wooden Office Pedestal', 'compact-wooden-office-pedestal-124', 'A compact wooden pedestal that offers a practical storage solution for organized workspaces.', 'A compact wooden pedestal that offers a practical storage solution for organized workspaces.', 4499.00, NULL, 'WV-124', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (125, 10, 49, 'Durable Metal Storage Pedestal', 'durable-metal-storage-pedestal-125', 'A durable metal pedestal suited to organized storage in offices and commercial workspaces.', 'A durable metal pedestal suited to organized storage in offices and commercial workspaces.', 5299.00, NULL, 'WV-125', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (126, 10, 49, 'Compact Steel Office Pedestal', 'compact-steel-office-pedestal-126', 'A compact steel storage pedestal that helps keep work areas neat and essential items within reach.', 'A compact steel storage pedestal that helps keep work areas neat and essential items within reach.', 5299.00, NULL, 'WV-126', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (127, 10, 49, 'Professional Metal Storage Unit', 'professional-metal-storage-unit-127', 'A practical metal storage unit designed for organized and efficient office environments.', 'A practical metal storage unit designed for organized and efficient office environments.', 5299.00, NULL, 'WV-127', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (128, 10, 50, 'Steel Utility Office Table', 'steel-utility-office-table-128', 'A steel utility table designed to provide a practical work surface for daily workplace activities.', 'A steel utility table designed to provide a practical work surface for daily workplace activities.', 5999.00, NULL, 'WV-128', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (129, 10, 50, 'Modern Steel Work Table', 'modern-steel-work-table-129', 'A modern steel table suitable for organized office tasks and general-purpose work areas.', 'A modern steel table suitable for organized office tasks and general-purpose work areas.', 5999.00, NULL, 'WV-129', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (130, 10, 50, 'Industrial Metal Utility Table', 'industrial-metal-utility-table-130', 'A functional metal table designed for practical use in office, commercial, and utility spaces.', 'A functional metal table designed for practical use in office, commercial, and utility spaces.', 5999.00, NULL, 'WV-130', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (131, 10, 48, 'Functional Steel Work Desk', 'functional-steel-work-desk-131', 'A practical steel desk suitable for daily office tasks and organized workplace arrangements.', 'A practical steel desk suitable for daily office tasks and organized workplace arrangements.', 6499.00, NULL, 'WV-131', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (132, 10, 48, 'Contemporary Metal Office Desk', 'contemporary-metal-office-desk-132', 'A metal office desk with a clean professional appearance for functional work environments.', 'A metal office desk with a clean professional appearance for functional work environments.', 6499.00, NULL, 'WV-132', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (201, 18, 58, 'AeroPro Ergonomic High-Back Office Chair', 'aeropro-ergonomic-high-back-office-chair-201', 'Breathable Korean mesh backrest, 3D adjustable armrests, adaptive lumbar curve, and class-4 hydraulic gas lift.', 'Breathable Korean mesh backrest, 3D adjustable armrests, adaptive lumbar curve, and class-4 hydraulic gas lift.', 15500.00, 11999.00, 'WV-201', 50, 'active', true, '[]'::jsonb, '["Bestseller","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (202, 18, 57, 'Presidential Bonded Leather Boss Chair', 'presidential-bonded-leather-boss-chair-202', 'A comfortable office chair with a cushioned seat, supportive backrest, and sturdy base, ideal for everyday office use.', 'A comfortable office chair with a cushioned seat, supportive backrest, and sturdy base, ideal for everyday office use.', 23000.00, 18499.00, 'WV-202', 100, 'active', false, '[]'::jsonb, '["Executive","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (203, 18, 55, 'Comfort Flex High-Density Office Chair', 'comfort-flex-high-density-office-chair-203', 'A contoured cushioned seat with a sturdy base and smooth swivel movement for everyday seating comfort.', 'A contoured cushioned seat with a sturdy base and smooth swivel movement for everyday seating comfort.', 8200.00, 6499.00, 'WV-203', 50, 'active', true, '[]'::jsonb, '["Popular","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (204, 18, 56, 'Padded Swivel Lab & Workshop Stool', 'padded-swivel-lab-workshop-stool-204', 'A padded swivel stool designed for workshops and laboratories, offering comfortable seating and a stable base for everyday use.', 'A padded swivel stool designed for workshops and laboratories, offering comfortable seating and a stable base for everyday use.', 4500.00, 3499.00, 'WV-204', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (205, 18, 59, 'Executive 3-Seater Leatherette Office Sofa', 'executive-3-seater-leatherette-office-sofa-205', 'A three-seater office sofa designed for reception areas, visitor lounges, and professional interiors.', 'A three-seater office sofa designed for reception areas, visitor lounges, and professional interiors.', 32000.00, 24999.00, 'WV-205', 50, 'active', true, '[]'::jsonb, '["Premium","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (206, 18, 58, 'ErgoComfort Adjustable Office Chair', 'ergocomfort-adjustable-office-chair-206', 'An ergonomic office chair with a supportive backrest and adjustable seating for everyday office work.', 'An ergonomic office chair with a supportive backrest and adjustable seating for everyday office work.', 9999.00, NULL, 'WV-206', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (207, 18, 58, 'Modern Mesh Task Chair', 'modern-mesh-task-chair-207', 'A modern mesh task chair designed for ventilation, flexible movement, and a neat professional workspace.', 'A modern mesh task chair designed for ventilation, flexible movement, and a neat professional workspace.', 8999.00, NULL, 'WV-207', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (208, 18, 58, 'Comfort Support Office Chair', 'comfort-support-office-chair-208', 'A comfortable office chair with a supportive seat and practical design for daily desk activities.', 'A comfortable office chair with a supportive seat and practical design for daily desk activities.', 8499.00, NULL, 'WV-208', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (209, 18, 58, 'Executive High-Back Office Chair', 'executive-high-back-office-chair-209', 'A high-back office chair designed to complement executive workspaces with a professional appearance.', 'A high-back office chair designed to complement executive workspaces with a professional appearance.', 10999.00, NULL, 'WV-209', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (210, 18, 57, 'Premium Executive Boss Chair', 'premium-executive-boss-chair-210', 'A premium executive chair designed for management cabins, featuring a sophisticated look and comfortable seating.', 'A premium executive chair designed for management cabins, featuring a sophisticated look and comfortable seating.', 16999.00, NULL, 'WV-210', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (211, 18, 57, 'Classic Leatherette Boss Chair', 'classic-leatherette-boss-chair-211', 'A classic boss chair with a professional appearance, suitable for executive offices and managerial workspaces.', 'A classic boss chair with a professional appearance, suitable for executive offices and managerial workspaces.', 15999.00, NULL, 'WV-211', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (212, 18, 57, 'Modern High-Back Manager Chair', 'modern-high-back-manager-chair-212', 'A modern high-back chair designed to complement office cabins with a refined executive seating style.', 'A modern high-back chair designed to complement office cabins with a refined executive seating style.', 17999.00, NULL, 'WV-212', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (213, 18, 55, 'Classic Cushioned Office Chair', 'classic-cushioned-office-chair-213', 'A classic cushioned chair with a supportive seat and simple design, suitable for offices, reception areas, and everyday seating.', 'A classic cushioned chair with a supportive seat and simple design, suitable for offices, reception areas, and everyday seating.', 4999.00, NULL, 'WV-213', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (214, 18, 55, 'Modern Visitor Seating Chair', 'modern-visitor-seating-chair-214', 'A modern visitor chair with a comfortable seat and durable design, ideal for reception areas, meeting rooms, and waiting spaces.', 'A modern visitor chair with a comfortable seat and durable design, ideal for reception areas, meeting rooms, and waiting spaces.', 3999.00, NULL, 'WV-214', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (216, 18, 56, 'Compact Round Cushioned Stool', 'compact-round-cushioned-stool-216', 'A compact round cushioned stool designed for comfortable seating in offices, workshops, and multipurpose indoor spaces.', 'A compact round cushioned stool designed for comfortable seating in offices, workshops, and multipurpose indoor spaces.', 2499.00, NULL, 'WV-216', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (217, 18, 56, 'Height-Adjustable Utility Stool', 'height-adjustable-utility-stool-217', 'A height-adjustable utility stool with a supportive seat, designed for flexible seating in laboratories, workshops, and workspaces.', 'A height-adjustable utility stool with a supportive seat, designed for flexible seating in laboratories, workshops, and workspaces.', 3299.00, NULL, 'WV-217', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (218, 18, 56, 'Modern Multipurpose Seating Stool', 'modern-multipurpose-seating-stool-218', 'A versatile multipurpose stool suitable for offices, service areas, and everyday indoor seating.', 'A versatile multipurpose stool suitable for offices, service areas, and everyday indoor seating.', 1999.00, NULL, 'WV-218', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (219, 18, 59, 'Modern Office Sofa', 'modern-office-sofa-219', 'A modern two-seater sofa designed for office reception areas, visitor lounges, and compact waiting spaces.', 'A modern two-seater sofa designed for office reception areas, visitor lounges, and compact waiting spaces.', 19999.00, NULL, 'WV-219', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (220, 18, 59, 'Premium Executive Waiting Sofa', 'premium-executive-waiting-sofa-220', 'A premium waiting sofa designed to create a welcoming and professional atmosphere in offices and commercial interiors.', 'A premium waiting sofa designed to create a welcoming and professional atmosphere in offices and commercial interiors.', 22999.00, NULL, 'WV-220', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (221, 18, 59, 'Contemporary Office Lounge Sofa', 'contemporary-office-lounge-sofa-221', 'A contemporary lounge sofa suitable for client waiting areas, reception spaces, and comfortable office seating arrangements.', 'A contemporary lounge sofa suitable for client waiting areas, reception spaces, and comfortable office seating arrangements.', 26999.00, NULL, 'WV-221', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (401, 13, 51, 'Luxe 3-Seater Velvet Living Room Sofa', 'luxe-3-seater-velvet-living-room-sofa-401', 'Opulent emerald velvet upholstery with high-resilience foam and tapered solid brass legs.', 'Opulent emerald velvet upholstery with high-resilience foam and tapered solid brass legs.', 42000.00, 32999.00, 'WV-401', 50, 'active', true, '[]'::jsonb, '["Coming Soon","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (501, 19, 60, 'Modern Minimalist Metal Planter', 'modern-minimalist-metal-planter-501', ' Enhance your garden or balcony with this elegant metal planter, designed to bring a clean and modern touch to your space.', ' Enhance your garden or balcony with this elegant metal planter, designed to bring a clean and modern touch to your space.', 2499.00, NULL, 'WV-501', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (502, 19, 61, 'Stainless Steel Utility Table', 'stainless-steel-utility-table-502', 'A sleek and durable stainless steel utility table, ideal for kitchens, workspaces and everyday commercial use.', 'A sleek and durable stainless steel utility table, ideal for kitchens, workspaces and everyday commercial use.', 7499.00, NULL, 'WV-502', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (503, 19, 62, 'Premium Outdoor Lounge Seating', 'premium-outdoor-lounge-seating-503', 'Create a relaxing outdoor retreat with this elegant lounge seating set, perfect for garden patios, balconies and outdoor gatherings.', 'Create a relaxing outdoor retreat with this elegant lounge seating set, perfect for garden patios, balconies and outdoor gatherings.', 3999.00, NULL, 'WV-503', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (504, 19, 63, 'Heavy-Duty Black Steel Storage Rack', 'heavy-duty-black-steel-storage-rack-504', 'Maximize your storage space with this sturdy black steel rack, featuring multiple shelves for organizing tools, equipment and everyday essentials.', 'Maximize your storage space with this sturdy black steel rack, featuring multiple shelves for organizing tools, equipment and everyday essentials.', 12999.00, NULL, 'WV-504', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (506, 19, 65, 'Multi-Tier Metal Plant Stand', 'multi-tier-metal-plant-stand-506', 'Organize and display your favourite plants with this elegant multi-tier metal stand, perfect for living rooms, balconies and indoor gardens.', 'Organize and display your favourite plants with this elegant multi-tier metal stand, perfect for living rooms, balconies and indoor gardens.', 2999.00, NULL, 'WV-506', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (507, 19, 66, 'Wooden Slat Metal Plant Rack', 'wooden-slat-metal-plant-rack-507', 'Combine style and functionality with this multi-tier plant rack featuring wooden slats and a sturdy metal frame, ideal for balconies, patios and garden spaces.', 'Combine style and functionality with this multi-tier plant rack featuring wooden slats and a sturdy metal frame, ideal for balconies, patios and garde', 3699.00, NULL, 'WV-507', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (508, 19, 67, 'Rectangular Metal Plant Trolley', 'rectangular-metal-plant-trolley-508', 'Move your potted plants effortlessly with this rectangular metal trolley, featuring a sturdy frame and smooth-rolling wheels for convenient plant placement.', 'Move your potted plants effortlessly with this rectangular metal trolley, featuring a sturdy frame and smooth-rolling wheels for convenient plant plac', 1499.00, NULL, 'WV-508', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (509, 19, 60, 'Contemporary Stand Metal Planter', 'contemporary-stand-metal-planter-509', ' A stylish planter with a sleek stand design, perfect for displaying indoor plants and adding a sophisticated look to your interiors.', ' A stylish planter with a sleek stand design, perfect for displaying indoor plants and adding a sophisticated look to your interiors.', 2699.00, NULL, 'WV-509', 100, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (510, 19, 60, 'Premium Geometric Metal Planter', 'premium-geometric-metal-planter-510', ' Featuring a modern geometric stand, this metal planter adds a refined decorative touch to living spaces, balconies and patios.', ' Featuring a modern geometric stand, this metal planter adds a refined decorative touch to living spaces, balconies and patios.', 2899.00, NULL, 'WV-510', 100, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (511, 19, 60, 'Elegant Gold-Finish Planter Stand', 'elegant-gold-finish-planter-stand-511', ' Elevate your décor with this elegant gold-finish planter stand, ideal for showcasing greenery in contemporary homes and stylish outdoor spaces.', ' Elevate your décor with this elegant gold-finish planter stand, ideal for showcasing greenery in contemporary homes and stylish outdoor spaces.', 2299.00, NULL, 'WV-511', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (512, 19, 60, 'Luxury Gold Metal Planter Set', 'luxury-gold-metal-planter-set-512', ' Create a beautiful display with this gold-finish planter set, combining decorative elegance and greenery to complement modern interiors.', ' Create a beautiful display with this gold-finish planter set, combining decorative elegance and greenery to complement modern interiors.', 3199.00, NULL, 'WV-512', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (513, 19, 61, 'Heavy-Duty Stainless Steel Table', 'heavy-duty-stainless-steel-table-513', 'Designed for durability and everyday performance, this sturdy metal table is suitable for commercial workspaces and utility areas.', 'Designed for durability and everyday performance, this sturdy metal table is suitable for commercial workspaces and utility areas.', 7999.00, NULL, 'WV-513', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (514, 19, 61, 'Industrial Metal Frame Table', 'industrial-metal-frame-table-514', 'Featuring a strong geometric metal frame, this versatile table is ideal for outdoor settings, workshops and customized furniture applications.', 'Featuring a strong geometric metal frame, this versatile table is ideal for outdoor settings, workshops and customized furniture applications.', 8499.00, NULL, 'WV-514', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (515, 19, 62, 'Classic Wooden Folding Chair', 'classic-wooden-folding-chair-515', 'A timeless wooden folding chair designed for comfortable outdoor seating, ideal for gardens, patios and compact balcony spaces.', 'A timeless wooden folding chair designed for comfortable outdoor seating, ideal for gardens, patios and compact balcony spaces.', 4299.00, NULL, 'WV-515', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (516, 19, 62, 'Elegant Wooden Armrest Chair', 'elegant-wooden-armrest-chair-516', 'Featuring a warm wooden finish and supportive armrests, this chair adds natural charm to gardens, patios and outdoor seating areas.', 'Featuring a warm wooden finish and supportive armrests, this chair adds natural charm to gardens, patios and outdoor seating areas.', 4499.00, NULL, 'WV-516', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (517, 19, 62, 'Modern Woven Garden Chair Set', 'modern-woven-garden-chair-set-517', 'Enhance your outdoor dining experience with stylish woven chairs and a coordinated table, perfect for balconies, patios and garden gatherings.', 'Enhance your outdoor dining experience with stylish woven chairs and a coordinated table, perfect for balconies, patios and garden gatherings.', 4799.00, NULL, 'WV-517', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (518, 19, 63, 'Multi-Tier Metal Storage Rack', 'multi-tier-metal-storage-rack-518', 'A versatile multi-tier metal rack designed for efficient storage and easy organization in warehouses, workshops, garages and utility spaces.', 'A versatile multi-tier metal rack designed for efficient storage and easy organization in warehouses, workshops, garages and utility spaces.', 13999.00, NULL, 'WV-518', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (519, 19, 63, 'Compact Industrial Steel Shelf', 'compact-industrial-steel-shelf-519', 'Featuring a space-saving design and a strong metal frame, this compact shelving unit is ideal for organizing supplies and accessories in homes or workspaces.', 'Featuring a space-saving design and a strong metal frame, this compact shelving unit is ideal for organizing supplies and accessories in homes or work', 14999.00, NULL, 'WV-519', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (520, 19, 65, 'Modern Slatted Planter Bench', 'modern-slatted-planter-bench-520', 'Featuring a sleek slatted design, this versatile planter stand offers a stylish way to arrange potted plants in gardens, patios and outdoor spaces.', 'Featuring a sleek slatted design, this versatile planter stand offers a stylish way to arrange potted plants in gardens, patios and outdoor spaces.', 3299.00, NULL, 'WV-520', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (521, 19, 65, 'Foldable Metal Planter Stand', 'foldable-metal-planter-stand-521', 'A space-efficient metal plant stand with a foldable-style structure, designed to display plants neatly on balconies, patios and compact outdoor areas.', 'A space-efficient metal plant stand with a foldable-style structure, designed to display plants neatly on balconies, patios and compact outdoor areas.', 3499.00, NULL, 'WV-521', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (522, 19, 65, 'Geometric Multi-Level Plant Stand', 'geometric-multi-level-plant-stand-522', 'Showcase your greenery with this contemporary multi-level metal stand, featuring a geometric design that adds visual interest to gardens and balconies.', 'Showcase your greenery with this contemporary multi-level metal stand, featuring a geometric design that adds visual interest to gardens and balconies', 3799.00, NULL, 'WV-522', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (523, 19, 66, 'Corner Metal Planter Rack', 'corner-metal-planter-rack-523', 'Make the most of unused corners with this space-saving metal planter rack, designed to display potted plants neatly on balconies and outdoor areas.', 'Make the most of unused corners with this space-saving metal planter rack, designed to display potted plants neatly on balconies and outdoor areas.', 3999.00, NULL, 'WV-523', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (524, 19, 66, 'Heavy-Duty Multi-Level Plant Rack', 'heavy-duty-multi-level-plant-rack-524', 'Organize your plants with this spacious multi-level metal rack, offering a practical display solution for gardens, patios and outdoor spaces.', 'Organize your plants with this spacious multi-level metal rack, offering a practical display solution for gardens, patios and outdoor spaces.', 4299.00, NULL, 'WV-524', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (525, 19, 67, 'Round Metal Plant Caddy', 'round-metal-plant-caddy-525', 'Designed for convenient plant movement, this round metal trolley provides a practical base for moving and repositioning planters with ease.', 'Designed for convenient plant movement, this round metal trolley provides a practical base for moving and repositioning planters with ease.', 1699.00, NULL, 'WV-525', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (526, 19, 67, 'Heavy-Duty Round Planter Trolley', 'heavy-duty-round-planter-trolley-526', 'A practical round planter trolley with caster wheels, ideal for moving large pots and keeping your plants easy to access and reposition.', 'A practical round planter trolley with caster wheels, ideal for moving large pots and keeping your plants easy to access and reposition.', 1799.00, NULL, 'WV-526', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (527, 19, 67, 'Square Wheeled Plant Stand', 'square-wheeled-plant-stand-527', 'Keep your plants mobile with this square metal trolley, designed to support convenient movement and flexible placement in gardens, balconies and patios.', 'Keep your plants mobile with this square metal trolley, designed to support convenient movement and flexible placement in gardens, balconies and patio', 1899.00, NULL, 'WV-527', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (528, 19, 67, 'Round Metal Planter Dolly', 'round-metal-planter-dolly-528', 'A compact round metal plant dolly designed to make repositioning potted plants simple and convenient in indoor and outdoor spaces.', 'A compact round metal plant dolly designed to make repositioning potted plants simple and convenient in indoor and outdoor spaces.', 1999.00, NULL, 'WV-528', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (601, 15, 68, 'Commercial Bunk Bed — Heavy Duty Double Decker', 'commercial-bunk-bed-heavy-duty-double-decker-601', 'A heavy-duty steel bunk bed designed for hostels, PG accommodations, dormitories, and commercial spaces. Its space-saving double-decker design makes it suitable for everyday use.', 'A heavy-duty steel bunk bed designed for hostels, PG accommodations, dormitories, and commercial spaces. Its space-saving double-decker design makes i', 17500.00, 13999.00, 'WV-601', 50, 'active', true, '[]'::jsonb, '["Heavy Duty","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (602, 15, 69, 'Home Bunk Bed — Stylish Steel Double Decker', 'home-bunk-bed-stylish-steel-double-decker-602', 'A stylish steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a practical solution for families while maintaining a neat, modern look.', 'A stylish steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a practical solution f', 14000.00, 11499.00, 'WV-602', 50, 'active', true, '[]'::jsonb, '["Family Favourite","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (603, 15, 70, 'Kids Bunk Bed — Safe & Colorful Design', 'kids-bunk-bed-safe-colorful-design-603', 'A space-saving bunk bed designed for children''s bedrooms. Its double-decker layout provides a practical sleeping arrangement for shared rooms.', 'A space-saving bunk bed designed for children''s bedrooms. Its double-decker layout provides a practical sleeping arrangement for shared rooms.', 12500.00, 9999.00, 'WV-603', 50, 'active', true, '[]'::jsonb, '["Kids Special","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (604, 15, 71, 'Hostel Bunk Bed — Institutional Grade Steel', 'hostel-bunk-bed-institutional-grade-steel-604', 'A robust steel bunk bed designed for hostels, schools, training centres, and dormitories. Its double-decker structure helps maximise available floor space.', 'A robust steel bunk bed designed for hostels, schools, training centres, and dormitories. Its double-decker structure helps maximise available floor s', 19000.00, 15499.00, 'WV-604', 50, 'active', true, '[]'::jsonb, '["Institutional","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (605, 15, 68, 'Commercial Bunk Bed — Steel Frame Design', 'commercial-bunk-bed-steel-frame-design-605', 'A practical commercial bunk bed featuring a sturdy steel-frame design. Ideal for accommodation facilities that need durable, space-efficient sleeping arrangements.', 'A practical commercial bunk bed featuring a sturdy steel-frame design. Ideal for accommodation facilities that need durable, space-efficient sleeping ', 18000.00, 14999.00, 'WV-605', 50, 'active', true, '[]'::jsonb, '["Commercial","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (606, 15, 71, 'Hostel Bunk Bed — Space Saving Design', 'hostel-bunk-bed-space-saving-design-606', 'A space-efficient bunk bed for shared accommodation and hostel rooms. Designed to provide two sleeping levels while making better use of limited room space.', 'A space-efficient bunk bed for shared accommodation and hostel rooms. Designed to provide two sleeping levels while making better use of limited room ', 17500.00, 14499.00, 'WV-606', 50, 'active', true, '[]'::jsonb, '["Space Saver","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (607, 15, 70, 'Kids Bunk Bed — Modern Bedroom Style', 'kids-bunk-bed-modern-bedroom-style-607', 'A modern bunk bed that combines a space-saving structure with a stylish look for children''s bedrooms and shared sleeping spaces.', 'A modern bunk bed that combines a space-saving structure with a stylish look for children''s bedrooms and shared sleeping spaces.', 13500.00, 10999.00, 'WV-607', 50, 'active', true, '[]'::jsonb, '["Modern Design","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (608, 15, 70, 'Kids Bunk Bed — Compact Double Decker', 'kids-bunk-bed-compact-double-decker-608', 'A compact double-decker bunk bed designed to make efficient use of bedroom space while providing a convenient sleeping arrangement for children.', 'A compact double-decker bunk bed designed to make efficient use of bedroom space while providing a convenient sleeping arrangement for children.', 13000.00, 10499.00, 'WV-608', 50, 'active', true, '[]'::jsonb, '["Compact","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (609, 15, 70, 'Kids Bunk Bed — Contemporary Design', 'kids-bunk-bed-contemporary-design-609', 'A contemporary bunk bed suitable for children''s rooms and shared bedrooms. Its vertical sleeping arrangement helps create more usable space in the room.', 'A contemporary bunk bed suitable for children''s rooms and shared bedrooms. Its vertical sleeping arrangement helps create more usable space in the roo', 14500.00, 11999.00, 'WV-609', 50, 'active', true, '[]'::jsonb, '["Popular","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (610, 15, 69, 'Home Bunk Bed — Modern Steel Double Decker', 'home-bunk-bed-modern-steel-double-decker-610', 'A modern steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a comfortable and practical sleeping arrangement while keeping the room organised.', 'A modern steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a comfortable and pract', 15000.00, 12499.00, 'WV-610', 50, 'active', true, '[]'::jsonb, '["Modern Design","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (701, 8, 1, 'Premium Steel Storewell with Security Locker', 'premium-steel-storewell-with-security-locker-701', 'A durable steel storewell featuring an internal security locker, reinforced shelves, and a reliable multi-point locking system for organized office storage.', 'A durable steel storewell featuring an internal security locker, reinforced shelves, and a reliable multi-point locking system for organized office st', 22999.00, 18999.00, 'WV-701', 50, 'active', true, '[{"label":"Material","value":"CRCA Prime Steel (20/22 Gauge)"},{"label":"Finish","value":"Anti-Rust Epoxy Powder Coated"},{"label":"Locking","value":"3-Way Multi-Point Key Lock"},{"label":"Features","value":"Internal Locker, Full Shelves, Heavy Duty Hinges"}]'::jsonb, '["Bestseller","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (702, 8, 1, 'Heavy-Duty Steel Storewell with Hanging Space', 'heavy-duty-steel-storewell-with-hanging-space-702', 'A spacious two-door steel storewell with a top shelf, hanging rod, and adjustable storage compartments for convenient office and household organization.', 'A spacious two-door steel storewell with a top shelf, hanging rod, and adjustable storage compartments for convenient office and household organizatio', 19999.00, 16499.00, 'WV-702', 40, 'active', true, '[{"label":"Dimensions","value":"78\" H x 36\" W x 19\" D"},{"label":"Shelves","value":"4 Multi-Level Adjustable Shelves"},{"label":"Warranty","value":"5 Years Anti-Corrosion Warranty"}]'::jsonb, '["Durable","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (703, 8, 5, 'Industrial Compartment Staff Locker', 'industrial-compartment-staff-locker-703', 'A multi-compartment steel locker designed for offices, factories, and gyms, featuring individual lockable sections and ventilation openings for personal storage.', 'A multi-compartment steel locker designed for offices, factories, and gyms, featuring individual lockable sections and ventilation openings for person', 21000.00, 17499.00, 'WV-703', 35, 'active', false, '[{"label":"Doors","value":"6 Individual Lockable Compartments"},{"label":"Ventilation","value":"Louver Air Vents on Each Door"}]'::jsonb, '["Industrial","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (704, 8, 5, 'Professional 4-Drawer Steel Filing Cabinet', 'professional-4-drawer-steel-filing-cabinet-704', 'A vertical steel filing cabinet with four spacious drawers, designed to organize A4 and legal-size documents with convenient access and an anti-tilt mechanism.', 'A vertical steel filing cabinet with four spacious drawers, designed to organize A4 and legal-size documents with convenient access and an anti-tilt m', 14500.00, 11499.00, 'WV-704', 30, 'active', true, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (705, 8, 3, 'Classic Two-Door Steel Almirah', 'classic-two-door-steel-almirah-705', 'A sturdy two-door steel almirah with a secure locking system and durable powder-coated finish, ideal for organized storage at home or in the office.', 'A sturdy two-door steel almirah with a secure locking system and durable powder-coated finish, ideal for organized storage at home or in the office.', 19999.00, 16499.00, 'WV-705', 20, 'active', true, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (706, 8, 3, 'Spacious Three-Door Steel Wardrobe', 'spacious-three-door-steel-wardrobe-706', 'A spacious three-door steel wardrobe designed for organized storage, with dedicated hanging space and shelving for clothing and everyday essentials.', 'A spacious three-door steel wardrobe designed for organized storage, with dedicated hanging space and shelving for clothing and everyday essentials.', 24500.00, 19999.00, 'WV-706', 25, 'active', false, '[]'::jsonb, '["Spacious","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (707, 8, 3, 'Royal Steel Almirah with Full Mirror', 'royal-steel-almirah-mirror', 'Luxury steel almirah with dressing mirror', NULL, 22999.00, 18999.00, 'ALM-001', 45, 'active', true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (708, 8, 4, 'Heavy-Duty Three-Door Steel Storage Cabinet', 'heavy-duty-three-door-steel-storage-cabinet-708', 'A robust three-door steel cabinet designed for workshops and commercial spaces, offering organized storage with reinforced shelves and secure locking.', 'A robust three-door steel cabinet designed for workshops and commercial spaces, offering organized storage with reinforced shelves and secure locking.', 22000.00, 17999.00, 'WV-708', 25, 'active', false, '[]'::jsonb, '["Workshop","Direct Factory Guarantee","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (709, 8, 7, 'Steel Library Cupboard with Glass Doors', 'steel-library-cupboard-with-glass-doors-709', 'A durable steel library cupboard with transparent glass doors and multiple shelves, ideal for neatly storing and displaying books, files, and reference materials in libraries, schools, and offices.', 'A durable steel library cupboard with transparent glass doors and multiple shelves, ideal for neatly storing and displaying books, files, and referenc', 18500.00, 14999.00, 'WV-709', 50, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (710, 8, 7, 'Double-Door Steel Bookcase with Glass Panels', 'double-door-steel-bookcase-with-glass-panels-710', 'A spacious steel bookcase featuring full-height glass-panel doors and multiple shelves, designed to keep books, documents, and records organized and protected.', 'A spacious steel bookcase featuring full-height glass-panel doors and multiple shelves, designed to keep books, documents, and records organized and p', 21000.00, 16999.00, 'WV-710', 40, 'active', false, '[]'::jsonb, '["Direct Factory Guarantee","Premium Finish","High Durability"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (711, 8, 5, 'Heavy-Duty 4-Drawer Steel Filing Cabinet', '4-drawer-steel-filing-cabinet', 'Central key lock vertical filing cabinet', NULL, 13500.00, 10999.00, 'FLG-001', 35, 'active', true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (712, 8, 5, 'Executive 3-Drawer Steel Filing Cabinet', '3-drawer-steel-filing-cabinet', 'Heavy duty metal filing unit', NULL, 11500.00, 9299.00, 'FLG-002', 30, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (713, 8, 6, 'Steel Bookcase with Toughened Glass Doors', 'steel-bookcase-glass-doors', '4mm toughened glass bookcase', NULL, 19499.00, 15999.00, 'BKC-001', 30, 'active', true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (714, 8, 6, 'Multi-Shelf Steel Library Bookcase', 'multi-shelf-library-bookcase', 'Heavy encyclopedia load bookcase', NULL, 17800.00, 14499.00, 'BKC-002', 25, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (715, 8, 7, 'Heavy-Duty Steel Library Cupboard', 'heavy-duty-library-cupboard', 'Multi-compartment library book cupboard', NULL, 20500.00, 16999.00, 'LIB-001', 40, 'active', true, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (716, 8, 7, 'Double-Bay Institutional Library Cupboard', 'double-bay-library-cupboard', 'Double bay high capacity library cupboard', NULL, 32000.00, 26499.00, 'LIB-002', 20, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (717, 8, 7, 'High-Density Stacking Library Book Cupboard', 'high-density-library-cupboard', 'Stackable library book storage unit', NULL, 24000.00, 19999.00, 'LIB-003', 25, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (718, 8, 2, 'Multi-Compartment Steel Library Record Locker', 'library-record-locker', 'Secure steel record locker', NULL, 28000.00, 22999.00, 'LIB-004', 15, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (719, 8, 4, 'Compact Single-Column Library Cupboard', 'single-column-library-cupboard', 'Space saving library cupboard', NULL, 14000.00, 11499.00, 'LIB-005', 30, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;
INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, specifications, highlights, info_sections)
VALUES (720, 8, 1, 'Archival Library Steel Storage Cupboard', 'archival-library-storage-cupboard', 'Air ventilated archival cupboard', NULL, 36000.00, 29999.00, 'LIB-006', 15, 'active', false, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

-- 5. Product Images
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (102, 1, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', 'Product 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (103, 2, 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c', 'Product 2', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (104, 3, 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc', 'Product 3', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (105, 4, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Product 4', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (106, 5, 'https://images.unsplash.com/photo-1617098900591-3f90928e8c54', 'Product 5', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (107, 6, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2', 'Product 6', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (108, 7, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91', 'Product 7', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (109, 8, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Product 8', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (221, 101, '/images-webp/employeetable1.webp', 'Professional Employee Work Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (222, 111, '/images-webp/employeetable2.webp', 'Compact Employee Office Desk - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (223, 112, '/images-webp/employeetable3.webp', 'Classic Wooden Employee Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (224, 113, '/images-webp/employeetable4.webp', 'Functional Employee Work Desk - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (225, 114, '/images-webp/employeetable5.webp', 'Contemporary Employee Desk - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (226, 102, '/images-webp/bosstable1.webp', 'Executive Boss Office Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (227, 115, '/images-webp/bosstable2.webp', 'Modern Manager Executive Desk - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (228, 116, '/images-webp/bosstable3.webp', 'Leadership Office Desk - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (229, 103, '/images-webp/workstation1.webp', 'Modular Office Workstation - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (230, 119, '/images-webp/workstation2.webp', 'Organized Staff Office Workstation - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (231, 120, '/images-webp/workstation3.webp', 'Space-Saving Modular Workstation - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (232, 121, '/images-webp/conferencetable1.webp', 'Corporate Conference Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (233, 122, '/images-webp/conferencetable2.webp', 'Modern Boardroom Discussion Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (234, 123, '/images-webp/conferencetable3.webp', 'Team Meeting Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (235, 104, '/images-webp/woodenpedestial1.webp', 'Wooden Office Storage Pedestal - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (236, 124, '/images-webp/woodenpedestial2.webp', 'Compact Wooden Office Pedestal - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (237, 105, '/images-webp/receptiontable1.webp', 'Premium Front Office Reception Desk - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (238, 117, '/images-webp/receptiontable2.webp', 'Contemporary Reception Counter - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (239, 118, '/images-webp/receptiontable3.webp', 'Corporate Welcome Reception Desk - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (240, 106, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80', 'Modular Office Storage Credenza Cabinet - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (241, 107, '/images-webp/steeltable1.webp', 'Heavy-Duty Steel Office Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (242, 131, '/images-webp/steeltable2.webp', 'Functional Steel Work Desk - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (243, 132, '/images-webp/stelltable3.webp', 'Contemporary Metal Office Desk - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (244, 108, '/images-webp/pedestialsteel1.webp', 'Steel Mobile Storage Pedestal - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (245, 125, '/images-webp/pedestialsteel2.webp', 'Durable Metal Storage Pedestal - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (246, 126, '/images-webp/pedestialsteel3.webp', 'Compact Steel Office Pedestal - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (247, 127, '/images-webp/pedestialsteel4.webp', 'Professional Metal Storage Unit - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (248, 109, '/images-webp/metaltable.webp', 'Metal Utility Work Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (249, 128, '/images-webp/steeltable1.webp', 'Steel Utility Office Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (250, 129, '/images-webp/steeltable2.webp', 'Modern Steel Work Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (251, 130, '/images-webp/stelltable3.webp', 'Industrial Metal Utility Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (252, 110, '/images-webp/cupboard1.webp', 'Prime Steel Office Storewell Cupboard - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (253, 110, '/images-webp/cupboard2.webp', 'Prime Steel Office Storewell Cupboard - view 2', 1, false)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (254, 110, '/images-webp/cupboard5.webp', 'Prime Steel Office Storewell Cupboard - view 3', 2, false)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (255, 401, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', 'Luxe 3-Seater Velvet Living Room Sofa - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (256, 201, '/images-webp/officechair1.webp', 'AeroPro Ergonomic High-Back Office Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (257, 202, '/images-webp/bosschair1.webp', 'Presidential Bonded Leather Boss Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (258, 203, '/images-webp/chair1.webp', 'Comfort Flex High-Density Office Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (259, 204, '/images-webp/stool1.webp', 'Padded Swivel Lab & Workshop Stool - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (260, 205, '/images-webp/officesopa1.webp', 'Executive 3-Seater Leatherette Office Sofa - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (261, 206, '/images-webp/officechair2.webp', 'ErgoComfort Adjustable Office Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (262, 207, '/images-webp/officechair3.webp', 'Modern Mesh Task Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (263, 208, '/images-webp/officechair4.webp', 'Comfort Support Office Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (264, 209, '/images-webp/officechair5.webp', 'Executive High-Back Office Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (265, 210, '/images-webp/bosschair2.webp', 'Premium Executive Boss Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (266, 211, '/images-webp/bosschair3.webp', 'Classic Leatherette Boss Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (267, 212, '/images-webp/bosschair4.webp', 'Modern High-Back Manager Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (268, 213, '/images-webp/chair2.webp', 'Classic Cushioned Office Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (269, 214, '/images-webp/chair3.webp', 'Modern Visitor Seating Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (270, 216, '/images-webp/stool2.webp', 'Compact Round Cushioned Stool - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (271, 217, '/images-webp/stool3.webp', 'Height-Adjustable Utility Stool - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (272, 218, '/images-webp/stool4.webp', 'Modern Multipurpose Seating Stool - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (273, 219, '/images-webp/officesopa4.webp', 'Modern Office Sofa - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (274, 220, '/images-webp/officesopa2.webp', 'Premium Executive Waiting Sofa - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (275, 221, '/images-webp/officesopa3.webp', 'Contemporary Office Lounge Sofa - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (276, 701, '/images-webp/cupboard1.webp', 'Premium Steel Storewell with Security Locker - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (277, 702, '/images-webp/cupboard2.webp', 'Heavy-Duty Steel Storewell with Hanging Space - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (278, 703, '/images-webp/metal-drawer1.webp', 'Industrial Compartment Staff Locker - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (279, 704, '/images-webp/metal-drawer4.webp', 'Professional 4-Drawer Steel Filing Cabinet - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (280, 705, '/images-webp/cupboard4.webp', 'Classic Two-Door Steel Almirah - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (281, 706, '/images-webp/cupboard3.webp', 'Spacious Three-Door Steel Wardrobe - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (282, 708, '/images-webp/cupboard5.webp', 'Heavy-Duty Three-Door Steel Storage Cabinet - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (283, 709, '/images-webp/library1.webp', 'Steel Library Cupboard with Glass Doors - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (284, 710, '/images-webp/library2.webp', 'Double-Door Steel Bookcase with Glass Panels - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (285, 501, '/metalplanter1.jpeg', ' Modern Minimalist Metal Planter - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (286, 509, '/metalplanter2.jpeg', 'Contemporary Stand Metal Planter - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (287, 510, '/metalplanter3.jpeg', 'Premium Geometric Metal Planter - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (288, 511, '/metalplanter4.jpeg', 'Elegant Gold-Finish Planter Stand - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (289, 512, '/metalplanter5.jpeg', 'Luxury Gold Metal Planter Set - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (290, 502, '/mtable1.jpeg', 'Stainless Steel Utility Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (291, 513, '/mtable2.jpeg', 'Heavy-Duty Stainless Steel Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (292, 514, '/mtable3.jpeg', 'Industrial Metal Frame Table - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (293, 503, '/gchair1.jpeg', 'Premium Outdoor Lounge Seating - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (294, 515, '/gchair2.jpeg', 'Classic Wooden Folding Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (295, 516, '/gchair3.jpeg', 'Elegant Wooden Armrest Chair - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (296, 517, '/gchair4.jpeg', 'Modern Woven Garden Chair Set - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (297, 504, '/ssunit1.jpeg', 'Heavy-Duty Black Steel Storage Rack - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (298, 518, '/ssunit2.jpeg', 'Multi-Tier Metal Storage Rack - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (299, 519, '/ssunit3.jpeg', 'Compact Industrial Steel Shelf - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (300, 506, '/pstand1.jpeg', 'Multi-Tier Metal Plant Stand - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (301, 520, '/pstand2.jpeg', 'Modern Slatted Planter Bench - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (302, 521, '/pstand3.jpeg', 'Foldable Metal Planter Stand - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (303, 522, '/pstand4.jpeg', 'Geometric Multi-Level Plant Stand - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (304, 507, '/prack1.jpeg', 'Wooden Slat Metal Plant Rack - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (305, 523, '/prack2.jpeg', 'Corner Metal Planter Rack - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (306, 524, '/prack3.jpeg', 'Heavy-Duty Multi-Level Plant Rack - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (307, 508, '/ptrolly1.jpeg', 'Rectangular Metal Plant Trolley - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (308, 525, '/ptrolly2.jpeg', 'Round Metal Plant Caddy - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (309, 526, '/ptrolly3.jpeg', 'Heavy-Duty Round Planter Trolley - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (310, 527, '/ptrolly4.jpeg', 'Square Wheeled Plant Stand - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (311, 528, '/ptrolly5.jpeg', 'Round Metal Planter Dolly - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (312, 601, '/images-webp/comercialbunk1.webp', 'Commercial Bunk Bed — Heavy Duty Double Decker - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (313, 605, '/images-webp/commercialbunk2.webp', 'Commercial Bunk Bed — Steel Frame Design - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (314, 602, '/images-webp/homebunk1.webp', 'Home Bunk Bed — Stylish Steel Double Decker - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (315, 604, '/images-webp/hostelbunk1.webp', 'Hostel Bunk Bed — Institutional Grade Steel - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (316, 606, '/images-webp/hostelbunk2.webp', 'Hostel Bunk Bed — Space Saving Design - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (317, 603, '/images-webp/kidbunk1.webp', 'Kids Bunk Bed — Safe & Colorful Design - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (318, 607, '/images-webp/kidbunk2.webp', 'Kids Bunk Bed — Modern Bedroom Style - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (319, 608, '/images-webp/kidbunk3.webp', 'Kids Bunk Bed — Compact Double Decker - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (320, 609, '/images-webp/kidbunk4.webp', 'Kids Bunk Bed — Contemporary Design - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (321, 610, '/images-webp/homebunk2.webp', 'Home Bunk Bed — Modern Steel Double Decker - view 1', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (322, 707, '/images-webp/cupboard2.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (323, 711, '/images-webp/metal-drawer2.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (324, 712, '/images-webp/metal-drawer3.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (325, 713, '/images-webp/cupboard5.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (326, 714, '/images-webp/cupboard4.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (327, 715, '/images-webp/library1.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (328, 716, '/images-webp/library2.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (329, 717, '/images-webp/library1.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (330, 718, '/images-webp/metal-drawer1.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (331, 719, '/images-webp/cupboard3.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
VALUES (332, 720, '/images-webp/cupboard2.webp', 'Cupboard Product', 0, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, is_primary = EXCLUDED.is_primary;

-- 6. Sequence Updates
SELECT setval(pg_get_serial_sequence('categories', 'id'), GREATEST((SELECT MAX(id) FROM categories), 1));
SELECT setval(pg_get_serial_sequence('sub_categories', 'id'), GREATEST((SELECT MAX(id) FROM sub_categories), 1));
SELECT setval(pg_get_serial_sequence('products', 'id'), GREATEST((SELECT MAX(id) FROM products), 1));
SELECT setval(pg_get_serial_sequence('product_images', 'id'), GREATEST((SELECT MAX(id) FROM product_images), 1));
