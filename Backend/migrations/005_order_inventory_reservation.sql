-- Tracks whether a line item's stock was reserved so cancellation/deletion
-- restores only inventory changed by the transactional checkout flow.
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS inventory_deducted BOOLEAN NOT NULL DEFAULT FALSE;
