-- Adds the delivery-address columns written by updateUser (userController.ts).
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS pincode  VARCHAR(10),
  ADD COLUMN IF NOT EXISTS flat     TEXT,
  ADD COLUMN IF NOT EXISTS area     TEXT,
  ADD COLUMN IF NOT EXISTS landmark TEXT,
  ADD COLUMN IF NOT EXISTS city     VARCHAR(100),
  ADD COLUMN IF NOT EXISTS state    VARCHAR(100);
