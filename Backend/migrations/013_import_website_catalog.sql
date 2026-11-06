-- 013: Import the complete hardcoded website category catalog into the CMS products table.
-- Generated from website/src/data/categoriesData.ts (98 products). Safe to rerun.
-- Product IDs remain aligned with the storefront checkout IDs. Existing rows are updated to match
-- the website catalog; image and variant rows are inserted/updated idempotently without table resets.
BEGIN;

ALTER TABLE products ADD COLUMN IF NOT EXISTS badge text, ADD COLUMN IF NOT EXISTS catalog_rating numeric(2,1), ADD COLUMN IF NOT EXISTS catalog_rating_count integer NOT NULL DEFAULT 0;

-- Create only catalog lookup records that do not already exist. Existing category/subcategory rows are preserved.
INSERT INTO categories (id, name, description, image_url, is_active) VALUES (10, 'Office Furniture', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, description, image_url, is_active) VALUES (13, 'Home Furniture', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, description, image_url, is_active) VALUES (18, 'Seating Solutions', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, description, image_url, is_active) VALUES (8, 'Cupboards & Almirahs', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, description, image_url, is_active) VALUES (19, 'Outdoor Furniture', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, description, image_url, is_active) VALUES (15, 'Bunk Beds', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;

INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (40, 10, 'Employee Desk', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (43, 10, 'Executive Boss Table', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (45, 10, 'Workstation', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (46, 10, 'Conference Table', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (42, 10, 'Pedestal', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (44, 10, 'Reception Table', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (48, 10, 'Metal Office Table', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (49, 10, 'Metal Pedestal', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (50, 19, 'Metal Table', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (47, 10, 'Storewell', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (51, 13, 'Living Room Sofas', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (58, 18, 'Office Chair', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (57, 18, 'Boss Chair', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (55, 18, 'Chair', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (56, 18, 'Stool', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (59, 18, 'Office Sofa', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (1, 8, 'Storewell', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (5, 8, 'Filing Cabinet', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (3, 8, 'Almirah', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (4, 8, 'Unit Cupboard', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (7, 8, 'Library Cupboard', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (60, 19, 'Metal Planter', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (62, 19, 'Garden Chair', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (63, 19, 'Steel Storage Unit', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (65, 19, 'Planter Stand', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (66, 19, 'Planter Rack', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (67, 19, 'Planter Trolley with Wheels', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (68, 15, 'Commercial Bunk Bed', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (69, 15, 'Home Bunk Bed', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (71, 15, 'Hostel Bunk Bed', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO sub_categories (id, category_id, name, description, image_url, is_active) VALUES (70, 15, 'Kids Bunk Bed', NULL, NULL, TRUE) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (101, 10, 40, 'Employee Work Desk', 'employee-work-desk-101', 'A professional employee work table designed for daily office tasks, offering a clean and organized workspace.', 'A professional employee work table designed for daily office tasks, offering a clean and organized workspace.', 7200, 5499, 'WV-101', 50, 'active', true, 'Bestseller', 4.8, 28, '[]'::jsonb, '["Bestseller"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (111, 10, 40, 'Compact Employee Office Desk', 'compact-employee-office-desk-111', 'A compact office desk ideal for individual workstations and space-efficient employee seating arrangements.', 'A compact office desk ideal for individual workstations and space-efficient employee seating arrangements.', 5499, NULL, 'WV-111', 50, 'active', false, NULL, 4.8, 28, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (112, 10, 40, 'Classic Wooden Employee Desk', 'classic-wooden-employee-desk-112', 'A classic wooden employee table with a spacious work surface, side storage shelves, and drawers for keeping office essentials organized.', 'A classic wooden employee table with a spacious work surface, side storage shelves, and drawers for keeping office essentials organized.', 5499, NULL, 'WV-112', 50, 'active', false, NULL, 4.8, 28, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (113, 10, 40, 'Corporate Employee Desk', 'corporate-employee-desk-113', 'A functional work desk suitable for organized staff areas and professional office environments.', 'A functional work desk suitable for organized staff areas and professional office environments.', 5499, NULL, 'WV-113', 50, 'active', false, NULL, 4.8, 28, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (114, 10, 40, 'Contemporary Employee Desk', 'contemporary-employee-desk-114', 'A contemporary employee desk that brings a simple, professional appearance to modern workspaces.', 'A contemporary employee desk that brings a simple, professional appearance to modern workspaces.', 5499, NULL, 'WV-114', 50, 'active', false, NULL, 4.8, 28, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (102, 10, 43, 'Executive Office Table', 'executive-office-table-102', 'An executive office table designed to create a distinguished and professional management workspace.', 'An executive office table designed to create a distinguished and professional management workspace.', 31000, 24999, 'WV-102', 50, 'active', true, 'Premium', 4.9, 19, '[]'::jsonb, '["Premium"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (115, 10, 43, 'Modern Executive Desk', 'modern-executive-desk-115', 'A modern executive desk suited to managerial cabins and professional office interiors.', 'A modern executive desk suited to managerial cabins and professional office interiors.', 24999, NULL, 'WV-115', 50, 'active', false, NULL, 4.8, 16, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (116, 10, 43, 'Leadership Office Desk', 'leadership-office-desk-116', 'A premium office desk designed for leadership spaces, combining a refined appearance with everyday functionality.', 'A premium office desk designed for leadership spaces, combining a refined appearance with everyday functionality.', 24999, NULL, 'WV-116', 50, 'active', false, NULL, 4.8, 14, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (103, 10, 45, 'Modular Office Workstation', 'modular-office-workstation-103', 'A modular workstation designed to support collaborative work and organized team seating in modern offices.', 'A modular workstation designed to support collaborative work and organized team seating in modern offices.', 48000, 38999, 'WV-103', 50, 'active', true, 'Popular', 4.8, 34, '[]'::jsonb, '["Popular"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (119, 10, 45, 'Organized Staff Office Workstation', 'organized-staff-office-workstation-119', 'A practical workstation solution for creating structured, comfortable, and productive employee work areas.', 'A practical workstation solution for creating structured, comfortable, and productive employee work areas.', 38999, NULL, 'WV-119', 50, 'active', false, NULL, 4.8, 22, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (120, 10, 45, 'Space-Saving Modular Workstation', 'space-saving-modular-workstation-120', 'A space-conscious workstation designed to help offices maintain an efficient and well-organized layout.', 'A space-conscious workstation designed to help offices maintain an efficient and well-organized layout.', 38999, NULL, 'WV-120', 50, 'active', false, NULL, 4.7, 18, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (121, 10, 46, 'Corporate Conference Table', 'corporate-conference-table-121', 'A professional conference table suitable for business meetings, team discussions, and corporate presentations.', 'A professional conference table suitable for business meetings, team discussions, and corporate presentations.', 19999, NULL, 'WV-121', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (122, 10, 46, 'Modern Boardroom Discussion Table', 'modern-boardroom-discussion-table-122', 'A modern meeting table designed to support collaboration and productive discussions in professional environments.', 'A modern meeting table designed to support collaboration and productive discussions in professional environments.', 19999, NULL, 'WV-122', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (123, 10, 46, 'Team Meeting Table', 'team-meeting-table-123', 'A practical table for team meetings, planning sessions, and collaborative decision-making.', 'A practical table for team meetings, planning sessions, and collaborative decision-making.', 19999, NULL, 'WV-123', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (104, 10, 42, 'Wooden Office Storage Pedestal', 'wooden-office-storage-pedestal-104', 'A wooden mobile pedestal designed to keep office essentials organized and easily accessible.', 'A wooden mobile pedestal designed to keep office essentials organized and easily accessible.', 5800, 4499, 'WV-104', 50, 'active', false, NULL, 4.7, 21, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (124, 10, 42, 'Compact Wooden Office Pedestal', 'compact-wooden-office-pedestal-124', 'A compact wooden pedestal that offers a practical storage solution for organized workspaces.', 'A compact wooden pedestal that offers a practical storage solution for organized workspaces.', 4499, NULL, 'WV-124', 50, 'active', false, NULL, 4.7, 18, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (105, 10, 44, 'Premium Front Office Desk', 'premium-front-office-desk-105', 'A premium reception counter designed to create a welcoming first impression for visitors and clients.', 'A premium reception counter designed to create a welcoming first impression for visitors and clients.', 27500, 21999, 'WV-105', 50, 'active', false, 'Luxury', 4.9, 16, '[]'::jsonb, '["Luxury"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (117, 10, 44, 'Contemporary Reception Counter', 'contemporary-reception-counter-117', 'A contemporary reception desk suitable for maintaining a polished and organized front office.', 'A contemporary reception desk suitable for maintaining a polished and organized front office.', 21999, NULL, 'WV-117', 50, 'active', false, NULL, 4.8, 12, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (118, 10, 44, 'Corporate  Reception Desk', 'corporate-reception-desk-118', 'A professional welcome desk designed to support visitor assistance and daily reception activities.', 'A professional welcome desk designed to support visitor assistance and daily reception activities.', 21999, NULL, 'WV-118', 50, 'active', false, NULL, 4.8, 14, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (107, 10, 48, 'Heavy-Duty Steel Office Table', 'heavy-duty-steel-office-table-107', 'A heavy-duty steel office table designed for dependable everyday use in professional work areas.', 'A heavy-duty steel office table designed for dependable everyday use in professional work areas.', 8500, 6499, 'WV-107', 50, 'active', false, 'Heavy Duty', 4.8, 31, '[]'::jsonb, '["Heavy Duty"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (131, 10, 48, 'Functional Steel Work Desk', 'functional-steel-work-desk-131', 'A practical steel desk suitable for daily office tasks and organized workplace arrangements.', 'A practical steel desk suitable for daily office tasks and organized workplace arrangements.', 6499, NULL, 'WV-131', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (132, 10, 48, 'Contemporary Metal Office Desk', 'contemporary-metal-office-desk-132', 'A metal office desk with a clean professional appearance for functional work environments.', 'A metal office desk with a clean professional appearance for functional work environments.', 6499, NULL, 'WV-132', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (108, 10, 49, 'Steel Mobile Storage Pedestal', 'steel-mobile-storage-pedestal-108', 'A steel mobile pedestal designed to provide convenient storage for everyday office essentials.', 'A steel mobile pedestal designed to provide convenient storage for everyday office essentials.', 6800, 5299, 'WV-108', 50, 'active', false, NULL, 4.7, 18, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (125, 10, 49, 'Durable Metal Storage Pedestal', 'durable-metal-storage-pedestal-125', 'A durable metal pedestal suited to organized storage in offices and commercial workspaces.', 'A durable metal pedestal suited to organized storage in offices and commercial workspaces.', 5299, NULL, 'WV-125', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (126, 10, 49, 'Compact Steel Office Pedestal', 'compact-steel-office-pedestal-126', 'A compact steel storage pedestal that helps keep work areas neat and essential items within reach.', 'A compact steel storage pedestal that helps keep work areas neat and essential items within reach.', 5299, NULL, 'WV-126', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (127, 10, 49, 'Professional Metal Storage Unit', 'professional-metal-storage-unit-127', 'A practical metal storage unit designed for organized and efficient office environments.', 'A practical metal storage unit designed for organized and efficient office environments.', 5299, NULL, 'WV-127', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (109, 10, 50, 'Metal Utility Work Table', 'metal-utility-work-table-109', 'A versatile metal utility table suitable for everyday tasks in office and workshop environments.', 'A versatile metal utility table suitable for everyday tasks in office and workshop environments.', 7800, 5999, 'WV-109', 50, 'active', false, NULL, 4.7, 15, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (128, 10, 50, 'Steel Utility Office Table', 'steel-utility-office-table-128', 'A steel utility table designed to provide a practical work surface for daily workplace activities.', 'A steel utility table designed to provide a practical work surface for daily workplace activities.', 5999, NULL, 'WV-128', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (129, 10, 50, 'Modern Steel Work Table', 'modern-steel-work-table-129', 'A modern steel table suitable for organized office tasks and general-purpose work areas.', 'A modern steel table suitable for organized office tasks and general-purpose work areas.', 5999, NULL, 'WV-129', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (130, 10, 50, 'Industrial Metal Utility Table', 'industrial-metal-utility-table-130', 'A functional metal table designed for practical use in office, commercial, and utility spaces.', 'A functional metal table designed for practical use in office, commercial, and utility spaces.', 5999, NULL, 'WV-130', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (110, 10, 47, 'Prime Steel Office Storewell Cupboard', 'prime-steel-office-storewell-cupboard-110', 'Prime CRCA steel office storage almirah with internal security locker and multi-point lever lock.', 'Prime CRCA steel office storage almirah with internal security locker and multi-point lever lock.', 22999, 18999, 'WV-110', 50, 'active', false, 'Heavy Duty', 4.9, 38, '[]'::jsonb, '["Heavy Duty"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (401, 13, 51, 'Luxe 3-Seater Velvet Living Room Sofa', 'luxe-3-seater-velvet-living-room-sofa-401', 'Opulent emerald velvet upholstery with high-resilience foam and tapered solid brass legs.', 'Opulent emerald velvet upholstery with high-resilience foam and tapered solid brass legs.', 42000, 32999, 'WV-401', 50, 'active', false, 'Coming Soon', 4.9, 32, '[]'::jsonb, '["Coming Soon"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (201, 18, 58, 'AeroPro Ergonomic High-Back Office Chair', 'aeropro-ergonomic-high-back-office-chair-201', 'Breathable Korean mesh backrest, 3D adjustable armrests, adaptive lumbar curve, and class-4 hydraulic gas lift.', 'Breathable Korean mesh backrest, 3D adjustable armrests, adaptive lumbar curve, and class-4 hydraulic gas lift.', 15500, 11999, 'WV-201', 50, 'active', true, 'Bestseller', 4.9, 42, '[]'::jsonb, '["Bestseller"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (202, 18, 57, 'Presidential Bonded Leather Boss Chair', 'presidential-bonded-leather-boss-chair-202', 'A comfortable office chair with a cushioned seat, supportive backrest, and sturdy base, ideal for everyday office use.', 'A comfortable office chair with a cushioned seat, supportive backrest, and sturdy base, ideal for everyday office use.', 23000, 18499, 'WV-202', 50, 'active', false, 'Executive', 4.9, 31, '[]'::jsonb, '["Executive"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (203, 18, 55, 'Comfort Flex High-Density Office Chair', 'comfort-flex-high-density-office-chair-203', 'A contoured cushioned seat with a sturdy base and smooth swivel movement for everyday seating comfort.', 'A contoured cushioned seat with a sturdy base and smooth swivel movement for everyday seating comfort.', 8200, 6499, 'WV-203', 50, 'active', true, 'Popular', 4.7, 25, '[]'::jsonb, '["Popular"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (204, 18, 56, 'Padded Swivel Lab & Workshop Stool', 'padded-swivel-lab-workshop-stool-204', 'A padded swivel stool designed for workshops and laboratories, offering comfortable seating and a stable base for everyday use.', 'A padded swivel stool designed for workshops and laboratories, offering comfortable seating and a stable base for everyday use.', 4500, 3499, 'WV-204', 50, 'active', false, NULL, 4.6, 19, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (205, 18, 59, 'Executive 3-Seater Leatherette Office Sofa', 'executive-3-seater-leatherette-office-sofa-205', 'A three-seater office sofa designed for reception areas, visitor lounges, and professional interiors.', 'A three-seater office sofa designed for reception areas, visitor lounges, and professional interiors.', 32000, 24999, 'WV-205', 50, 'active', true, 'Premium', 4.9, 27, '[]'::jsonb, '["Premium"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (206, 18, 58, 'ErgoComfort Adjustable Office Chair', 'ergocomfort-adjustable-office-chair-206', 'An ergonomic office chair with a supportive backrest and adjustable seating for everyday office work.', 'An ergonomic office chair with a supportive backrest and adjustable seating for everyday office work.', 9999, NULL, 'WV-206', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (207, 18, 58, 'Modern Mesh Task Chair', 'modern-mesh-task-chair-207', 'A modern mesh task chair designed for ventilation, flexible movement, and a neat professional workspace.', 'A modern mesh task chair designed for ventilation, flexible movement, and a neat professional workspace.', 8999, NULL, 'WV-207', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (208, 18, 58, 'Comfort Support Office Chair', 'comfort-support-office-chair-208', 'A comfortable office chair with a supportive seat and practical design for daily desk activities.', 'A comfortable office chair with a supportive seat and practical design for daily desk activities.', 8499, NULL, 'WV-208', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (209, 18, 58, 'Executive High-Back Office Chair', 'executive-high-back-office-chair-209', 'A high-back office chair designed to complement executive workspaces with a professional appearance.', 'A high-back office chair designed to complement executive workspaces with a professional appearance.', 10999, NULL, 'WV-209', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (210, 18, 57, 'Premium Executive Boss Chair', 'premium-executive-boss-chair-210', 'A premium executive chair designed for management cabins, featuring a sophisticated look and comfortable seating.', 'A premium executive chair designed for management cabins, featuring a sophisticated look and comfortable seating.', 16999, NULL, 'WV-210', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (211, 18, 57, 'Classic Leatherette Boss Chair', 'classic-leatherette-boss-chair-211', 'A classic boss chair with a professional appearance, suitable for executive offices and managerial workspaces.', 'A classic boss chair with a professional appearance, suitable for executive offices and managerial workspaces.', 15999, NULL, 'WV-211', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (212, 18, 57, 'Modern High-Back Manager Chair', 'modern-high-back-manager-chair-212', 'A modern high-back chair designed to complement office cabins with a refined executive seating style.', 'A modern high-back chair designed to complement office cabins with a refined executive seating style.', 17999, NULL, 'WV-212', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (213, 18, 55, 'Classic Cushioned Office Chair', 'classic-cushioned-office-chair-213', 'A classic cushioned chair with a supportive seat and simple design, suitable for offices, reception areas, and everyday seating.', 'A classic cushioned chair with a supportive seat and simple design, suitable for offices, reception areas, and everyday seating.', 4999, NULL, 'WV-213', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (214, 18, 55, 'Modern Visitor Seating Chair', 'modern-visitor-seating-chair-214', 'A modern visitor chair with a comfortable seat and durable design, ideal for reception areas, meeting rooms, and waiting spaces.', 'A modern visitor chair with a comfortable seat and durable design, ideal for reception areas, meeting rooms, and waiting spaces.', 3999, NULL, 'WV-214', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (216, 18, 56, 'Compact Round Cushioned Stool', 'compact-round-cushioned-stool-216', 'A compact round cushioned stool designed for comfortable seating in offices, workshops, and multipurpose indoor spaces.', 'A compact round cushioned stool designed for comfortable seating in offices, workshops, and multipurpose indoor spaces.', 2499, NULL, 'WV-216', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (217, 18, 56, 'Height-Adjustable Utility Stool', 'height-adjustable-utility-stool-217', 'A height-adjustable utility stool with a supportive seat, designed for flexible seating in laboratories, workshops, and workspaces.', 'A height-adjustable utility stool with a supportive seat, designed for flexible seating in laboratories, workshops, and workspaces.', 3299, NULL, 'WV-217', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (218, 18, 56, 'Modern Multipurpose Seating Stool', 'modern-multipurpose-seating-stool-218', 'A versatile multipurpose stool suitable for offices, service areas, and everyday indoor seating.', 'A versatile multipurpose stool suitable for offices, service areas, and everyday indoor seating.', 1999, NULL, 'WV-218', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (219, 18, 59, 'Modern Office Sofa', 'modern-office-sofa-219', 'A modern two-seater sofa designed for office reception areas, visitor lounges, and compact waiting spaces.', 'A modern two-seater sofa designed for office reception areas, visitor lounges, and compact waiting spaces.', 19999, NULL, 'WV-219', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (220, 18, 59, 'Premium Executive Waiting Sofa', 'premium-executive-waiting-sofa-220', 'A premium waiting sofa designed to create a welcoming and professional atmosphere in offices and commercial interiors.', 'A premium waiting sofa designed to create a welcoming and professional atmosphere in offices and commercial interiors.', 22999, NULL, 'WV-220', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (221, 18, 59, 'Contemporary Office Lounge Sofa', 'contemporary-office-lounge-sofa-221', 'A contemporary lounge sofa suitable for client waiting areas, reception spaces, and comfortable office seating arrangements.', 'A contemporary lounge sofa suitable for client waiting areas, reception spaces, and comfortable office seating arrangements.', 26999, NULL, 'WV-221', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (701, 8, 1, 'Premium Steel Storewell with Security Locker', 'premium-steel-storewell-with-security-locker-701', 'A durable steel storewell featuring an internal security locker, reinforced shelves, and a reliable multi-point locking system for organized office storage.', 'A durable steel storewell featuring an internal security locker, reinforced shelves, and a reliable multi-point locking system for organized office storage.', 22999, 18999, 'WV-701', 50, 'active', true, 'Bestseller', 4.9, 34, '[{"label":"Material","value":"CRCA Prime Steel (20/22 Gauge)"},{"label":"Finish","value":"Anti-Rust Epoxy Powder Coated"},{"label":"Locking","value":"3-Way Multi-Point Key Lock"},{"label":"Features","value":"Internal Locker, Full Shelves, Heavy Duty Hinges"}]'::jsonb, '["Bestseller"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (702, 8, 1, 'Heavy-Duty Steel Storewell with Hanging Space', 'heavy-duty-steel-storewell-with-hanging-space-702', 'A spacious two-door steel storewell with a top shelf, hanging rod, and adjustable storage compartments for convenient office and household organization.', 'A spacious two-door steel storewell with a top shelf, hanging rod, and adjustable storage compartments for convenient office and household organization.', 19999, 16499, 'WV-702', 50, 'active', false, 'Durable', 4.8, 26, '[{"label":"Dimensions","value":"78\" H x 36\" W x 19\" D"},{"label":"Shelves","value":"4 Multi-Level Adjustable Shelves"},{"label":"Warranty","value":"5 Years Anti-Corrosion Warranty"}]'::jsonb, '["Durable"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (703, 8, 5, 'Industrial Compartment Staff Locker', 'industrial-compartment-staff-locker-703', 'A multi-compartment steel locker designed for offices, factories, and gyms, featuring individual lockable sections and ventilation openings for personal storage.', 'A multi-compartment steel locker designed for offices, factories, and gyms, featuring individual lockable sections and ventilation openings for personal storage.', 21000, 17499, 'WV-703', 50, 'active', false, 'Industrial', 4.8, 28, '[{"label":"Doors","value":"6 Individual Lockable Compartments"},{"label":"Ventilation","value":"Louver Air Vents on Each Door"}]'::jsonb, '["Industrial"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (704, 8, 5, 'Professional 4-Drawer Steel Filing Cabinet', 'professional-4-drawer-steel-filing-cabinet-704', 'A vertical steel filing cabinet with four spacious drawers, designed to organize A4 and legal-size documents with convenient access and an anti-tilt mechanism.', 'A vertical steel filing cabinet with four spacious drawers, designed to organize A4 and legal-size documents with convenient access and an anti-tilt mechanism.', 14500, 11499, 'WV-704', 50, 'active', false, NULL, 4.7, 16, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (705, 8, 3, 'Classic Two-Door Steel Almirah', 'classic-two-door-steel-almirah-705', 'A sturdy two-door steel almirah with a secure locking system and durable powder-coated finish, ideal for organized storage at home or in the office.', 'A sturdy two-door steel almirah with a secure locking system and durable powder-coated finish, ideal for organized storage at home or in the office.', 19999, 16499, 'WV-705', 50, 'active', false, NULL, 4.8, 29, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (706, 8, 3, 'Spacious Three-Door Steel Wardrobe', 'spacious-three-door-steel-wardrobe-706', 'A spacious three-door steel wardrobe designed for organized storage, with dedicated hanging space and shelving for clothing and everyday essentials.', 'A spacious three-door steel wardrobe designed for organized storage, with dedicated hanging space and shelving for clothing and everyday essentials.', 24500, 19999, 'WV-706', 50, 'active', false, 'Spacious', 4.9, 38, '[]'::jsonb, '["Spacious"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (708, 8, 4, 'Heavy-Duty Three-Door Steel Storage Cabinet', 'heavy-duty-three-door-steel-storage-cabinet-708', 'A robust three-door steel cabinet designed for workshops and commercial spaces, offering organized storage with reinforced shelves and secure locking.', 'A robust three-door steel cabinet designed for workshops and commercial spaces, offering organized storage with reinforced shelves and secure locking.', 22000, 17999, 'WV-708', 50, 'active', false, 'Workshop', 4.8, 22, '[]'::jsonb, '["Workshop"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (709, 8, 7, 'Steel Library Cupboard with Glass Doors', 'steel-library-cupboard-with-glass-doors-709', 'A durable steel library cupboard with transparent glass doors and multiple shelves, ideal for neatly storing and displaying books, files, and reference materials in libraries, schools, and offices.', 'A durable steel library cupboard with transparent glass doors and multiple shelves, ideal for neatly storing and displaying books, files, and reference materials in libraries, schools, and offices.', 18500, 14999, 'WV-709', 50, 'active', false, NULL, 4.8, 24, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (710, 8, 7, 'Double-Door Steel Bookcase with Glass Panels', 'double-door-steel-bookcase-with-glass-panels-710', 'A spacious steel bookcase featuring full-height glass-panel doors and multiple shelves, designed to keep books, documents, and records organized and protected.', 'A spacious steel bookcase featuring full-height glass-panel doors and multiple shelves, designed to keep books, documents, and records organized and protected.', 21000, 16999, 'WV-710', 50, 'active', false, NULL, 4.9, 29, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (501, 19, 60, ' Modern Minimalist Metal Planter', 'modern-minimalist-metal-planter-501', ' Enhance your garden or balcony with this elegant metal planter, designed to bring a clean and modern touch to your space.', ' Enhance your garden or balcony with this elegant metal planter, designed to bring a clean and modern touch to your space.', 2499, NULL, 'WV-501', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (509, 19, 60, 'Contemporary Stand Metal Planter', 'contemporary-stand-metal-planter-509', ' A stylish planter with a sleek stand design, perfect for displaying indoor plants and adding a sophisticated look to your interiors.', ' A stylish planter with a sleek stand design, perfect for displaying indoor plants and adding a sophisticated look to your interiors.', 2699, NULL, 'WV-509', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (510, 19, 60, 'Premium Geometric Metal Planter', 'premium-geometric-metal-planter-510', ' Featuring a modern geometric stand, this metal planter adds a refined decorative touch to living spaces, balconies and patios.', ' Featuring a modern geometric stand, this metal planter adds a refined decorative touch to living spaces, balconies and patios.', 2899, NULL, 'WV-510', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (511, 19, 60, 'Elegant Gold-Finish Planter Stand', 'elegant-gold-finish-planter-stand-511', ' Elevate your décor with this elegant gold-finish planter stand, ideal for showcasing greenery in contemporary homes and stylish outdoor spaces.', ' Elevate your décor with this elegant gold-finish planter stand, ideal for showcasing greenery in contemporary homes and stylish outdoor spaces.', 2299, NULL, 'WV-511', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (512, 19, 60, 'Luxury Gold Metal Planter Set', 'luxury-gold-metal-planter-set-512', ' Create a beautiful display with this gold-finish planter set, combining decorative elegance and greenery to complement modern interiors.', ' Create a beautiful display with this gold-finish planter set, combining decorative elegance and greenery to complement modern interiors.', 3199, NULL, 'WV-512', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (502, 19, 50, 'Stainless Steel Utility Table', 'stainless-steel-utility-table-502', 'A sleek and durable stainless steel utility table, ideal for kitchens, workspaces and everyday commercial use.', 'A sleek and durable stainless steel utility table, ideal for kitchens, workspaces and everyday commercial use.', 7499, NULL, 'WV-502', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (513, 19, 50, 'Heavy-Duty Stainless Steel Table', 'heavy-duty-stainless-steel-table-513', 'Designed for durability and everyday performance, this sturdy metal table is suitable for commercial workspaces and utility areas.', 'Designed for durability and everyday performance, this sturdy metal table is suitable for commercial workspaces and utility areas.', 7999, NULL, 'WV-513', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (514, 19, 50, 'Industrial Metal Frame Table', 'industrial-metal-frame-table-514', 'Featuring a strong geometric metal frame, this versatile table is ideal for outdoor settings, workshops and customized furniture applications.', 'Featuring a strong geometric metal frame, this versatile table is ideal for outdoor settings, workshops and customized furniture applications.', 8499, NULL, 'WV-514', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (503, 19, 62, 'Premium Outdoor Lounge Seating', 'premium-outdoor-lounge-seating-503', 'Create a relaxing outdoor retreat with this elegant lounge seating set, perfect for garden patios, balconies and outdoor gatherings.', 'Create a relaxing outdoor retreat with this elegant lounge seating set, perfect for garden patios, balconies and outdoor gatherings.', 3999, NULL, 'WV-503', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (515, 19, 62, 'Classic Wooden Folding Chair', 'classic-wooden-folding-chair-515', 'A timeless wooden folding chair designed for comfortable outdoor seating, ideal for gardens, patios and compact balcony spaces.', 'A timeless wooden folding chair designed for comfortable outdoor seating, ideal for gardens, patios and compact balcony spaces.', 4299, NULL, 'WV-515', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (516, 19, 62, 'Elegant Wooden Armrest Chair', 'elegant-wooden-armrest-chair-516', 'Featuring a warm wooden finish and supportive armrests, this chair adds natural charm to gardens, patios and outdoor seating areas.', 'Featuring a warm wooden finish and supportive armrests, this chair adds natural charm to gardens, patios and outdoor seating areas.', 4499, NULL, 'WV-516', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (517, 19, 62, 'Modern Woven Garden Chair Set', 'modern-woven-garden-chair-set-517', 'Enhance your outdoor dining experience with stylish woven chairs and a coordinated table, perfect for balconies, patios and garden gatherings.', 'Enhance your outdoor dining experience with stylish woven chairs and a coordinated table, perfect for balconies, patios and garden gatherings.', 4799, NULL, 'WV-517', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (504, 19, 63, 'Heavy-Duty Black Steel Storage Rack', 'heavy-duty-black-steel-storage-rack-504', 'Maximize your storage space with this sturdy black steel rack, featuring multiple shelves for organizing tools, equipment and everyday essentials.', 'Maximize your storage space with this sturdy black steel rack, featuring multiple shelves for organizing tools, equipment and everyday essentials.', 12999, NULL, 'WV-504', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (518, 19, 63, 'Multi-Tier Metal Storage Rack', 'multi-tier-metal-storage-rack-518', 'A versatile multi-tier metal rack designed for efficient storage and easy organization in warehouses, workshops, garages and utility spaces.', 'A versatile multi-tier metal rack designed for efficient storage and easy organization in warehouses, workshops, garages and utility spaces.', 13999, NULL, 'WV-518', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (519, 19, 63, 'Compact Industrial Steel Shelf', 'compact-industrial-steel-shelf-519', 'Featuring a space-saving design and a strong metal frame, this compact shelving unit is ideal for organizing supplies and accessories in homes or workspaces.', 'Featuring a space-saving design and a strong metal frame, this compact shelving unit is ideal for organizing supplies and accessories in homes or workspaces.', 14999, NULL, 'WV-519', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (506, 19, 65, 'Multi-Tier Metal Plant Stand', 'multi-tier-metal-plant-stand-506', 'Organize and display your favourite plants with this elegant multi-tier metal stand, perfect for living rooms, balconies and indoor gardens.', 'Organize and display your favourite plants with this elegant multi-tier metal stand, perfect for living rooms, balconies and indoor gardens.', 2999, NULL, 'WV-506', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (520, 19, 65, 'Modern Slatted Planter Bench', 'modern-slatted-planter-bench-520', 'Featuring a sleek slatted design, this versatile planter stand offers a stylish way to arrange potted plants in gardens, patios and outdoor spaces.', 'Featuring a sleek slatted design, this versatile planter stand offers a stylish way to arrange potted plants in gardens, patios and outdoor spaces.', 3299, NULL, 'WV-520', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (521, 19, 65, 'Foldable Metal Planter Stand', 'foldable-metal-planter-stand-521', 'A space-efficient metal plant stand with a foldable-style structure, designed to display plants neatly on balconies, patios and compact outdoor areas.', 'A space-efficient metal plant stand with a foldable-style structure, designed to display plants neatly on balconies, patios and compact outdoor areas.', 3499, NULL, 'WV-521', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (522, 19, 65, 'Geometric Multi-Level Plant Stand', 'geometric-multi-level-plant-stand-522', 'Showcase your greenery with this contemporary multi-level metal stand, featuring a geometric design that adds visual interest to gardens and balconies.', 'Showcase your greenery with this contemporary multi-level metal stand, featuring a geometric design that adds visual interest to gardens and balconies.', 3799, NULL, 'WV-522', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (507, 19, 66, 'Wooden Slat Metal Plant Rack', 'wooden-slat-metal-plant-rack-507', 'Combine style and functionality with this multi-tier plant rack featuring wooden slats and a sturdy metal frame, ideal for balconies, patios and garden spaces.', 'Combine style and functionality with this multi-tier plant rack featuring wooden slats and a sturdy metal frame, ideal for balconies, patios and garden spaces.', 3699, NULL, 'WV-507', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (523, 19, 66, 'Corner Metal Planter Rack', 'corner-metal-planter-rack-523', 'Make the most of unused corners with this space-saving metal planter rack, designed to display potted plants neatly on balconies and outdoor areas.', 'Make the most of unused corners with this space-saving metal planter rack, designed to display potted plants neatly on balconies and outdoor areas.', 3999, NULL, 'WV-523', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (524, 19, 66, 'Heavy-Duty Multi-Level Plant Rack', 'heavy-duty-multi-level-plant-rack-524', 'Organize your plants with this spacious multi-level metal rack, offering a practical display solution for gardens, patios and outdoor spaces.', 'Organize your plants with this spacious multi-level metal rack, offering a practical display solution for gardens, patios and outdoor spaces.', 4299, NULL, 'WV-524', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (508, 19, 67, 'Rectangular Metal Plant Trolley', 'rectangular-metal-plant-trolley-508', 'Move your potted plants effortlessly with this rectangular metal trolley, featuring a sturdy frame and smooth-rolling wheels for convenient plant placement.', 'Move your potted plants effortlessly with this rectangular metal trolley, featuring a sturdy frame and smooth-rolling wheels for convenient plant placement.', 1499, NULL, 'WV-508', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (525, 19, 67, 'Round Metal Plant Caddy', 'round-metal-plant-caddy-525', 'Designed for convenient plant movement, this round metal trolley provides a practical base for moving and repositioning planters with ease.', 'Designed for convenient plant movement, this round metal trolley provides a practical base for moving and repositioning planters with ease.', 1699, NULL, 'WV-525', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (526, 19, 67, 'Heavy-Duty Round Planter Trolley', 'heavy-duty-round-planter-trolley-526', 'A practical round planter trolley with caster wheels, ideal for moving large pots and keeping your plants easy to access and reposition.', 'A practical round planter trolley with caster wheels, ideal for moving large pots and keeping your plants easy to access and reposition.', 1799, NULL, 'WV-526', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (527, 19, 67, 'Square Wheeled Plant Stand', 'square-wheeled-plant-stand-527', 'Keep your plants mobile with this square metal trolley, designed to support convenient movement and flexible placement in gardens, balconies and patios.', 'Keep your plants mobile with this square metal trolley, designed to support convenient movement and flexible placement in gardens, balconies and patios.', 1899, NULL, 'WV-527', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (528, 19, 67, 'Round Metal Planter Dolly', 'round-metal-planter-dolly-528', 'A compact round metal plant dolly designed to make repositioning potted plants simple and convenient in indoor and outdoor spaces.', 'A compact round metal plant dolly designed to make repositioning potted plants simple and convenient in indoor and outdoor spaces.', 1999, NULL, 'WV-528', 50, 'active', false, NULL, NULL, 0, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (601, 15, 68, 'Commercial Bunk Bed — Heavy Duty Double Decker', 'commercial-bunk-bed-heavy-duty-double-decker-601', 'A heavy-duty steel bunk bed designed for hostels, PG accommodations, dormitories, and commercial spaces. Its space-saving double-decker design makes it suitable for everyday use.', 'A heavy-duty steel bunk bed designed for hostels, PG accommodations, dormitories, and commercial spaces. Its space-saving double-decker design makes it suitable for everyday use.', 17500, 13999, 'WV-601', 50, 'active', false, 'Heavy Duty', 4.8, 31, '[]'::jsonb, '["Heavy Duty"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (605, 15, 68, 'Commercial Bunk Bed — Steel Frame Design', 'commercial-bunk-bed-steel-frame-design-605', 'A practical commercial bunk bed featuring a sturdy steel-frame design. Ideal for accommodation facilities that need durable, space-efficient sleeping arrangements.', 'A practical commercial bunk bed featuring a sturdy steel-frame design. Ideal for accommodation facilities that need durable, space-efficient sleeping arrangements.', 18000, 14999, 'WV-605', 50, 'active', false, 'Commercial', 4.7, 24, '[]'::jsonb, '["Commercial"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (602, 15, 69, 'Home Bunk Bed — Stylish Steel Double Decker', 'home-bunk-bed-stylish-steel-double-decker-602', 'A stylish steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a practical solution for families while maintaining a neat, modern look.', 'A stylish steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a practical solution for families while maintaining a neat, modern look.', 14000, 11499, 'WV-602', 50, 'active', false, 'Family Favourite', 4.7, 22, '[]'::jsonb, '["Family Favourite"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (604, 15, 71, 'Hostel Bunk Bed — Institutional Grade Steel', 'hostel-bunk-bed-institutional-grade-steel-604', 'A robust steel bunk bed designed for hostels, schools, training centres, and dormitories. Its double-decker structure helps maximise available floor space.', 'A robust steel bunk bed designed for hostels, schools, training centres, and dormitories. Its double-decker structure helps maximise available floor space.', 19000, 15499, 'WV-604', 50, 'active', false, 'Institutional', 4.8, 45, '[]'::jsonb, '["Institutional"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (606, 15, 71, 'Hostel Bunk Bed — Space Saving Design', 'hostel-bunk-bed-space-saving-design-606', 'A space-efficient bunk bed for shared accommodation and hostel rooms. Designed to provide two sleeping levels while making better use of limited room space.', 'A space-efficient bunk bed for shared accommodation and hostel rooms. Designed to provide two sleeping levels while making better use of limited room space.', 17500, 14499, 'WV-606', 50, 'active', false, 'Space Saver', 4.7, 28, '[]'::jsonb, '["Space Saver"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (603, 15, 70, 'Kids Bunk Bed — Safe & Colorful Design', 'kids-bunk-bed-safe-colorful-design-603', 'A space-saving bunk bed designed for children''s bedrooms. Its double-decker layout provides a practical sleeping arrangement for shared rooms.', 'A space-saving bunk bed designed for children''s bedrooms. Its double-decker layout provides a practical sleeping arrangement for shared rooms.', 12500, 9999, 'WV-603', 50, 'active', false, 'Kids Special', 4.9, 38, '[]'::jsonb, '["Kids Special"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (607, 15, 70, 'Kids Bunk Bed — Modern Bedroom Style', 'kids-bunk-bed-modern-bedroom-style-607', 'A modern bunk bed that combines a space-saving structure with a stylish look for children''s bedrooms and shared sleeping spaces.', 'A modern bunk bed that combines a space-saving structure with a stylish look for children''s bedrooms and shared sleeping spaces.', 13500, 10999, 'WV-607', 50, 'active', false, 'Modern Design', 4.8, 26, '[]'::jsonb, '["Modern Design"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (608, 15, 70, 'Kids Bunk Bed — Compact Double Decker', 'kids-bunk-bed-compact-double-decker-608', 'A compact double-decker bunk bed designed to make efficient use of bedroom space while providing a convenient sleeping arrangement for children.', 'A compact double-decker bunk bed designed to make efficient use of bedroom space while providing a convenient sleeping arrangement for children.', 13000, 10499, 'WV-608', 50, 'active', false, 'Compact', 4.7, 21, '[]'::jsonb, '["Compact"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (609, 15, 70, 'Kids Bunk Bed — Contemporary Design', 'kids-bunk-bed-contemporary-design-609', 'A contemporary bunk bed suitable for children''s rooms and shared bedrooms. Its vertical sleeping arrangement helps create more usable space in the room.', 'A contemporary bunk bed suitable for children''s rooms and shared bedrooms. Its vertical sleeping arrangement helps create more usable space in the room.', 14500, 11999, 'WV-609', 50, 'active', true, 'Popular', 4.8, 29, '[]'::jsonb, '["Popular"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

INSERT INTO products (id, category_id, sub_category_id, name, slug, description, short_description, price, discount_price, sku, stock_quantity, status, is_featured, badge, catalog_rating, catalog_rating_count, specifications, highlights, info_sections)
VALUES (610, 15, 69, 'Home Bunk Bed — Modern Steel Double Decker', 'home-bunk-bed-modern-steel-double-decker-610', 'A modern steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a comfortable and practical sleeping arrangement while keeping the room organised.', 'A modern steel bunk bed designed for home bedrooms and shared sleeping spaces. Its space-saving double-decker structure offers a comfortable and practical sleeping arrangement while keeping the room organised.', 15000, 12499, 'WV-610', 50, 'active', false, 'Modern Design', 4.8, 25, '[]'::jsonb, '["Modern Design"]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, sub_category_id = EXCLUDED.sub_category_id, name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, short_description = EXCLUDED.short_description, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price, sku = EXCLUDED.sku, is_featured = EXCLUDED.is_featured, badge = EXCLUDED.badge, catalog_rating = EXCLUDED.catalog_rating, catalog_rating_count = EXCLUDED.catalog_rating_count, specifications = EXCLUDED.specifications, highlights = EXCLUDED.highlights;

-- Keep the main image in the primary slot and add every source gallery image.
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/employeetable1.webp', alt_text = 'Employee Work Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 101 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 101 AND image_url = '/images-webp/employeetable1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (101, '/images-webp/employeetable1.webp', 'Employee Work Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/employeetable2.webp', alt_text = 'Compact Employee Office Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 111 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 111 AND image_url = '/images-webp/employeetable2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (111, '/images-webp/employeetable2.webp', 'Compact Employee Office Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/employeetable3.webp', alt_text = 'Classic Wooden Employee Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 112 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 112 AND image_url = '/images-webp/employeetable3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (112, '/images-webp/employeetable3.webp', 'Classic Wooden Employee Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/employeetable4.webp', alt_text = 'Corporate Employee Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 113 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 113 AND image_url = '/images-webp/employeetable4.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (113, '/images-webp/employeetable4.webp', 'Corporate Employee Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/employeetable5.webp', alt_text = 'Contemporary Employee Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 114 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 114 AND image_url = '/images-webp/employeetable5.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (114, '/images-webp/employeetable5.webp', 'Contemporary Employee Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/bosstable1.webp', alt_text = 'Executive Office Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 102 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 102 AND image_url = '/images-webp/bosstable1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (102, '/images-webp/bosstable1.webp', 'Executive Office Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/bosstable2.webp', alt_text = 'Modern Executive Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 115 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 115 AND image_url = '/images-webp/bosstable2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (115, '/images-webp/bosstable2.webp', 'Modern Executive Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/bosstable3.webp', alt_text = 'Leadership Office Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 116 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 116 AND image_url = '/images-webp/bosstable3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (116, '/images-webp/bosstable3.webp', 'Leadership Office Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/workstation1.webp', alt_text = 'Modular Office Workstation', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 103 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 103 AND image_url = '/images-webp/workstation1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (103, '/images-webp/workstation1.webp', 'Modular Office Workstation', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/workstation2.webp', alt_text = 'Organized Staff Office Workstation', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 119 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 119 AND image_url = '/images-webp/workstation2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (119, '/images-webp/workstation2.webp', 'Organized Staff Office Workstation', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/workstation3.webp', alt_text = 'Space-Saving Modular Workstation', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 120 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 120 AND image_url = '/images-webp/workstation3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (120, '/images-webp/workstation3.webp', 'Space-Saving Modular Workstation', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/conferencetable1.webp', alt_text = 'Corporate Conference Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 121 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 121 AND image_url = '/images-webp/conferencetable1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (121, '/images-webp/conferencetable1.webp', 'Corporate Conference Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/conferencetable2.webp', alt_text = 'Modern Boardroom Discussion Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 122 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 122 AND image_url = '/images-webp/conferencetable2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (122, '/images-webp/conferencetable2.webp', 'Modern Boardroom Discussion Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/conferencetable3.webp', alt_text = 'Team Meeting Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 123 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 123 AND image_url = '/images-webp/conferencetable3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (123, '/images-webp/conferencetable3.webp', 'Team Meeting Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/woodenpedestial1.webp', alt_text = 'Wooden Office Storage Pedestal', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 104 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 104 AND image_url = '/images-webp/woodenpedestial1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (104, '/images-webp/woodenpedestial1.webp', 'Wooden Office Storage Pedestal', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/woodenpedestial2.webp', alt_text = 'Compact Wooden Office Pedestal', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 124 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 124 AND image_url = '/images-webp/woodenpedestial2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (124, '/images-webp/woodenpedestial2.webp', 'Compact Wooden Office Pedestal', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/receptiontable1.webp', alt_text = 'Premium Front Office Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 105 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 105 AND image_url = '/images-webp/receptiontable1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (105, '/images-webp/receptiontable1.webp', 'Premium Front Office Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/receptiontable2.webp', alt_text = 'Contemporary Reception Counter', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 117 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 117 AND image_url = '/images-webp/receptiontable2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (117, '/images-webp/receptiontable2.webp', 'Contemporary Reception Counter', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/receptiontable3.webp', alt_text = 'Corporate  Reception Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 118 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 118 AND image_url = '/images-webp/receptiontable3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (118, '/images-webp/receptiontable3.webp', 'Corporate  Reception Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/steeltable1.webp', alt_text = 'Heavy-Duty Steel Office Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 107 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 107 AND image_url = '/images-webp/steeltable1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (107, '/images-webp/steeltable1.webp', 'Heavy-Duty Steel Office Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/steeltable2.webp', alt_text = 'Functional Steel Work Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 131 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 131 AND image_url = '/images-webp/steeltable2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (131, '/images-webp/steeltable2.webp', 'Functional Steel Work Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/stelltable3.webp', alt_text = 'Contemporary Metal Office Desk', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 132 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 132 AND image_url = '/images-webp/stelltable3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (132, '/images-webp/stelltable3.webp', 'Contemporary Metal Office Desk', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/pedestialsteel1.webp', alt_text = 'Steel Mobile Storage Pedestal', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 108 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 108 AND image_url = '/images-webp/pedestialsteel1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (108, '/images-webp/pedestialsteel1.webp', 'Steel Mobile Storage Pedestal', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/pedestialsteel2.webp', alt_text = 'Durable Metal Storage Pedestal', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 125 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 125 AND image_url = '/images-webp/pedestialsteel2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (125, '/images-webp/pedestialsteel2.webp', 'Durable Metal Storage Pedestal', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/pedestialsteel3.webp', alt_text = 'Compact Steel Office Pedestal', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 126 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 126 AND image_url = '/images-webp/pedestialsteel3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (126, '/images-webp/pedestialsteel3.webp', 'Compact Steel Office Pedestal', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/pedestialsteel4.webp', alt_text = 'Professional Metal Storage Unit', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 127 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 127 AND image_url = '/images-webp/pedestialsteel4.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (127, '/images-webp/pedestialsteel4.webp', 'Professional Metal Storage Unit', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/metaltable.webp', alt_text = 'Metal Utility Work Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 109 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 109 AND image_url = '/images-webp/metaltable.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (109, '/images-webp/metaltable.webp', 'Metal Utility Work Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/steeltable1.webp', alt_text = 'Steel Utility Office Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 128 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 128 AND image_url = '/images-webp/steeltable1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (128, '/images-webp/steeltable1.webp', 'Steel Utility Office Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/steeltable2.webp', alt_text = 'Modern Steel Work Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 129 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 129 AND image_url = '/images-webp/steeltable2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (129, '/images-webp/steeltable2.webp', 'Modern Steel Work Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/stelltable3.webp', alt_text = 'Industrial Metal Utility Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 130 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 130 AND image_url = '/images-webp/stelltable3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (130, '/images-webp/stelltable3.webp', 'Industrial Metal Utility Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/cupboard1.webp', alt_text = 'Prime Steel Office Storewell Cupboard - view 1', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 110 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 110 AND image_url = '/images-webp/cupboard1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (110, '/images-webp/cupboard1.webp', 'Prime Steel Office Storewell Cupboard - view 1', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 110 AND image_url = '/images-webp/cupboard2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (110, '/images-webp/cupboard2.webp', 'Prime Steel Office Storewell Cupboard - view 2', 1, false);
  END IF;
END $$;
DO $$ BEGIN
  
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 110 AND image_url = '/images-webp/cupboard5.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (110, '/images-webp/cupboard5.webp', 'Prime Steel Office Storewell Cupboard - view 3', 2, false);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', alt_text = 'Luxe 3-Seater Velvet Living Room Sofa', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 401 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 401 AND image_url = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (401, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', 'Luxe 3-Seater Velvet Living Room Sofa', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/officechair1.webp', alt_text = 'AeroPro Ergonomic High-Back Office Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 201 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 201 AND image_url = '/images-webp/officechair1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (201, '/images-webp/officechair1.webp', 'AeroPro Ergonomic High-Back Office Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/bosschair1.webp', alt_text = 'Presidential Bonded Leather Boss Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 202 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 202 AND image_url = '/images-webp/bosschair1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (202, '/images-webp/bosschair1.webp', 'Presidential Bonded Leather Boss Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/chair1.webp', alt_text = 'Comfort Flex High-Density Office Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 203 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 203 AND image_url = '/images-webp/chair1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (203, '/images-webp/chair1.webp', 'Comfort Flex High-Density Office Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/stool1.webp', alt_text = 'Padded Swivel Lab & Workshop Stool', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 204 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 204 AND image_url = '/images-webp/stool1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (204, '/images-webp/stool1.webp', 'Padded Swivel Lab & Workshop Stool', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/officesopa1.webp', alt_text = 'Executive 3-Seater Leatherette Office Sofa', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 205 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 205 AND image_url = '/images-webp/officesopa1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (205, '/images-webp/officesopa1.webp', 'Executive 3-Seater Leatherette Office Sofa', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/officechair2.webp', alt_text = 'ErgoComfort Adjustable Office Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 206 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 206 AND image_url = '/images-webp/officechair2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (206, '/images-webp/officechair2.webp', 'ErgoComfort Adjustable Office Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/officechair3.webp', alt_text = 'Modern Mesh Task Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 207 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 207 AND image_url = '/images-webp/officechair3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (207, '/images-webp/officechair3.webp', 'Modern Mesh Task Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/officechair4.webp', alt_text = 'Comfort Support Office Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 208 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 208 AND image_url = '/images-webp/officechair4.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (208, '/images-webp/officechair4.webp', 'Comfort Support Office Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/officechair5.webp', alt_text = 'Executive High-Back Office Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 209 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 209 AND image_url = '/images-webp/officechair5.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (209, '/images-webp/officechair5.webp', 'Executive High-Back Office Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/bosschair2.webp', alt_text = 'Premium Executive Boss Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 210 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 210 AND image_url = '/images-webp/bosschair2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (210, '/images-webp/bosschair2.webp', 'Premium Executive Boss Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/bosschair3.webp', alt_text = 'Classic Leatherette Boss Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 211 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 211 AND image_url = '/images-webp/bosschair3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (211, '/images-webp/bosschair3.webp', 'Classic Leatherette Boss Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/bosschair4.webp', alt_text = 'Modern High-Back Manager Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 212 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 212 AND image_url = '/images-webp/bosschair4.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (212, '/images-webp/bosschair4.webp', 'Modern High-Back Manager Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/chair2.webp', alt_text = 'Classic Cushioned Office Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 213 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 213 AND image_url = '/images-webp/chair2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (213, '/images-webp/chair2.webp', 'Classic Cushioned Office Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/chair3.webp', alt_text = 'Modern Visitor Seating Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 214 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 214 AND image_url = '/images-webp/chair3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (214, '/images-webp/chair3.webp', 'Modern Visitor Seating Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/stool2.webp', alt_text = 'Compact Round Cushioned Stool', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 216 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 216 AND image_url = '/images-webp/stool2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (216, '/images-webp/stool2.webp', 'Compact Round Cushioned Stool', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/stool3.webp', alt_text = 'Height-Adjustable Utility Stool', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 217 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 217 AND image_url = '/images-webp/stool3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (217, '/images-webp/stool3.webp', 'Height-Adjustable Utility Stool', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/stool4.webp', alt_text = 'Modern Multipurpose Seating Stool', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 218 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 218 AND image_url = '/images-webp/stool4.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (218, '/images-webp/stool4.webp', 'Modern Multipurpose Seating Stool', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/officesopa4.webp', alt_text = 'Modern Office Sofa', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 219 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 219 AND image_url = '/images-webp/officesopa4.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (219, '/images-webp/officesopa4.webp', 'Modern Office Sofa', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/officesopa2.webp', alt_text = 'Premium Executive Waiting Sofa', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 220 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 220 AND image_url = '/images-webp/officesopa2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (220, '/images-webp/officesopa2.webp', 'Premium Executive Waiting Sofa', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/officesopa3.webp', alt_text = 'Contemporary Office Lounge Sofa', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 221 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 221 AND image_url = '/images-webp/officesopa3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (221, '/images-webp/officesopa3.webp', 'Contemporary Office Lounge Sofa', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/cupboard1.webp', alt_text = 'Premium Steel Storewell with Security Locker', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 701 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 701 AND image_url = '/images-webp/cupboard1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (701, '/images-webp/cupboard1.webp', 'Premium Steel Storewell with Security Locker', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/cupboard2.webp', alt_text = 'Heavy-Duty Steel Storewell with Hanging Space', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 702 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 702 AND image_url = '/images-webp/cupboard2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (702, '/images-webp/cupboard2.webp', 'Heavy-Duty Steel Storewell with Hanging Space', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/metal-drawer1.webp', alt_text = 'Industrial Compartment Staff Locker', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 703 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 703 AND image_url = '/images-webp/metal-drawer1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (703, '/images-webp/metal-drawer1.webp', 'Industrial Compartment Staff Locker', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/metal-drawer4.webp', alt_text = 'Professional 4-Drawer Steel Filing Cabinet', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 704 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 704 AND image_url = '/images-webp/metal-drawer4.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (704, '/images-webp/metal-drawer4.webp', 'Professional 4-Drawer Steel Filing Cabinet', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/cupboard4.webp', alt_text = 'Classic Two-Door Steel Almirah', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 705 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 705 AND image_url = '/images-webp/cupboard4.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (705, '/images-webp/cupboard4.webp', 'Classic Two-Door Steel Almirah', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/cupboard3.webp', alt_text = 'Spacious Three-Door Steel Wardrobe', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 706 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 706 AND image_url = '/images-webp/cupboard3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (706, '/images-webp/cupboard3.webp', 'Spacious Three-Door Steel Wardrobe', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/cupboard5.webp', alt_text = 'Heavy-Duty Three-Door Steel Storage Cabinet', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 708 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 708 AND image_url = '/images-webp/cupboard5.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (708, '/images-webp/cupboard5.webp', 'Heavy-Duty Three-Door Steel Storage Cabinet', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/library1.webp', alt_text = 'Steel Library Cupboard with Glass Doors', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 709 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 709 AND image_url = '/images-webp/library1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (709, '/images-webp/library1.webp', 'Steel Library Cupboard with Glass Doors', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/library2.webp', alt_text = 'Double-Door Steel Bookcase with Glass Panels', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 710 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 710 AND image_url = '/images-webp/library2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (710, '/images-webp/library2.webp', 'Double-Door Steel Bookcase with Glass Panels', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/metalplanter1.jpeg', alt_text = ' Modern Minimalist Metal Planter', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 501 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 501 AND image_url = '/metalplanter1.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (501, '/metalplanter1.jpeg', ' Modern Minimalist Metal Planter', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/metalplanter2.jpeg', alt_text = 'Contemporary Stand Metal Planter', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 509 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 509 AND image_url = '/metalplanter2.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (509, '/metalplanter2.jpeg', 'Contemporary Stand Metal Planter', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/metalplanter3.jpeg', alt_text = 'Premium Geometric Metal Planter', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 510 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 510 AND image_url = '/metalplanter3.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (510, '/metalplanter3.jpeg', 'Premium Geometric Metal Planter', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/metalplanter4.jpeg', alt_text = 'Elegant Gold-Finish Planter Stand', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 511 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 511 AND image_url = '/metalplanter4.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (511, '/metalplanter4.jpeg', 'Elegant Gold-Finish Planter Stand', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/metalplanter5.jpeg', alt_text = 'Luxury Gold Metal Planter Set', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 512 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 512 AND image_url = '/metalplanter5.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (512, '/metalplanter5.jpeg', 'Luxury Gold Metal Planter Set', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/mtable1.jpeg', alt_text = 'Stainless Steel Utility Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 502 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 502 AND image_url = '/mtable1.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (502, '/mtable1.jpeg', 'Stainless Steel Utility Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/mtable2.jpeg', alt_text = 'Heavy-Duty Stainless Steel Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 513 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 513 AND image_url = '/mtable2.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (513, '/mtable2.jpeg', 'Heavy-Duty Stainless Steel Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/mtable3.jpeg', alt_text = 'Industrial Metal Frame Table', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 514 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 514 AND image_url = '/mtable3.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (514, '/mtable3.jpeg', 'Industrial Metal Frame Table', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/gchair1.jpeg', alt_text = 'Premium Outdoor Lounge Seating', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 503 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 503 AND image_url = '/gchair1.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (503, '/gchair1.jpeg', 'Premium Outdoor Lounge Seating', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/gchair2.jpeg', alt_text = 'Classic Wooden Folding Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 515 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 515 AND image_url = '/gchair2.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (515, '/gchair2.jpeg', 'Classic Wooden Folding Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/gchair3.jpeg', alt_text = 'Elegant Wooden Armrest Chair', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 516 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 516 AND image_url = '/gchair3.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (516, '/gchair3.jpeg', 'Elegant Wooden Armrest Chair', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/gchair4.jpeg', alt_text = 'Modern Woven Garden Chair Set', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 517 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 517 AND image_url = '/gchair4.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (517, '/gchair4.jpeg', 'Modern Woven Garden Chair Set', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/ssunit1.jpeg', alt_text = 'Heavy-Duty Black Steel Storage Rack', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 504 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 504 AND image_url = '/ssunit1.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (504, '/ssunit1.jpeg', 'Heavy-Duty Black Steel Storage Rack', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/ssunit2.jpeg', alt_text = 'Multi-Tier Metal Storage Rack', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 518 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 518 AND image_url = '/ssunit2.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (518, '/ssunit2.jpeg', 'Multi-Tier Metal Storage Rack', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/ssunit3.jpeg', alt_text = 'Compact Industrial Steel Shelf', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 519 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 519 AND image_url = '/ssunit3.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (519, '/ssunit3.jpeg', 'Compact Industrial Steel Shelf', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/pstand1.jpeg', alt_text = 'Multi-Tier Metal Plant Stand', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 506 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 506 AND image_url = '/pstand1.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (506, '/pstand1.jpeg', 'Multi-Tier Metal Plant Stand', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/pstand2.jpeg', alt_text = 'Modern Slatted Planter Bench', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 520 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 520 AND image_url = '/pstand2.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (520, '/pstand2.jpeg', 'Modern Slatted Planter Bench', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/pstand3.jpeg', alt_text = 'Foldable Metal Planter Stand', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 521 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 521 AND image_url = '/pstand3.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (521, '/pstand3.jpeg', 'Foldable Metal Planter Stand', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/pstand4.jpeg', alt_text = 'Geometric Multi-Level Plant Stand', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 522 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 522 AND image_url = '/pstand4.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (522, '/pstand4.jpeg', 'Geometric Multi-Level Plant Stand', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/prack1.jpeg', alt_text = 'Wooden Slat Metal Plant Rack', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 507 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 507 AND image_url = '/prack1.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (507, '/prack1.jpeg', 'Wooden Slat Metal Plant Rack', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/prack2.jpeg', alt_text = 'Corner Metal Planter Rack', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 523 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 523 AND image_url = '/prack2.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (523, '/prack2.jpeg', 'Corner Metal Planter Rack', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/prack3.jpeg', alt_text = 'Heavy-Duty Multi-Level Plant Rack', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 524 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 524 AND image_url = '/prack3.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (524, '/prack3.jpeg', 'Heavy-Duty Multi-Level Plant Rack', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/ptrolly1.jpeg', alt_text = 'Rectangular Metal Plant Trolley', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 508 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 508 AND image_url = '/ptrolly1.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (508, '/ptrolly1.jpeg', 'Rectangular Metal Plant Trolley', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/ptrolly2.jpeg', alt_text = 'Round Metal Plant Caddy', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 525 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 525 AND image_url = '/ptrolly2.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (525, '/ptrolly2.jpeg', 'Round Metal Plant Caddy', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/ptrolly3.jpeg', alt_text = 'Heavy-Duty Round Planter Trolley', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 526 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 526 AND image_url = '/ptrolly3.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (526, '/ptrolly3.jpeg', 'Heavy-Duty Round Planter Trolley', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/ptrolly4.jpeg', alt_text = 'Square Wheeled Plant Stand', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 527 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 527 AND image_url = '/ptrolly4.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (527, '/ptrolly4.jpeg', 'Square Wheeled Plant Stand', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/ptrolly5.jpeg', alt_text = 'Round Metal Planter Dolly', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 528 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 528 AND image_url = '/ptrolly5.jpeg') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (528, '/ptrolly5.jpeg', 'Round Metal Planter Dolly', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/comercialbunk1.webp', alt_text = 'Commercial Bunk Bed — Heavy Duty Double Decker', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 601 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 601 AND image_url = '/images-webp/comercialbunk1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (601, '/images-webp/comercialbunk1.webp', 'Commercial Bunk Bed — Heavy Duty Double Decker', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/commercialbunk2.webp', alt_text = 'Commercial Bunk Bed — Steel Frame Design', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 605 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 605 AND image_url = '/images-webp/commercialbunk2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (605, '/images-webp/commercialbunk2.webp', 'Commercial Bunk Bed — Steel Frame Design', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/homebunk1.webp', alt_text = 'Home Bunk Bed — Stylish Steel Double Decker', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 602 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 602 AND image_url = '/images-webp/homebunk1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (602, '/images-webp/homebunk1.webp', 'Home Bunk Bed — Stylish Steel Double Decker', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/hostelbunk1.webp', alt_text = 'Hostel Bunk Bed — Institutional Grade Steel', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 604 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 604 AND image_url = '/images-webp/hostelbunk1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (604, '/images-webp/hostelbunk1.webp', 'Hostel Bunk Bed — Institutional Grade Steel', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/hostelbunk2.webp', alt_text = 'Hostel Bunk Bed — Space Saving Design', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 606 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 606 AND image_url = '/images-webp/hostelbunk2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (606, '/images-webp/hostelbunk2.webp', 'Hostel Bunk Bed — Space Saving Design', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/kidbunk1.webp', alt_text = 'Kids Bunk Bed — Safe & Colorful Design', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 603 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 603 AND image_url = '/images-webp/kidbunk1.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (603, '/images-webp/kidbunk1.webp', 'Kids Bunk Bed — Safe & Colorful Design', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/kidbunk2.webp', alt_text = 'Kids Bunk Bed — Modern Bedroom Style', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 607 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 607 AND image_url = '/images-webp/kidbunk2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (607, '/images-webp/kidbunk2.webp', 'Kids Bunk Bed — Modern Bedroom Style', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/kidbunk3.webp', alt_text = 'Kids Bunk Bed — Compact Double Decker', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 608 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 608 AND image_url = '/images-webp/kidbunk3.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (608, '/images-webp/kidbunk3.webp', 'Kids Bunk Bed — Compact Double Decker', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/kidbunk4.webp', alt_text = 'Kids Bunk Bed — Contemporary Design', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 609 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 609 AND image_url = '/images-webp/kidbunk4.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (609, '/images-webp/kidbunk4.webp', 'Kids Bunk Bed — Contemporary Design', 0, true);
  END IF;
END $$;
DO $$ BEGIN
  UPDATE product_images SET image_url = '/images-webp/homebunk2.webp', alt_text = 'Home Bunk Bed — Modern Steel Double Decker', display_order = 0, is_primary = TRUE WHERE id = (SELECT id FROM product_images WHERE product_id = 610 AND is_primary = TRUE ORDER BY display_order, id LIMIT 1);
  IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = 610 AND image_url = '/images-webp/homebunk2.webp') THEN
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES (610, '/images-webp/homebunk2.webp', 'Home Bunk Bed — Modern Steel Double Decker', 0, true);
  END IF;
END $$;

-- Preserve the website's size, color and configurable subcategory options in the existing variants table.
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 101, 'Table Size: 3×2 ft', NULL, 5499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 101 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 101, 'Table Size: 5×2 ft', NULL, 8499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 101 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 101, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 5499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 101 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 101, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 5899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 101 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 101, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 6099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 101 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 111, 'Table Size: 3×2 ft', NULL, 5499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 111 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 111, 'Table Size: 5×2 ft', NULL, 8499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 111 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 111, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 5499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 111 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 111, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 5899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 111 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 111, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 6099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 111 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 112, 'Table Size: 3×2 ft', NULL, 5499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 112 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 112, 'Table Size: 5×2 ft', NULL, 8499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 112 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 112, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 5499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 112 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 112, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 5899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 112 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 112, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 6099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 112 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 113, 'Table Size: 3×2 ft', NULL, 5499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 113 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 113, 'Table Size: 5×2 ft', NULL, 8499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 113 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 113, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 5499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 113 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 113, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 5899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 113 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 113, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 6099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 113 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 114, 'Table Size: 3×2 ft', NULL, 5499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 114 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 114, 'Table Size: 5×2 ft', NULL, 8499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 114 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 114, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 5499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 114 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 114, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 5899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 114 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 114, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 6099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 114 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 102, 'Table Size: 3×2 ft', NULL, 24999, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 102 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 102, 'Table Size: 5×2 ft', NULL, 27999, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 102 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 102, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 24999, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 102 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 102, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 25399, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 102 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 102, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 25599, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 102 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 115, 'Table Size: 3×2 ft', NULL, 24999, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 115 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 115, 'Table Size: 5×2 ft', NULL, 27999, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 115 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 115, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 24999, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 115 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 115, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 25399, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 115 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 115, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 25599, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 115 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 116, 'Table Size: 3×2 ft', NULL, 24999, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 116 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 116, 'Table Size: 5×2 ft', NULL, 27999, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 116 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 116, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 24999, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 116 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 116, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 25399, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 116 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 116, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 25599, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 116 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 103, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 38999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 103 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 103, 'Coating Type: Heavy Industrial Matte Finish', NULL, 39499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 103 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 119, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 38999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 119 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 119, 'Coating Type: Heavy Industrial Matte Finish', NULL, 39499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 119 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 120, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 38999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 120 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 120, 'Coating Type: Heavy Industrial Matte Finish', NULL, 39499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 120 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 121, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 19999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 121 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 121, 'Coating Type: Heavy Industrial Matte Finish', NULL, 20499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 121 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 122, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 19999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 122 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 122, 'Coating Type: Heavy Industrial Matte Finish', NULL, 20499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 122 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 123, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 19999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 123 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 123, 'Coating Type: Heavy Industrial Matte Finish', NULL, 20499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 123 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 104, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 4499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 104 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 104, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 104 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 124, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 4499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 124 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 124, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 124 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 105, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 21999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 105 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 105, 'Coating Type: Heavy Industrial Matte Finish', NULL, 22499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 105 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 117, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 21999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 117 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 117, 'Coating Type: Heavy Industrial Matte Finish', NULL, 22499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 117 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 118, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 21999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 118 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 118, 'Coating Type: Heavy Industrial Matte Finish', NULL, 22499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 118 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 107, 'Table Size: 3×2 ft', NULL, 6499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 107 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 107, 'Table Size: 5×2 ft', NULL, 9499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 107 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 107, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 6499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 107 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 107, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 6899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 107 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 107, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 7099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 107 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 131, 'Table Size: 3×2 ft', NULL, 6499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 131 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 131, 'Table Size: 5×2 ft', NULL, 9499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 131 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 131, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 6499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 131 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 131, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 6899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 131 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 131, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 7099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 131 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 132, 'Table Size: 3×2 ft', NULL, 6499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 132 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 132, 'Table Size: 5×2 ft', NULL, 9499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 132 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 132, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 6499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 132 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 132, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 6899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 132 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 132, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 7099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 132 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 108, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 5299, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 108 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 108, 'Coating Type: Heavy Industrial Matte Finish', NULL, 5799, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 108 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 125, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 5299, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 125 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 125, 'Coating Type: Heavy Industrial Matte Finish', NULL, 5799, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 125 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 126, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 5299, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 126 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 126, 'Coating Type: Heavy Industrial Matte Finish', NULL, 5799, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 126 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 127, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 5299, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 127 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 127, 'Coating Type: Heavy Industrial Matte Finish', NULL, 5799, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 127 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 109, 'Table Size: 3×2 ft', NULL, 5999, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 109 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 109, 'Table Size: 5×2 ft', NULL, 8999, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 109 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 109, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 5999, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 109 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 109, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 6399, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 109 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 109, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 6599, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 109 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 128, 'Table Size: 3×2 ft', NULL, 5999, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 128 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 128, 'Table Size: 5×2 ft', NULL, 8999, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 128 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 128, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 5999, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 128 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 128, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 6399, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 128 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 128, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 6599, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 128 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 129, 'Table Size: 3×2 ft', NULL, 5999, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 129 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 129, 'Table Size: 5×2 ft', NULL, 8999, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 129 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 129, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 5999, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 129 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 129, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 6399, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 129 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 129, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 6599, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 129 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 130, 'Table Size: 3×2 ft', NULL, 5999, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 130 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 130, 'Table Size: 5×2 ft', NULL, 8999, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 130 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 130, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 5999, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 130 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 130, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 6399, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 130 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 130, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 6599, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 130 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard1_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard1_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard1_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard1_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard1_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard1_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard1_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard1_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Size: 5.5 ft Compact', NULL, 17499, 50, '{"type":"size","label":"5.5 ft Compact","old_price":20999}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Size: 5.5 ft Compact' AND v.attributes = '{"type":"size","label":"5.5 ft Compact","old_price":20999}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Size: 6.5 ft Standard', NULL, 18999, 50, '{"type":"size","label":"6.5 ft Standard","old_price":22999}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Size: 6.5 ft Standard' AND v.attributes = '{"type":"size","label":"6.5 ft Standard","old_price":22999}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Size / Height: Standard 6.5 ft (78" H x 36" W x 19" D)', NULL, 18999, 50, '{"type":"size","group":"Size / Height","label":"Standard 6.5 ft (78\" H x 36\" W x 19\" D)","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Size / Height: Standard 6.5 ft (78" H x 36" W x 19" D)' AND v.attributes = '{"type":"size","group":"Size / Height","label":"Standard 6.5 ft (78\" H x 36\" W x 19\" D)","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Size / Height: Compact 5.5 ft (66" H x 33" W x 18" D)', NULL, 17499, 50, '{"type":"size","group":"Size / Height","label":"Compact 5.5 ft (66\" H x 33\" W x 18\" D)","price_diff":-1500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Size / Height: Compact 5.5 ft (66" H x 33" W x 18" D)' AND v.attributes = '{"type":"size","group":"Size / Height","label":"Compact 5.5 ft (66\" H x 33\" W x 18\" D)","price_diff":-1500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Size / Height: Jumbo Mega (78" H x 42" W x 21" D)', NULL, 21499, 50, '{"type":"size","group":"Size / Height","label":"Jumbo Mega (78\" H x 42\" W x 21\" D)","price_diff":2500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Size / Height: Jumbo Mega (78" H x 42" W x 21" D)' AND v.attributes = '{"type":"size","group":"Size / Height","label":"Jumbo Mega (78\" H x 42\" W x 21\" D)","price_diff":2500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Internal Configuration: With Inbuilt Safe Locker & Drawers', NULL, 18999, 50, '{"type":"config","group":"Internal Configuration","label":"With Inbuilt Safe Locker & Drawers","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Internal Configuration: With Inbuilt Safe Locker & Drawers' AND v.attributes = '{"type":"config","group":"Internal Configuration","label":"With Inbuilt Safe Locker & Drawers","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Internal Configuration: Full Shelves Only (No Locker)', NULL, 17999, 50, '{"type":"config","group":"Internal Configuration","label":"Full Shelves Only (No Locker)","price_diff":-1000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Internal Configuration: Full Shelves Only (No Locker)' AND v.attributes = '{"type":"config","group":"Internal Configuration","label":"Full Shelves Only (No Locker)","price_diff":-1000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 110, 'Internal Configuration: Wardrobe Hanging Rod + Safe Locker', NULL, 19799, 50, '{"type":"config","group":"Internal Configuration","label":"Wardrobe Hanging Rod + Safe Locker","price_diff":800,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 110 AND v.variant_name = 'Internal Configuration: Wardrobe Hanging Rod + Safe Locker' AND v.attributes = '{"type":"config","group":"Internal Configuration","label":"Wardrobe Hanging Rod + Safe Locker","price_diff":800,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 401, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 32999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 401 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 401, 'Coating Type: Heavy Industrial Matte Finish', NULL, 33499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 401 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 201, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 11999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 201 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 201, 'Coating Type: Heavy Industrial Matte Finish', NULL, 12499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 201 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 202, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 18499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 202 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 202, 'Coating Type: Heavy Industrial Matte Finish', NULL, 18999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 202 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 203, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 6499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 203 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 203, 'Coating Type: Heavy Industrial Matte Finish', NULL, 6999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 203 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 204, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 204 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 204, 'Coating Type: Heavy Industrial Matte Finish', NULL, 3999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 204 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 205, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 24999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 205 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 205, 'Coating Type: Heavy Industrial Matte Finish', NULL, 25499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 205 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 206, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 9999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 206 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 206, 'Coating Type: Heavy Industrial Matte Finish', NULL, 10499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 206 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 207, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 8999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 207 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 207, 'Coating Type: Heavy Industrial Matte Finish', NULL, 9499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 207 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 208, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 8499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 208 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 208, 'Coating Type: Heavy Industrial Matte Finish', NULL, 8999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 208 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 209, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 10999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 209 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 209, 'Coating Type: Heavy Industrial Matte Finish', NULL, 11499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 209 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 210, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 16999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 210 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 210, 'Coating Type: Heavy Industrial Matte Finish', NULL, 17499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 210 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 211, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 15999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 211 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 211, 'Coating Type: Heavy Industrial Matte Finish', NULL, 16499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 211 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 212, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 17999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 212 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 212, 'Coating Type: Heavy Industrial Matte Finish', NULL, 18499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 212 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 213, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 4999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 213 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 213, 'Coating Type: Heavy Industrial Matte Finish', NULL, 5499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 213 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 214, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 214 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 214, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 214 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 216, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 2499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 216 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 216, 'Coating Type: Heavy Industrial Matte Finish', NULL, 2999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 216 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 217, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3299, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 217 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 217, 'Coating Type: Heavy Industrial Matte Finish', NULL, 3799, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 217 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 218, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 1999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 218 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 218, 'Coating Type: Heavy Industrial Matte Finish', NULL, 2499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 218 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 219, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 19999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 219 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 219, 'Coating Type: Heavy Industrial Matte Finish', NULL, 20499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 219 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 220, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 22999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 220 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 220, 'Coating Type: Heavy Industrial Matte Finish', NULL, 23499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 220 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 221, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 26999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 221 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 221, 'Coating Type: Heavy Industrial Matte Finish', NULL, 27499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 221 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard1_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard1_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard1_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard1_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard1_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard1_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard1_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard1_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Size / Height: Standard 6.5 ft (78" H x 36" W x 19" D)', NULL, 18999, 50, '{"type":"size","group":"Size / Height","label":"Standard 6.5 ft (78\" H x 36\" W x 19\" D)","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Size / Height: Standard 6.5 ft (78" H x 36" W x 19" D)' AND v.attributes = '{"type":"size","group":"Size / Height","label":"Standard 6.5 ft (78\" H x 36\" W x 19\" D)","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Size / Height: Compact 5.5 ft (66" H x 33" W x 18" D)', NULL, 17499, 50, '{"type":"size","group":"Size / Height","label":"Compact 5.5 ft (66\" H x 33\" W x 18\" D)","price_diff":-1500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Size / Height: Compact 5.5 ft (66" H x 33" W x 18" D)' AND v.attributes = '{"type":"size","group":"Size / Height","label":"Compact 5.5 ft (66\" H x 33\" W x 18\" D)","price_diff":-1500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Size / Height: Jumbo Mega (78" H x 42" W x 21" D)', NULL, 21499, 50, '{"type":"size","group":"Size / Height","label":"Jumbo Mega (78\" H x 42\" W x 21\" D)","price_diff":2500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Size / Height: Jumbo Mega (78" H x 42" W x 21" D)' AND v.attributes = '{"type":"size","group":"Size / Height","label":"Jumbo Mega (78\" H x 42\" W x 21\" D)","price_diff":2500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Internal Configuration: With Inbuilt Safe Locker & Drawers', NULL, 18999, 50, '{"type":"config","group":"Internal Configuration","label":"With Inbuilt Safe Locker & Drawers","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Internal Configuration: With Inbuilt Safe Locker & Drawers' AND v.attributes = '{"type":"config","group":"Internal Configuration","label":"With Inbuilt Safe Locker & Drawers","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Internal Configuration: Full Shelves Only (No Locker)', NULL, 17999, 50, '{"type":"config","group":"Internal Configuration","label":"Full Shelves Only (No Locker)","price_diff":-1000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Internal Configuration: Full Shelves Only (No Locker)' AND v.attributes = '{"type":"config","group":"Internal Configuration","label":"Full Shelves Only (No Locker)","price_diff":-1000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 701, 'Internal Configuration: Wardrobe Hanging Rod + Safe Locker', NULL, 19799, 50, '{"type":"config","group":"Internal Configuration","label":"Wardrobe Hanging Rod + Safe Locker","price_diff":800,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 701 AND v.variant_name = 'Internal Configuration: Wardrobe Hanging Rod + Safe Locker' AND v.attributes = '{"type":"config","group":"Internal Configuration","label":"Wardrobe Hanging Rod + Safe Locker","price_diff":800,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard2_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard2_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard2_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard2_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard2_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard2_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard2_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard2_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Size / Height: Standard 6.5 ft (78" H x 36" W x 19" D)', NULL, 16499, 50, '{"type":"size","group":"Size / Height","label":"Standard 6.5 ft (78\" H x 36\" W x 19\" D)","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Size / Height: Standard 6.5 ft (78" H x 36" W x 19" D)' AND v.attributes = '{"type":"size","group":"Size / Height","label":"Standard 6.5 ft (78\" H x 36\" W x 19\" D)","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Size / Height: Compact 5.5 ft (66" H x 33" W x 18" D)', NULL, 14999, 50, '{"type":"size","group":"Size / Height","label":"Compact 5.5 ft (66\" H x 33\" W x 18\" D)","price_diff":-1500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Size / Height: Compact 5.5 ft (66" H x 33" W x 18" D)' AND v.attributes = '{"type":"size","group":"Size / Height","label":"Compact 5.5 ft (66\" H x 33\" W x 18\" D)","price_diff":-1500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Size / Height: Jumbo Mega (78" H x 42" W x 21" D)', NULL, 18999, 50, '{"type":"size","group":"Size / Height","label":"Jumbo Mega (78\" H x 42\" W x 21\" D)","price_diff":2500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Size / Height: Jumbo Mega (78" H x 42" W x 21" D)' AND v.attributes = '{"type":"size","group":"Size / Height","label":"Jumbo Mega (78\" H x 42\" W x 21\" D)","price_diff":2500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Internal Configuration: With Inbuilt Safe Locker & Drawers', NULL, 16499, 50, '{"type":"config","group":"Internal Configuration","label":"With Inbuilt Safe Locker & Drawers","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Internal Configuration: With Inbuilt Safe Locker & Drawers' AND v.attributes = '{"type":"config","group":"Internal Configuration","label":"With Inbuilt Safe Locker & Drawers","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Internal Configuration: Full Shelves Only (No Locker)', NULL, 15499, 50, '{"type":"config","group":"Internal Configuration","label":"Full Shelves Only (No Locker)","price_diff":-1000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Internal Configuration: Full Shelves Only (No Locker)' AND v.attributes = '{"type":"config","group":"Internal Configuration","label":"Full Shelves Only (No Locker)","price_diff":-1000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 702, 'Internal Configuration: Wardrobe Hanging Rod + Safe Locker', NULL, 17299, 50, '{"type":"config","group":"Internal Configuration","label":"Wardrobe Hanging Rod + Safe Locker","price_diff":800,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 702 AND v.variant_name = 'Internal Configuration: Wardrobe Hanging Rod + Safe Locker' AND v.attributes = '{"type":"config","group":"Internal Configuration","label":"Wardrobe Hanging Rod + Safe Locker","price_diff":800,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 703, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/metal-drawer1_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 703 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/metal-drawer1_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 703, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/metal-drawer1_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 703 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/metal-drawer1_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 703, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/metal-drawer1_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 703 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/metal-drawer1_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 703, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/metal-drawer1_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 703 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/metal-drawer1_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 703, 'Filing Drawer Setup: 4 Drawers Vertical (Legal/A4)', NULL, 17499, 50, '{"type":"drawers","group":"Filing Drawer Setup","label":"4 Drawers Vertical (Legal/A4)","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 703 AND v.variant_name = 'Filing Drawer Setup: 4 Drawers Vertical (Legal/A4)' AND v.attributes = '{"type":"drawers","group":"Filing Drawer Setup","label":"4 Drawers Vertical (Legal/A4)","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 703, 'Filing Drawer Setup: 3 Drawers Vertical', NULL, 15999, 50, '{"type":"drawers","group":"Filing Drawer Setup","label":"3 Drawers Vertical","price_diff":-1500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 703 AND v.variant_name = 'Filing Drawer Setup: 3 Drawers Vertical' AND v.attributes = '{"type":"drawers","group":"Filing Drawer Setup","label":"3 Drawers Vertical","price_diff":-1500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 703, 'Filing Drawer Setup: 2 Drawers Desk Height', NULL, 14999, 50, '{"type":"drawers","group":"Filing Drawer Setup","label":"2 Drawers Desk Height","price_diff":-2500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 703 AND v.variant_name = 'Filing Drawer Setup: 2 Drawers Desk Height' AND v.attributes = '{"type":"drawers","group":"Filing Drawer Setup","label":"2 Drawers Desk Height","price_diff":-2500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 704, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/metal-drawer4_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 704 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/metal-drawer4_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 704, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/metal-drawer4_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 704 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/metal-drawer4_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 704, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/metal-drawer4_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 704 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/metal-drawer4_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 704, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/metal-drawer4_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 704 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/metal-drawer4_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 704, 'Filing Drawer Setup: 4 Drawers Vertical (Legal/A4)', NULL, 11499, 50, '{"type":"drawers","group":"Filing Drawer Setup","label":"4 Drawers Vertical (Legal/A4)","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 704 AND v.variant_name = 'Filing Drawer Setup: 4 Drawers Vertical (Legal/A4)' AND v.attributes = '{"type":"drawers","group":"Filing Drawer Setup","label":"4 Drawers Vertical (Legal/A4)","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 704, 'Filing Drawer Setup: 3 Drawers Vertical', NULL, 9999, 50, '{"type":"drawers","group":"Filing Drawer Setup","label":"3 Drawers Vertical","price_diff":-1500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 704 AND v.variant_name = 'Filing Drawer Setup: 3 Drawers Vertical' AND v.attributes = '{"type":"drawers","group":"Filing Drawer Setup","label":"3 Drawers Vertical","price_diff":-1500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 704, 'Filing Drawer Setup: 2 Drawers Desk Height', NULL, 8999, 50, '{"type":"drawers","group":"Filing Drawer Setup","label":"2 Drawers Desk Height","price_diff":-2500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 704 AND v.variant_name = 'Filing Drawer Setup: 2 Drawers Desk Height' AND v.attributes = '{"type":"drawers","group":"Filing Drawer Setup","label":"2 Drawers Desk Height","price_diff":-2500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 705, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard4_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 705 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard4_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 705, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard4_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 705 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard4_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 705, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard4_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 705 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard4_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 705, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard4_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 705 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard4_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 705, 'Mirror & Door Style: Full-Length Dressing Mirror', NULL, 16499, 50, '{"type":"mirror","group":"Mirror & Door Style","label":"Full-Length Dressing Mirror","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 705 AND v.variant_name = 'Mirror & Door Style: Full-Length Dressing Mirror' AND v.attributes = '{"type":"mirror","group":"Mirror & Door Style","label":"Full-Length Dressing Mirror","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 705, 'Mirror & Door Style: Solid Steel Classic Door', NULL, 15299, 50, '{"type":"mirror","group":"Mirror & Door Style","label":"Solid Steel Classic Door","price_diff":-1200,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 705 AND v.variant_name = 'Mirror & Door Style: Solid Steel Classic Door' AND v.attributes = '{"type":"mirror","group":"Mirror & Door Style","label":"Solid Steel Classic Door","price_diff":-1200,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 705, 'Mirror & Door Style: Dual Full Mirrors (Both Doors)', NULL, 18099, 50, '{"type":"mirror","group":"Mirror & Door Style","label":"Dual Full Mirrors (Both Doors)","price_diff":1600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 705 AND v.variant_name = 'Mirror & Door Style: Dual Full Mirrors (Both Doors)' AND v.attributes = '{"type":"mirror","group":"Mirror & Door Style","label":"Dual Full Mirrors (Both Doors)","price_diff":1600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 705, 'Internal Vault: With Secret Safe Locker & Bangle Rod', NULL, 16499, 50, '{"type":"locker","group":"Internal Vault","label":"With Secret Safe Locker & Bangle Rod","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 705 AND v.variant_name = 'Internal Vault: With Secret Safe Locker & Bangle Rod' AND v.attributes = '{"type":"locker","group":"Internal Vault","label":"With Secret Safe Locker & Bangle Rod","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 705, 'Internal Vault: Standard Multi-Shelf Storage', NULL, 15699, 50, '{"type":"locker","group":"Internal Vault","label":"Standard Multi-Shelf Storage","price_diff":-800,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 705 AND v.variant_name = 'Internal Vault: Standard Multi-Shelf Storage' AND v.attributes = '{"type":"locker","group":"Internal Vault","label":"Standard Multi-Shelf Storage","price_diff":-800,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 706, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard3_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 706 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard3_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 706, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard3_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 706 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard3_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 706, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard3_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 706 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard3_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 706, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard3_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 706 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard3_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 706, 'Mirror & Door Style: Full-Length Dressing Mirror', NULL, 19999, 50, '{"type":"mirror","group":"Mirror & Door Style","label":"Full-Length Dressing Mirror","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 706 AND v.variant_name = 'Mirror & Door Style: Full-Length Dressing Mirror' AND v.attributes = '{"type":"mirror","group":"Mirror & Door Style","label":"Full-Length Dressing Mirror","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 706, 'Mirror & Door Style: Solid Steel Classic Door', NULL, 18799, 50, '{"type":"mirror","group":"Mirror & Door Style","label":"Solid Steel Classic Door","price_diff":-1200,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 706 AND v.variant_name = 'Mirror & Door Style: Solid Steel Classic Door' AND v.attributes = '{"type":"mirror","group":"Mirror & Door Style","label":"Solid Steel Classic Door","price_diff":-1200,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 706, 'Mirror & Door Style: Dual Full Mirrors (Both Doors)', NULL, 21599, 50, '{"type":"mirror","group":"Mirror & Door Style","label":"Dual Full Mirrors (Both Doors)","price_diff":1600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 706 AND v.variant_name = 'Mirror & Door Style: Dual Full Mirrors (Both Doors)' AND v.attributes = '{"type":"mirror","group":"Mirror & Door Style","label":"Dual Full Mirrors (Both Doors)","price_diff":1600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 706, 'Internal Vault: With Secret Safe Locker & Bangle Rod', NULL, 19999, 50, '{"type":"locker","group":"Internal Vault","label":"With Secret Safe Locker & Bangle Rod","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 706 AND v.variant_name = 'Internal Vault: With Secret Safe Locker & Bangle Rod' AND v.attributes = '{"type":"locker","group":"Internal Vault","label":"With Secret Safe Locker & Bangle Rod","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 706, 'Internal Vault: Standard Multi-Shelf Storage', NULL, 19199, 50, '{"type":"locker","group":"Internal Vault","label":"Standard Multi-Shelf Storage","price_diff":-800,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 706 AND v.variant_name = 'Internal Vault: Standard Multi-Shelf Storage' AND v.attributes = '{"type":"locker","group":"Internal Vault","label":"Standard Multi-Shelf Storage","price_diff":-800,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 708, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard5_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 708 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/cupboard5_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 708, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard5_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 708 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/cupboard5_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 708, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard5_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 708 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/cupboard5_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 708, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard5_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 708 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/cupboard5_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 708, 'Cabinet Height: Medium 48" H (3 Shelves)', NULL, 17999, 50, '{"type":"height","group":"Cabinet Height","label":"Medium 48\" H (3 Shelves)","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 708 AND v.variant_name = 'Cabinet Height: Medium 48" H (3 Shelves)' AND v.attributes = '{"type":"height","group":"Cabinet Height","label":"Medium 48\" H (3 Shelves)","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 708, 'Cabinet Height: Compact 36" H (2 Shelves)', NULL, 16799, 50, '{"type":"height","group":"Cabinet Height","label":"Compact 36\" H (2 Shelves)","price_diff":-1200,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 708 AND v.variant_name = 'Cabinet Height: Compact 36" H (2 Shelves)' AND v.attributes = '{"type":"height","group":"Cabinet Height","label":"Compact 36\" H (2 Shelves)","price_diff":-1200,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 708, 'Cabinet Height: Tall 60" H (4 Shelves)', NULL, 19599, 50, '{"type":"height","group":"Cabinet Height","label":"Tall 60\" H (4 Shelves)","price_diff":1600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 708 AND v.variant_name = 'Cabinet Height: Tall 60" H (4 Shelves)' AND v.attributes = '{"type":"height","group":"Cabinet Height","label":"Tall 60\" H (4 Shelves)","price_diff":1600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 709, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/library1_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 709 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/library1_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 709, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/library1_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 709 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/library1_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 709, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/library1_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 709 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/library1_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 709, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/library1_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 709 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/library1_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 709, 'Library Door Style: Double Glass Display Doors', NULL, 14999, 50, '{"type":"doors","group":"Library Door Style","label":"Double Glass Display Doors","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 709 AND v.variant_name = 'Library Door Style: Double Glass Display Doors' AND v.attributes = '{"type":"doors","group":"Library Door Style","label":"Double Glass Display Doors","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 709, 'Library Door Style: Perforated Mesh Air-Vent Doors', NULL, 15999, 50, '{"type":"doors","group":"Library Door Style","label":"Perforated Mesh Air-Vent Doors","price_diff":1000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 709 AND v.variant_name = 'Library Door Style: Perforated Mesh Air-Vent Doors' AND v.attributes = '{"type":"doors","group":"Library Door Style","label":"Perforated Mesh Air-Vent Doors","price_diff":1000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 709, 'Library Door Style: Heavy Archival Solid Steel', NULL, 14499, 50, '{"type":"doors","group":"Library Door Style","label":"Heavy Archival Solid Steel","price_diff":-500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 709 AND v.variant_name = 'Library Door Style: Heavy Archival Solid Steel' AND v.attributes = '{"type":"doors","group":"Library Door Style","label":"Heavy Archival Solid Steel","price_diff":-500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 709, 'Shelf Weight Rating: 70 kg/Shelf Standard', NULL, 14999, 50, '{"type":"capacity","group":"Shelf Weight Rating","label":"70 kg/Shelf Standard","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 709 AND v.variant_name = 'Shelf Weight Rating: 70 kg/Shelf Standard' AND v.attributes = '{"type":"capacity","group":"Shelf Weight Rating","label":"70 kg/Shelf Standard","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 709, 'Shelf Weight Rating: 100 kg/Shelf Reinforced', NULL, 16799, 50, '{"type":"capacity","group":"Shelf Weight Rating","label":"100 kg/Shelf Reinforced","price_diff":1800,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 709 AND v.variant_name = 'Shelf Weight Rating: 100 kg/Shelf Reinforced' AND v.attributes = '{"type":"capacity","group":"Shelf Weight Rating","label":"100 kg/Shelf Reinforced","price_diff":1800,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 710, 'Color: Pearl White', NULL, NULL, 50, '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/library2_white.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 710 AND v.variant_name = 'Color: Pearl White' AND v.attributes = '{"type":"color","color":"Pearl White","color_key":"white","color_code":"#f0f0ee","badge":"Classic","image":"/images-webp/library2_white.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 710, 'Color: Matte Black', NULL, NULL, 50, '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/library2_black.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 710 AND v.variant_name = 'Color: Matte Black' AND v.attributes = '{"type":"color","color":"Matte Black","color_key":"black","color_code":"#1c1c20","badge":"Modern","image":"/images-webp/library2_black.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 710, 'Color: Steel Grey', NULL, NULL, 50, '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/library2_grey.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 710 AND v.variant_name = 'Color: Steel Grey' AND v.attributes = '{"type":"color","color":"Steel Grey","color_key":"grey","color_code":"#64748b","badge":"Standard","image":"/images-webp/library2_grey.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 710, 'Color: Ivory Cream', NULL, NULL, 50, '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/library2_ivory.webp"}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 710 AND v.variant_name = 'Color: Ivory Cream' AND v.attributes = '{"type":"color","color":"Ivory Cream","color_key":"ivory","color_code":"#d4a373","badge":"Dual Tone","image":"/images-webp/library2_ivory.webp"}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 710, 'Library Door Style: Double Glass Display Doors', NULL, 16999, 50, '{"type":"doors","group":"Library Door Style","label":"Double Glass Display Doors","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 710 AND v.variant_name = 'Library Door Style: Double Glass Display Doors' AND v.attributes = '{"type":"doors","group":"Library Door Style","label":"Double Glass Display Doors","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 710, 'Library Door Style: Perforated Mesh Air-Vent Doors', NULL, 17999, 50, '{"type":"doors","group":"Library Door Style","label":"Perforated Mesh Air-Vent Doors","price_diff":1000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 710 AND v.variant_name = 'Library Door Style: Perforated Mesh Air-Vent Doors' AND v.attributes = '{"type":"doors","group":"Library Door Style","label":"Perforated Mesh Air-Vent Doors","price_diff":1000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 710, 'Library Door Style: Heavy Archival Solid Steel', NULL, 16499, 50, '{"type":"doors","group":"Library Door Style","label":"Heavy Archival Solid Steel","price_diff":-500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 710 AND v.variant_name = 'Library Door Style: Heavy Archival Solid Steel' AND v.attributes = '{"type":"doors","group":"Library Door Style","label":"Heavy Archival Solid Steel","price_diff":-500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 710, 'Shelf Weight Rating: 70 kg/Shelf Standard', NULL, 16999, 50, '{"type":"capacity","group":"Shelf Weight Rating","label":"70 kg/Shelf Standard","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 710 AND v.variant_name = 'Shelf Weight Rating: 70 kg/Shelf Standard' AND v.attributes = '{"type":"capacity","group":"Shelf Weight Rating","label":"70 kg/Shelf Standard","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 710, 'Shelf Weight Rating: 100 kg/Shelf Reinforced', NULL, 18799, 50, '{"type":"capacity","group":"Shelf Weight Rating","label":"100 kg/Shelf Reinforced","price_diff":1800,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 710 AND v.variant_name = 'Shelf Weight Rating: 100 kg/Shelf Reinforced' AND v.attributes = '{"type":"capacity","group":"Shelf Weight Rating","label":"100 kg/Shelf Reinforced","price_diff":1800,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 501, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 2499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 501 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 501, 'Coating Type: Heavy Industrial Matte Finish', NULL, 2999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 501 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 509, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 2699, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 509 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 509, 'Coating Type: Heavy Industrial Matte Finish', NULL, 3199, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 509 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 510, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 2899, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 510 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 510, 'Coating Type: Heavy Industrial Matte Finish', NULL, 3399, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 510 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 511, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 2299, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 511 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 511, 'Coating Type: Heavy Industrial Matte Finish', NULL, 2799, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 511 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 512, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3199, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 512 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 512, 'Coating Type: Heavy Industrial Matte Finish', NULL, 3699, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 512 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 502, 'Size: 3×2 ft', NULL, 7499, 50, '{"type":"size","label":"3×2 ft","old_price":null}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 502 AND v.variant_name = 'Size: 3×2 ft' AND v.attributes = '{"type":"size","label":"3×2 ft","old_price":null}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 502, 'Size: 5×2 ft', NULL, 11499, 50, '{"type":"size","label":"5×2 ft","old_price":null}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 502 AND v.variant_name = 'Size: 5×2 ft' AND v.attributes = '{"type":"size","label":"5×2 ft","old_price":null}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 502, 'Table Size: 3×2 ft', NULL, 7499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 502 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 502, 'Table Size: 5×2 ft', NULL, 10499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 502 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 502, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 7499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 502 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 502, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 7899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 502 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 502, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 8099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 502 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 513, 'Size: 3×2 ft', NULL, 7999, 50, '{"type":"size","label":"3×2 ft","old_price":null}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 513 AND v.variant_name = 'Size: 3×2 ft' AND v.attributes = '{"type":"size","label":"3×2 ft","old_price":null}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 513, 'Size: 5×2 ft', NULL, 11999, 50, '{"type":"size","label":"5×2 ft","old_price":null}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 513 AND v.variant_name = 'Size: 5×2 ft' AND v.attributes = '{"type":"size","label":"5×2 ft","old_price":null}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 513, 'Table Size: 3×2 ft', NULL, 7999, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 513 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 513, 'Table Size: 5×2 ft', NULL, 10999, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 513 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 513, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 7999, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 513 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 513, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 8399, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 513 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 513, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 8599, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 513 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 514, 'Size: 3×2 ft', NULL, 8499, 50, '{"type":"size","label":"3×2 ft","old_price":null}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 514 AND v.variant_name = 'Size: 3×2 ft' AND v.attributes = '{"type":"size","label":"3×2 ft","old_price":null}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 514, 'Size: 5×2 ft', NULL, 12499, 50, '{"type":"size","label":"5×2 ft","old_price":null}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 514 AND v.variant_name = 'Size: 5×2 ft' AND v.attributes = '{"type":"size","label":"5×2 ft","old_price":null}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 514, 'Table Size: 3×2 ft', NULL, 8499, 50, '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 514 AND v.variant_name = 'Table Size: 3×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"3×2 ft","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 514, 'Table Size: 5×2 ft', NULL, 11499, 50, '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 514 AND v.variant_name = 'Table Size: 5×2 ft' AND v.attributes = '{"type":"size","group":"Table Size","label":"5×2 ft","price_diff":3000,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 514, 'Top & Frame Finish: Warm Teak / Black Frame', NULL, 8499, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 514 AND v.variant_name = 'Top & Frame Finish: Warm Teak / Black Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Warm Teak / Black Frame","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 514, 'Top & Frame Finish: Classic Walnut / Grey Frame', NULL, 8899, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 514 AND v.variant_name = 'Top & Frame Finish: Classic Walnut / Grey Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Classic Walnut / Grey Frame","price_diff":400,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 514, 'Top & Frame Finish: Natural Oak / White Frame', NULL, 9099, 50, '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 514 AND v.variant_name = 'Top & Frame Finish: Natural Oak / White Frame' AND v.attributes = '{"type":"finish","group":"Top & Frame Finish","label":"Natural Oak / White Frame","price_diff":600,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 503, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 503 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 503, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 503 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 515, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 4299, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 515 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 515, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4799, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 515 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 516, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 4499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 516 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 516, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 516 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 517, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 4799, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 517 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 517, 'Coating Type: Heavy Industrial Matte Finish', NULL, 5299, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 517 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 504, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 12999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 504 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 504, 'Coating Type: Heavy Industrial Matte Finish', NULL, 13499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 504 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 518, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 13999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 518 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 518, 'Coating Type: Heavy Industrial Matte Finish', NULL, 14499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 518 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 519, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 14999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 519 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 519, 'Coating Type: Heavy Industrial Matte Finish', NULL, 15499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 519 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 506, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 2999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 506 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 506, 'Coating Type: Heavy Industrial Matte Finish', NULL, 3499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 506 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 520, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3299, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 520 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 520, 'Coating Type: Heavy Industrial Matte Finish', NULL, 3799, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 520 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 521, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 521 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 521, 'Coating Type: Heavy Industrial Matte Finish', NULL, 3999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 521 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 522, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3799, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 522 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 522, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4299, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 522 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 507, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3699, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 507 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 507, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4199, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 507 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 523, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 3999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 523 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 523, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 523 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 524, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 4299, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 524 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 524, 'Coating Type: Heavy Industrial Matte Finish', NULL, 4799, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 524 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 508, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 1499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 508 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 508, 'Coating Type: Heavy Industrial Matte Finish', NULL, 1999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 508 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 525, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 1699, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 525 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 525, 'Coating Type: Heavy Industrial Matte Finish', NULL, 2199, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 525 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 526, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 1799, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 526 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 526, 'Coating Type: Heavy Industrial Matte Finish', NULL, 2299, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 526 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 527, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 1899, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 527 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 527, 'Coating Type: Heavy Industrial Matte Finish', NULL, 2399, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 527 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 528, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 1999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 528 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 528, 'Coating Type: Heavy Industrial Matte Finish', NULL, 2499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 528 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 601, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 13999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 601 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 601, 'Coating Type: Heavy Industrial Matte Finish', NULL, 14499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 601 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 605, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 14999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 605 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 605, 'Coating Type: Heavy Industrial Matte Finish', NULL, 15499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 605 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 602, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 11499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 602 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 602, 'Coating Type: Heavy Industrial Matte Finish', NULL, 11999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 602 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 604, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 15499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 604 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 604, 'Coating Type: Heavy Industrial Matte Finish', NULL, 15999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 604 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 606, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 14499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 606 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 606, 'Coating Type: Heavy Industrial Matte Finish', NULL, 14999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 606 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 603, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 9999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 603 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 603, 'Coating Type: Heavy Industrial Matte Finish', NULL, 10499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 603 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 607, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 10999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 607 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 607, 'Coating Type: Heavy Industrial Matte Finish', NULL, 11499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 607 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 608, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 10499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 608 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 608, 'Coating Type: Heavy Industrial Matte Finish', NULL, 10999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 608 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 609, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 11999, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 609 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 609, 'Coating Type: Heavy Industrial Matte Finish', NULL, 12499, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 609 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 610, 'Coating Type: Anti-Rust Epoxy Powder Coated', NULL, 12499, 50, '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 610 AND v.variant_name = 'Coating Type: Anti-Rust Epoxy Powder Coated' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Anti-Rust Epoxy Powder Coated","price_diff":0,"is_default":true}'::jsonb);
INSERT INTO product_variants (product_id, variant_name, sku, price, stock_quantity, attributes, is_active)
SELECT 610, 'Coating Type: Heavy Industrial Matte Finish', NULL, 12999, 50, '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = 610 AND v.variant_name = 'Coating Type: Heavy Industrial Matte Finish' AND v.attributes = '{"type":"finish","group":"Coating Type","label":"Heavy Industrial Matte Finish","price_diff":500,"is_default":false}'::jsonb);

SELECT setval(pg_get_serial_sequence('categories', 'id'), GREATEST((SELECT MAX(id) FROM categories), 1));
SELECT setval(pg_get_serial_sequence('sub_categories', 'id'), GREATEST((SELECT MAX(id) FROM sub_categories), 1));
SELECT setval(pg_get_serial_sequence('products', 'id'), GREATEST((SELECT MAX(id) FROM products), 1));
SELECT setval(pg_get_serial_sequence('product_images', 'id'), GREATEST((SELECT MAX(id) FROM product_images), 1));
SELECT setval(pg_get_serial_sequence('product_variants', 'id'), GREATEST((SELECT MAX(id) FROM product_variants), 1));
COMMIT;
