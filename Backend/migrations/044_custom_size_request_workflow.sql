-- Migration 044: Enhance Custom Size Requests with Quotation Details, Reference Image, and Status History

ALTER TABLE custom_size_requests
  ADD COLUMN IF NOT EXISTS additional_charges NUMERIC(12, 2) DEFAULT 0 CHECK (additional_charges IS NULL OR additional_charges >= 0),
  ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT,
  ADD COLUMN IF NOT EXISTS validity_date DATE,
  ADD COLUMN IF NOT EXISTS reference_image TEXT,
  ADD COLUMN IF NOT EXISTS customer_rejection_reason TEXT;

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
);

CREATE INDEX IF NOT EXISTS idx_csr_history_request
  ON custom_size_request_history(request_id, created_at ASC);

-- Seed history for existing rows if history is empty
INSERT INTO custom_size_request_history (request_id, from_status, to_status, action_by_type, action_by_name, remarks, created_at)
SELECT id, NULL, 'Pending', 'customer', customer_name, 'Request submitted with custom dimensions', created_at
FROM custom_size_requests
WHERE id NOT IN (SELECT DISTINCT request_id FROM custom_size_request_history);

