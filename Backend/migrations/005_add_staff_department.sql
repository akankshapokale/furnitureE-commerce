-- Stores a furniture-business department for dashboard staff records.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS department TEXT;
