// Creates (or promotes) an admin account.
// Usage: npm run create-admin -- "Full Name" admin@example.com 9876543210 "StrongPassword"
import bcrypt from "bcrypt";
import { pool } from "../src/config/db";

const main = async () => {
  const [name, email, phone, password] = process.argv.slice(2);

  if (!name || !email || !password || password.length < 8) {
    console.error(
      'Usage: npm run create-admin -- "Full Name" email phone "Password (min 8 chars)"'
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await pool.query(
    "SELECT id FROM users WHERE LOWER(email) = $1",
    [email.toLowerCase()]
  );

  if (existing.rows.length > 0) {
    await pool.query(
      `UPDATE users
       SET role = 'admin', name = $1, phone = $2, password_hash = $3,
           is_active = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [name, phone || null, passwordHash, existing.rows[0].id]
    );
    console.log(`Updated existing user ${email} to admin.`);
  } else {
    await pool.query(
      `INSERT INTO users (name, email, phone, role, password_hash)
       VALUES ($1, $2, $3, 'admin', $4)`,
      [name, email.toLowerCase(), phone || null, passwordHash]
    );
    console.log(`Created admin ${email}.`);
  }

  await pool.end();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
