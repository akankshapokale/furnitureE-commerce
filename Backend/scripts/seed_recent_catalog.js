const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const ts = require('typescript');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'akanksha',
  database: 'furniture_database'
});

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 0. Ensure CMS columns and tables exist
    await client.query(`
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
    `);

    // 1. Read categoriesData.ts
    const filePath = path.join(__dirname, '../../website/src/data/categoriesData.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const js = ts.transpileModule(fileContent, {
      compilerOptions: { module: ts.ModuleKind.CommonJS }
    }).outputText;

    const moduleExports = {};
    const fn = new Function('exports', 'module', 'require', js);
    fn(moduleExports, { exports: moduleExports }, require);

    const categoriesData = moduleExports.categoriesData;
    console.log(`Parsed ${categoriesData.length} categories from website data.`);

    // 2. Ensure Categories exist in DB
    const categoryMap = new Map(); // cat.name.toLowerCase() -> dbId

    // Fetch existing categories
    const existingCats = await client.query('SELECT id, name FROM categories');
    existingCats.rows.forEach(c => {
      categoryMap.set(c.name.toLowerCase().trim(), c.id);
    });

    // Map common aliases
    categoryMap.set('cupboards & almirahs', categoryMap.get('cupboards and almirahs'));

    for (const cat of categoriesData) {
      const normalizedName = cat.name.toLowerCase().trim();
      let dbCatId = categoryMap.get(normalizedName);

      if (!dbCatId) {
        // If "Cupboards & Almirahs", check "Cupboards and Almirahs"
        if (normalizedName === 'cupboards & almirahs' && categoryMap.has('cupboards and almirahs')) {
          dbCatId = categoryMap.get('cupboards and almirahs');
        } else {
          console.log(`Creating category: "${cat.name}"`);
          const ins = await client.query(
            `INSERT INTO categories (name, description, is_active)
             VALUES ($1, $2, true)
             RETURNING id`,
            [cat.name, cat.description || `Collection of ${cat.name}`]
          );
          dbCatId = ins.rows[0].id;
          categoryMap.set(normalizedName, dbCatId);
        }
      }
      categoryMap.set(cat.id, dbCatId);
      categoryMap.set(normalizedName, dbCatId);
    }

    console.log('Category mapping ready:');
    for (const [key, id] of categoryMap.entries()) {
      console.log(`  ${key} -> ID ${id}`);
    }

    // 3. Ensure Subcategories exist in DB
    const subcategoryMap = new Map(); // `${catId}:${subName.toLowerCase()}` -> dbSubId

    const existingSubs = await client.query('SELECT id, category_id, name FROM sub_categories');
    existingSubs.rows.forEach(s => {
      subcategoryMap.set(`${s.category_id}:${s.name.toLowerCase().trim()}`, s.id);
    });

    for (const cat of categoriesData) {
      const catDbId = categoryMap.get(cat.id) || categoryMap.get(cat.name.toLowerCase().trim());
      if (!catDbId || !cat.subcategories) continue;

      for (const sub of cat.subcategories) {
        const subKey = `${catDbId}:${sub.name.toLowerCase().trim()}`;
        let subDbId = subcategoryMap.get(subKey);

        if (!subDbId) {
          console.log(`Creating subcategory: "${sub.name}" for category ID ${catDbId}`);
          const ins = await client.query(
            `INSERT INTO sub_categories (category_id, name, description, is_active)
             VALUES ($1, $2, $3, true)
             RETURNING id`,
            [catDbId, sub.name, `${sub.name} furniture pieces`]
          );
          subDbId = ins.rows[0].id;
          subcategoryMap.set(subKey, subDbId);
        }
        subcategoryMap.set(`${catDbId}:${sub.id}`, subDbId);
      }
    }

    // 4. Upsert Products & Product Images
    let totalInsertedOrUpdated = 0;
    let totalImagesInserted = 0;

    for (const cat of categoriesData) {
      const catDbId = categoryMap.get(cat.id) || categoryMap.get(cat.name.toLowerCase().trim());
      if (!cat.products) continue;

      for (const p of cat.products) {
        // Resolve subcategory id
        let subDbId = null;
        if (p.subcategoryId) {
          subDbId = subcategoryMap.get(`${catDbId}:${p.subcategoryId}`) || null;
        }
        if (!subDbId && p.subcategoryName) {
          subDbId = subcategoryMap.get(`${catDbId}:${p.subcategoryName.toLowerCase().trim()}`) || null;
        }

        const slug = slugify(p.name) + `-${p.id}`;
        const sku = `WV-${p.id}`;
        const regularPrice = p.oldPrice && p.oldPrice > p.price ? p.oldPrice : p.price;
        const discountPrice = p.oldPrice && p.oldPrice > p.price ? p.price : (p.discount ? Math.round(p.price * (1 - p.discount / 100)) : null);
        const description = p.description || `${p.name} - premium quality furniture crafted for modern spaces.`;
        const shortDescription = p.description ? p.description.slice(0, 150) : description.slice(0, 150);
        const specs = JSON.stringify(p.specifications || []);
        const highlights = JSON.stringify(p.badge ? [p.badge, "Direct Factory Guarantee", "High Durability"] : ["Direct Factory Guarantee", "Premium Finish", "High Durability"]);

        await client.query(
          `INSERT INTO products
             (id, category_id, sub_category_id, name, slug, description, short_description,
              price, discount_price, sku, stock_quantity, status, is_featured,
              specifications, highlights, info_sections, related_product_ids, updated_at)
           VALUES
             ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active', $12, $13::jsonb, $14::jsonb, '[]'::jsonb, '{}', NOW())
           ON CONFLICT (id) DO UPDATE SET
             category_id = EXCLUDED.category_id,
             sub_category_id = COALESCE(EXCLUDED.sub_category_id, products.sub_category_id),
             name = EXCLUDED.name,
             slug = EXCLUDED.slug,
             description = EXCLUDED.description,
             short_description = EXCLUDED.short_description,
             price = EXCLUDED.price,
             discount_price = EXCLUDED.discount_price,
             sku = EXCLUDED.sku,
             specifications = EXCLUDED.specifications,
             highlights = EXCLUDED.highlights,
             updated_at = NOW()`,
          [
            p.id,
            catDbId,
            subDbId,
            p.name.trim(),
            slug,
            description,
            shortDescription,
            regularPrice,
            discountPrice,
            sku,
            50,
            Boolean(p.badge),
            specs,
            highlights,
          ]
        );
        totalInsertedOrUpdated++;

        // Collect images for product
        const productImages = [];
        if (p.image) productImages.push(p.image);
        if (Array.isArray(p.images)) {
          p.images.forEach(img => {
            if (img && !productImages.includes(img)) productImages.push(img);
          });
        }
        if (Array.isArray(p.colors)) {
          p.colors.forEach(col => {
            if (col.image && !productImages.includes(col.image)) productImages.push(col.image);
          });
        }

        // Delete existing images for this product and reinsert fresh clean list
        await client.query(`DELETE FROM product_images WHERE product_id = $1`, [p.id]);

        for (let idx = 0; idx < productImages.length; idx++) {
          const imgUrl = productImages[idx];
          await client.query(
            `INSERT INTO product_images
               (product_id, image_url, alt_text, display_order, is_primary)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              p.id,
              imgUrl,
              `${p.name} - view ${idx + 1}`,
              idx,
              idx === 0,
            ]
          );
          totalImagesInserted++;
        }
      }
    }

    // Also populate images for products 1-8 if they have no images
    const legacyImages = [
      { id: 1, img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc" },
      { id: 2, img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c" },
      { id: 3, img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc" },
      { id: 4, img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" },
      { id: 5, img: "https://images.unsplash.com/photo-1617098900591-3f90928e8c54" },
      { id: 6, img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2" },
      { id: 7, img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91" },
      { id: 8, img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" },
    ];
    for (const legacy of legacyImages) {
      const chk = await client.query('SELECT 1 FROM product_images WHERE product_id = $1', [legacy.id]);
      if (chk.rows.length === 0) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
           VALUES ($1, $2, $3, 0, true)`,
          [legacy.id, legacy.img, `Product ${legacy.id}`]
        );
        totalImagesInserted++;
      }
    }
    // Also populate images for products 707, 711-720
    const cupboardExtras = [
      { id: 707, img: '/images-webp/cupboard2.webp', sub: 'Almirah' },
      { id: 711, img: '/images-webp/metal-drawer2.webp', sub: 'Filing Cabinet' },
      { id: 712, img: '/images-webp/metal-drawer3.webp', sub: 'Filing Cabinet' },
      { id: 713, img: '/images-webp/cupboard5.webp', sub: 'Bookcase' },
      { id: 714, img: '/images-webp/cupboard4.webp', sub: 'Bookcase' },
      { id: 715, img: '/images-webp/library1.webp', sub: 'Library Cupboard' },
      { id: 716, img: '/images-webp/library2.webp', sub: 'Library Cupboard' },
      { id: 717, img: '/images-webp/library1.webp', sub: 'Library Cupboard' },
      { id: 718, img: '/images-webp/metal-drawer1.webp', sub: 'Industrial Locker' },
      { id: 719, img: '/images-webp/cupboard3.webp', sub: 'Unit Cupboard' },
      { id: 720, img: '/images-webp/cupboard2.webp', sub: 'Storewell' },
    ];
    for (const extra of cupboardExtras) {
      const subRes = await client.query('SELECT id FROM sub_categories WHERE category_id = 8 AND name ILIKE $1 LIMIT 1', [`%${extra.sub}%`]);
      const subId = subRes.rows[0]?.id || null;
      if (subId) {
        await client.query('UPDATE products SET sub_category_id = $1 WHERE id = $2', [subId, extra.id]);
      }
      await client.query('DELETE FROM product_images WHERE product_id = $1', [extra.id]);
      await client.query(
        'INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES ($1, $2, $3, 0, true)',
        [extra.id, extra.img, 'Cupboard Product']
      );
      totalImagesInserted++;
    }

    // 5. Update postgres sequences to avoid ID collision
    await client.query(`
      SELECT setval(pg_get_serial_sequence('categories', 'id'), GREATEST((SELECT MAX(id) FROM categories), 1));
      SELECT setval(pg_get_serial_sequence('sub_categories', 'id'), GREATEST((SELECT MAX(id) FROM sub_categories), 1));
      SELECT setval(pg_get_serial_sequence('products', 'id'), GREATEST((SELECT MAX(id) FROM products), 1));
      SELECT setval(pg_get_serial_sequence('product_images', 'id'), GREATEST((SELECT MAX(id) FROM product_images), 1));
    `);

    await client.query('COMMIT');
    console.log(`SUCCESS! Inserted/Updated ${totalInsertedOrUpdated} products.`);
    console.log(`Inserted ${totalImagesInserted} product images into product_images table.`);

    // Quick verification
    const countP = await client.query('SELECT count(*) FROM products');
    const countI = await client.query('SELECT count(*) FROM product_images');
    const countS = await client.query('SELECT count(*) FROM sub_categories');
    const countC = await client.query('SELECT count(*) FROM categories');
    console.log(`\nFinal DB Counts:`);
    console.log(`  Categories: ${countC.rows[0].count}`);
    console.log(`  Subcategories: ${countS.rows[0].count}`);
    console.log(`  Products: ${countP.rows[0].count}`);
    console.log(`  Product Images: ${countI.rows[0].count}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
