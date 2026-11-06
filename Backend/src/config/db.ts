import dotenv from "dotenv";
dotenv.config({ override: process.env.NODE_ENV !== "production" });

import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Aiven (and most hosted Postgres) requires SSL
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,

  // Connection pool settings (keep small on serverless to stay under the DB connection limit)
  max: process.env.VERCEL ? 2 : 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export { pool };