-- Adds employee profiles (designation + page permissions) to the users table.
-- Run once:  psql -U postgres -d furniture_database -f migrations/004_add_staff_access.sql
--
-- users.role is now one of: 'customer' | 'employee' | 'admin'.
-- users.permissions holds the dashboard page keys an employee has full access to
-- (see src/config/permissions.ts). Admins implicitly have access to every page.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS designation TEXT,
  ADD COLUMN IF NOT EXISTS permissions TEXT[] NOT NULL DEFAULT '{}';

-- In case an older schema restricted role to a fixed list that lacks 'employee'.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
