
// Load .env before importing controllers that may read configuration at module load.
import "dotenv/config";

import express = require("express");
import cors = require("cors");
import path = require("path");

import { pool } from "./config/db";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import subCategoryRoutes from "./routes/subCategoryRoutes";
import shipmentRoutes from "./routes/shipmentRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import authRoutes from "./routes/authRoutes";
import addressRoutes from "./routes/addressRoutes";
import orderItemRoutes from "./routes/orderItemRoutes";
import peopleRoutes from "./routes/peopleRoutes";
import websiteControlRoutes from "./routes/websiteControlRoutes";
import websiteContentRoutes from "./routes/websiteContentRoutes";
import offerRoutes from "./routes/offerRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import customSizeRequestRoutes from "./routes/customSizeRequestRoutes";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// Middleware

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Disable all caching so browsers always get fresh images and API data
app.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Serve static images from website/public so relative image paths work everywhere
const publicPath = path.join(__dirname, "../../website/public");
const noCache = { maxAge: 0, etag: false, lastModified: false };
app.use(express.static(publicPath, noCache));
app.use('/uploads', express.static(path.join(publicPath, 'uploads'), noCache));

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "Furniture Backend API is running",
  });
});

// Database test
app.get("/api/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Auth routes
app.use("/api/auth", authRoutes);

// User routes
app.use("/api/users", userRoutes);

// Employee management (admin only)
app.use("/api/people", peopleRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/sub-categories", subCategoryRoutes);

app.use("/api/shipments", shipmentRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/addresses", addressRoutes);

app.use("/api/order-items", orderItemRoutes);

app.use("/api/website-control", websiteControlRoutes);
app.use("/api/website-content", websiteContentRoutes);

app.use("/api/offers", offerRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/custom-size-requests", customSizeRequestRoutes);

app.use("/api/upload", uploadRoutes);

// Keep the staff schema present across local and deployed databases. This is
// idempotent and avoids staff creation failing when a deployment has not yet
// run the standalone SQL migration.
const startServer = async () => {
  // Optional migration — never crash the server if DB is temporarily unreachable
  try {
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT");
    await pool.query("ALTER TABLE order_items ADD COLUMN IF NOT EXISTS inventory_deducted BOOLEAN NOT NULL DEFAULT FALSE");
  } catch (error) {
    console.warn("Warning: Staff schema migration skipped:", (error as Error).message);
  }
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_size_requests (
        id BIGSERIAL PRIMARY KEY,
        request_id TEXT NOT NULL UNIQUE,
        customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
        product_name TEXT NOT NULL,
        product_image TEXT,
        length_cm NUMERIC(10, 2) NOT NULL CHECK (length_cm > 0),
        width_cm NUMERIC(10, 2) NOT NULL CHECK (width_cm > 0),
        height_cm NUMERIC(10, 2) NOT NULL CHECK (height_cm > 0),
        measurement_unit TEXT NOT NULL DEFAULT 'CM' CHECK (measurement_unit = 'CM'),
        status TEXT NOT NULL DEFAULT 'Pending'
          CHECK (status IN ('Pending', 'Under Review', 'Quotation Sent', 'Approved', 'Rejected')),
        admin_remarks TEXT,
        quotation_amount NUMERIC(12, 2) CHECK (quotation_amount IS NULL OR quotation_amount >= 0),
        quotation_details TEXT,
        customer_decision TEXT CHECK (customer_decision IS NULL OR customer_decision IN ('Accepted', 'Rejected')),
        customer_decided_at TIMESTAMPTZ,
        quotation_sent_at TIMESTAMPTZ,
        order_id INTEGER UNIQUE REFERENCES orders(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`ALTER TABLE custom_size_requests ADD COLUMN IF NOT EXISTS order_id INTEGER UNIQUE REFERENCES orders(id) ON DELETE SET NULL`);
    await pool.query(`ALTER TABLE custom_size_requests ADD COLUMN IF NOT EXISTS additional_charges NUMERIC(12, 2) DEFAULT 0 CHECK (additional_charges IS NULL OR additional_charges >= 0)`);
    await pool.query(`ALTER TABLE custom_size_requests ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT`);
    await pool.query(`ALTER TABLE custom_size_requests ADD COLUMN IF NOT EXISTS validity_date DATE`);
    await pool.query(`ALTER TABLE custom_size_requests ADD COLUMN IF NOT EXISTS reference_image TEXT`);
    await pool.query(`ALTER TABLE custom_size_requests ADD COLUMN IF NOT EXISTS customer_rejection_reason TEXT`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_size_request_history (
        id BIGSERIAL PRIMARY KEY,
        request_id BIGINT NOT NULL REFERENCES custom_size_requests(id) ON DELETE CASCADE,
        from_status TEXT,
        to_status TEXT NOT NULL,
        action_by_type TEXT NOT NULL CHECK (action_by_type IN ('customer', 'admin', 'system')),
        action_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action_by_name TEXT,
        remarks TEXT,
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_csr_history_request ON custom_size_request_history(request_id, created_at ASC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS custom_size_requests_customer_created_idx ON custom_size_requests (customer_id, created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS custom_size_requests_status_created_idx ON custom_size_requests (status, created_at DESC)`);
  } catch (error) {
    console.warn("Warning: Custom size request schema setup skipped:", (error as Error).message);
  }
  // Always start the server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

void startServer();
