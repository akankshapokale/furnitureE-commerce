-- Adds Google sign-in support to the users table.
-- Run once:  psql -U postgres -d furniture_database -f migrations/001_add_google_auth.sql

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS google_id     TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url    TEXT,
  ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'local';

-- Google-only accounts have no password.
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_google_id_key
  ON users (google_id)
  WHERE google_id IS NOT NULL;
