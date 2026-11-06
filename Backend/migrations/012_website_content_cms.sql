-- CMS-managed structured pages and reusable storefront sections.
CREATE TABLE IF NOT EXISTS website_content (
  id SERIAL PRIMARY KEY,
  content_key VARCHAR(100) NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT website_content_key_format CHECK (content_key ~ '^[a-z0-9][a-z0-9_-]{0,99}$'),
  CONSTRAINT website_content_object CHECK (jsonb_typeof(content) = 'object')
);
CREATE INDEX IF NOT EXISTS idx_website_content_published ON website_content (content_key) WHERE is_published = TRUE;

-- Seed the current public copy once so the first CMS deployment preserves the storefront.
-- ON CONFLICT DO NOTHING keeps later administrator edits intact.
INSERT INTO website_content (content_key, content, is_published) VALUES
('home_content', $cms${
  "promo_eyebrow":"EXCLUSIVE FURNITURE",
  "promo_title":"Smart Storage Solutions for Every Space",
  "promo_description":"Discover stylish furniture and smart storage solutions designed to bring comfort, elegance, and functionality to your home and office.",
  "promo_image":"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=90",
  "promo_button_text":"Explore",
  "promo_button_link":"/category/cupboards-almirahs",
  "testimonials_heading":"Reflections of Elegance & Craft",
  "testimonials_subtitle":"Customer experiences with our furniture and service.",
  "testimonials":[
    {"name":"Priya Sharma","role":"Interior Architect, Pune","rating":5,"review":"The furniture fits beautifully into our space, and the finish is excellent.","initials":"PS","image":"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&h=400&q=80"},
    {"name":"Vikramaditya Singhania","role":"Estate Owner, Mumbai","rating":5,"review":"The seating transformed our veranda into a comfortable place to relax.","initials":"VS","image":"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&h=400&q=80"}
  ]
}$cms$::jsonb, TRUE),
('about_content', $cms${
  "eyebrow":"About Staging Spaces",
  "heading":"Furniture for the way you live.",
  "lead":"We design and sell furniture that brings comfort, character and timeless style into everyday homes.",
  "image":"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
  "story_title":"Good furniture should feel effortless.",
  "story_paragraphs":[
    "Staging Spaces started with a simple idea: well-made furniture shouldn't be hard to find, or hard to live with. We bring together carefully chosen pieces that work beautifully together.",
    "Every piece is picked for comfort, craftsmanship and the way it makes a room feel, then delivered to your door with care."
  ],
  "stats":[{"value":"7","label":"Main Categories"},{"value":"100%","label":"CRCA Prime Steel"},{"value":"Pan-India","label":"Delivery"},{"value":"10-Year","label":"Durability"}],
  "values":[
    {"title":"Built to last","text":"Solid materials and careful finishing, so your furniture looks good for years."},
    {"title":"Thoughtful design","text":"Clean, timeless pieces that fit real homes and don't chase trends."},
    {"title":"Delivered with care","text":"Safe delivery and assembly, so it arrives ready to enjoy."},
    {"title":"Here to help","text":"Real people behind every order, before and after it reaches you."}
  ],
  "cta_heading":"Ready to make your space beautiful.",
  "cta_description":"Browse the full collection and find the piece your room has been missing."
}$cms$::jsonb, TRUE),
('contact_content', $cms${
  "email":"contactstagingspaces@gmail.com",
  "phone":"+91 8669944932",
  "address":"987, A,D Camp Chowk, Bhawani Peth, Pune, Maharashtra 411042",
  "response_time":"We usually reply within one working day.",
  "delivery_note":"We deliver across India."
}$cms$::jsonb, TRUE),
('footer_content', $cms${
  "description":"Thoughtfully designed furniture for the way you live - made to bring comfort, character and timeless style to your home and office.",
  "instagram_url":"https://www.instagram.com/staging_spaces__?rpxt=MnI0YXRndzJ5dmtn",
  "categories":[
    {"label":"Office Furniture","to":"/category/office-furniture"},
    {"label":"Home Furniture (Coming Soon)","to":"/category/home-furniture"},
    {"label":"Seating Solutions","to":"/category/seating-solutions"},
    {"label":"Cupboards & Almirahs","to":"/category/cupboards-almirahs"},
    {"label":"Outdoor Furniture","to":"/category/outdoor-furniture"},
    {"label":"Bunk Beds","to":"/category/bunk-beds"},
    {"label":"Metal Racks","to":"/category/metal-racks"}
  ],
  "quick_links":[{"label":"About Us","to":"/about"},{"label":"Contact Us","to":"/contact"},{"label":"My Wishlist","to":"/wishlist"},{"label":"My Cart","to":"/cart"}]
}$cms$::jsonb, TRUE),
('seo_content', $cms${
  "home_title":"Staging Spaces | Furniture for Home and Office",
  "home_description":"Shop durable furniture, office seating, steel storage, and home essentials from Staging Spaces.",
  "about_title":"About Staging Spaces",
  "about_description":"Learn about Staging Spaces and our furniture craftsmanship.",
  "contact_title":"Contact Staging Spaces",
  "contact_description":"Get in touch with Staging Spaces for product, order, and delivery support."
}$cms$::jsonb, TRUE)
ON CONFLICT (content_key) DO NOTHING;

