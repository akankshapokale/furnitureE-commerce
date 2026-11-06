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
);

CREATE INDEX IF NOT EXISTS custom_size_requests_customer_created_idx
  ON custom_size_requests (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS custom_size_requests_status_created_idx
  ON custom_size_requests (status, created_at DESC);
