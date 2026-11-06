-- Migration: 009_seed_cupboards_and_subcategories.sql
-- Synchronizes categories, subcategories, hero banners and website settings with client requirements.

-- 1. Ensure categories table has proper columns
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Ensure sub_categories table exists
CREATE TABLE IF NOT EXISTS sub_categories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Remove Supermarket Rack from categories (Client requirement: "Remove Supermarket rack")
DELETE FROM categories WHERE LOWER(name) LIKE '%supermarket%';

-- 4. Upsert the primary 8 store categories
INSERT INTO categories (name, description, image_url, is_active)
VALUES 
  ('Cupboards and Almirahs', 'Heavy-gauge steel storewells, almirahs, industrial lockers, bookcases, and library cupboards.', '/images-webp/cupboard1.webp', true),
  ('Metal Racks', 'Durable, multi-tier metal racks for organized industrial and home storage.', 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80', true),
  ('Office Furniture', 'Functional desks, conference tables, and modern setups for workspaces.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80', true),
  ('Office Chairs', 'Ergonomic, revolving, and executive chairs for all-day seating comfort.', 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1000&q=80', true),
  ('Office Metal Furniture', 'Durable metal desks, filing cabinets, and heavy-duty office workstations.', '/images-webp/metal-drawer2.webp', true),
  ('Home Furniture', 'Comfortable sofas, dining tables, and stylish living room sets.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80', true),
  ('Outdoor Chairs', 'Weather-resistant, sturdy chairs designed for patios, gardens, and cafes.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80', true),
  ('Bunk Beds', 'Space-saving and strong bunk bed frames for hostels, kids rooms, and homes.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80', true)
ON CONFLICT DO NOTHING;

-- Ensure Cupboards and Almirahs exists and capture its id
DO $$
DECLARE
  v_cupboard_id INT;
BEGIN
  SELECT id INTO v_cupboard_id FROM categories WHERE name = 'Cupboards and Almirahs' LIMIT 1;
  
  IF v_cupboard_id IS NULL THEN
    INSERT INTO categories (name, description, image_url, is_active)
    VALUES ('Cupboards and Almirahs', 'Heavy-gauge steel storewells, almirahs, industrial lockers, bookcases, and library cupboards.', '/images-webp/cupboard1.webp', true)
    RETURNING id INTO v_cupboard_id;
  END IF;

  -- 5. Seed the 7 client-specified subcategories under Cupboards and Almirahs:
  -- 1) Storewell
  -- 2) Industrial locker
  -- 3) Almirah
  -- 4) Unit cupboard
  -- 5) Filing cabinet
  -- 6) Bookcase
  -- 7) Library cupboard

  IF NOT EXISTS (SELECT 1 FROM sub_categories WHERE category_id = v_cupboard_id AND LOWER(name) = 'storewell') THEN
    INSERT INTO sub_categories (category_id, name, description, image_url, is_active)
    VALUES (v_cupboard_id, 'Storewell', 'Reinforced CRCA steel storewell cupboards with internal safety locker and adjustable shelving.', '/images-webp/cupboard1.webp', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM sub_categories WHERE category_id = v_cupboard_id AND LOWER(name) = 'industrial locker') THEN
    INSERT INTO sub_categories (category_id, name, description, image_url, is_active)
    VALUES (v_cupboard_id, 'Industrial locker', 'Multi-tier staff and worker steel locker units with ventilation louvers and padlock hasps.', '/images-webp/metal-drawer1.webp', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM sub_categories WHERE category_id = v_cupboard_id AND LOWER(name) = 'almirah') THEN
    INSERT INTO sub_categories (category_id, name, description, image_url, is_active)
    VALUES (v_cupboard_id, 'Almirah', 'Royal steel home almirahs with full-length dressing mirror, secret locker, and hanging rod.', '/images-webp/cupboard2.webp', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM sub_categories WHERE category_id = v_cupboard_id AND LOWER(name) = 'unit cupboard') THEN
    INSERT INTO sub_categories (category_id, name, description, image_url, is_active)
    VALUES (v_cupboard_id, 'Unit cupboard', 'Compact modular steel storage cupboards for utility rooms, offices, and tool storage.', '/images-webp/cupboard3.webp', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM sub_categories WHERE category_id = v_cupboard_id AND LOWER(name) = 'filing cabinet') THEN
    INSERT INTO sub_categories (category_id, name, description, image_url, is_active)
    VALUES (v_cupboard_id, 'Filing cabinet', 'Heavy-duty 2, 3, and 4 drawer vertical steel filing cabinets with central gang locking.', '/images-webp/metal-drawer2.webp', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM sub_categories WHERE category_id = v_cupboard_id AND LOWER(name) = 'bookcase') THEN
    INSERT INTO sub_categories (category_id, name, description, image_url, is_active)
    VALUES (v_cupboard_id, 'Bookcase', 'Glass-door steel display bookcases for library books, office records, and awards.', '/images-webp/cupboard5.webp', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM sub_categories WHERE category_id = v_cupboard_id AND LOWER(name) = 'library cupboard') THEN
    INSERT INTO sub_categories (category_id, name, description, image_url, is_active)
    VALUES (v_cupboard_id, 'Library cupboard', 'High-density multi-compartment institutional library book cupboards with heavy shelf ratings.', '/images-webp/library1.webp', true);
  END IF;
END $$;

-- 6. Setup hero_banners table and seed active banners
CREATE TABLE IF NOT EXISTS hero_banners (
  id SERIAL PRIMARY KEY,
  eyebrow VARCHAR(100) DEFAULT 'MODERN FURNITURE',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  button_text VARCHAR(100) DEFAULT 'Shop Now',
  button_link TEXT DEFAULT '/shop',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delete any legacy broken banners
DELETE FROM hero_banners WHERE image_url LIKE '%casamilanofurnishings.com%';

-- Ensure hero banners exist
INSERT INTO hero_banners (eyebrow, title, description, image_url, button_text, button_link)
SELECT 'HEAVY-DUTY STEEL STORAGE', 'Storewells, Almirahs & Industrial Lockers', 'Engineered from premium heavy-gauge steel with multi-point security locks, powder-coated finish and lifetime warranty.', '/images-webp/cupboard1.webp', 'Explore Cupboards & Almirahs', '/category/cupboards-almirahs'
WHERE NOT EXISTS (SELECT 1 FROM hero_banners WHERE button_link = '/category/cupboards-almirahs');

INSERT INTO hero_banners (eyebrow, title, description, image_url, button_text, button_link)
SELECT 'MODERN LIVING & HOME', 'Crafted for Timeless Comfort', 'Discover elegant sofas, dining sets, and curated furniture designed for modern spaces.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80', 'Shop Home Furniture', '/shop?category=Home%20Furniture'
WHERE NOT EXISTS (SELECT 1 FROM hero_banners WHERE eyebrow = 'MODERN LIVING & HOME');

INSERT INTO hero_banners (eyebrow, title, description, image_url, button_text, button_link)
SELECT 'HEAVY-DUTY STORAGE', 'Industrial & Warehouse Racks', 'Multi-tier powder coated storage racks engineered for maximum durability & strength.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80', 'Shop Metal Racks', '/shop?category=Metal%20Racks'
WHERE NOT EXISTS (SELECT 1 FROM hero_banners WHERE eyebrow = 'HEAVY-DUTY STORAGE');

INSERT INTO hero_banners (eyebrow, title, description, image_url, button_text, button_link)
SELECT 'EXECUTIVE WORKSPACE', 'Work Better, Sit Smarter', 'Breathable ergonomic mesh revolving chairs and modern modular office desks.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80', 'Explore Office Furniture', '/shop?category=Office%20Furniture'
WHERE NOT EXISTS (SELECT 1 FROM hero_banners WHERE eyebrow = 'EXECUTIVE WORKSPACE');

-- 7. Setup website_settings table with updated description under "Shop by category"
CREATE TABLE IF NOT EXISTS website_settings (
  id SERIAL PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  heading VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  button_text VARCHAR(100),
  button_link TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO website_settings (section_key, heading, description, is_active)
VALUES (
  'categories',
  'Shop by category',
  'Explore our premium collection of heavy-gauge steel storewells, almirahs, industrial lockers, bookcases, executive desks, and modern home essentials crafted for lifetime durability.',
  true
)
ON CONFLICT (section_key)
DO UPDATE SET
  heading = EXCLUDED.heading,
  description = EXCLUDED.description,
  updated_at = CURRENT_TIMESTAMP;
