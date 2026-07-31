-- Deliva — full database schema.
-- Safe to run once, in full, against a fresh Postgres database (e.g. a new
-- Neon project). Every statement is idempotent (IF NOT EXISTS / OR REPLACE
-- equivalents) so re-running it after a partial failure is safe.
--
-- See apps/web/INSTALL.md for how to run this (Neon SQL Editor, or `psql`).

-- ── Auth.js tables ──────────────────────────────────────────────
-- Column names/casing here are load-bearing: both src/auth.js and
-- __create/adapter.ts hand-write SQL against these exact identifiers.
CREATE TABLE IF NOT EXISTS auth_users (
  id              SERIAL PRIMARY KEY,
  name            TEXT,
  email           TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image           TEXT,
  role            TEXT NOT NULL DEFAULT 'customer'
                    CHECK (role IN ('customer', 'rider', 'admin', 'super_admin')),
  phone           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth_accounts (
  id                  SERIAL PRIMARY KEY,
  "userId"            INTEGER NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  type                TEXT NOT NULL,
  provider            TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  access_token        TEXT,
  expires_at          BIGINT,
  refresh_token       TEXT,
  id_token            TEXT,
  scope               TEXT,
  session_state       TEXT,
  token_type          TEXT,
  password            TEXT, -- only populated by the 'credentials' provider
  UNIQUE (provider, "providerAccountId")
);
CREATE INDEX IF NOT EXISTS idx_auth_accounts_userid ON auth_accounts ("userId");

CREATE TABLE IF NOT EXISTS auth_sessions (
  id             SERIAL PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId"       INTEGER NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  expires        TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_userid ON auth_sessions ("userId");

CREATE TABLE IF NOT EXISTS auth_verification_token (
  identifier TEXT NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  token      TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ── App tables ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS riders_profile (
  user_id        INTEGER PRIMARY KEY REFERENCES auth_users(id) ON DELETE CASCADE,
  vehicle_type   TEXT,
  license_number TEXT,
  earnings       NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_jobs     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS deliveries (
  id               SERIAL PRIMARY KEY,
  customer_id      INTEGER REFERENCES auth_users(id) ON DELETE SET NULL,
  rider_id         INTEGER REFERENCES auth_users(id) ON DELETE SET NULL,
  sender_name      TEXT NOT NULL,
  sender_phone     TEXT NOT NULL,
  receiver_name    TEXT NOT NULL,
  receiver_phone   TEXT NOT NULL,
  pickup_address   TEXT NOT NULL,
  pickup_lat       DOUBLE PRECISION,
  pickup_lng       DOUBLE PRECISION,
  delivery_address TEXT NOT NULL,
  delivery_lat     DOUBLE PRECISION,
  delivery_lng     DOUBLE PRECISION,
  package_type     TEXT,
  weight           NUMERIC(8, 2),
  priority         TEXT DEFAULT 'Normal',
  cost             NUMERIC(12, 2) NOT NULL DEFAULT 0,
  notes            TEXT,
  tracking_id      TEXT NOT NULL UNIQUE,
  status           TEXT NOT NULL DEFAULT 'Pending'
                     CHECK (status IN ('Pending', 'Accepted', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled')),
  -- Payment step of the booking flow. Values written by the app:
  --   payment_method: 'Card' | 'Bank Transfer' | 'Cash on Delivery'
  --   payment_status: 'Paid' | 'Pay on Delivery' | 'Unpaid'
  payment_method   TEXT,
  payment_status   TEXT NOT NULL DEFAULT 'Unpaid',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Idempotent upgrade for databases created before the payment columns existed.
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'Unpaid';
CREATE INDEX IF NOT EXISTS idx_deliveries_customer_id ON deliveries (customer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_rider_id    ON deliveries (rider_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status      ON deliveries (status);
CREATE INDEX IF NOT EXISTS idx_deliveries_tracking_id ON deliveries (tracking_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at  ON deliveries (created_at DESC);

-- ── Customer messages: contact-form messages, delivery feedback, and
--    problem reports, unified in one table so the admin inbox and a
--    customer's "My Messages" view are both a single indexed query. ──
CREATE TABLE IF NOT EXISTS customer_messages (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES auth_users(id) ON DELETE SET NULL, -- null = anonymous contact-form submission
  delivery_id INTEGER REFERENCES deliveries(id) ON DELETE SET NULL,
  type        TEXT NOT NULL DEFAULT 'contact'
                CHECK (type IN ('contact', 'feedback', 'report')),
  name        TEXT,
  email       TEXT,
  subject     TEXT,
  message     TEXT NOT NULL,
  rating      SMALLINT CHECK (rating BETWEEN 1 AND 5), -- 'feedback' only
  status      TEXT NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'resolved')),
  admin_reply TEXT,
  replied_by  INTEGER REFERENCES auth_users(id) ON DELETE SET NULL,
  replied_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_customer_messages_customer_id ON customer_messages (customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_messages_status      ON customer_messages (status);
CREATE INDEX IF NOT EXISTS idx_customer_messages_type        ON customer_messages (type);
CREATE INDEX IF NOT EXISTS idx_customer_messages_created_at  ON customer_messages (created_at DESC);
