-- ═════════════════════════════════════════════════════════════
-- STUDIODESK — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor → New Query → Run
-- ══════════════════════════════════════════════════════════════

-- ── 1. STUDIOS ───────────────────────────────────────────────────
CREATE TABLE studios (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  owner_email        TEXT NOT NULL,
  owner_phone        TEXT,
  address            TEXT,
  timezone           TEXT DEFAULT 'Australia/Sydney',
  booking_slug       TEXT UNIQUE,  -- e.g. "willow-vine" for studiodesk.store/book/willow-vine
  unlocked           BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. STUDIO HOURS (weekly recurring) ─────────────────────────
CREATE TABLE studio_hours (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id    UUID REFERENCES studios(id) ON DELETE CASCADE,
  day_of_week  TEXT NOT NULL CHECK (day_of_week IN ('mon','tue','wed','thu','fri','sat','sun')),
  open_time    TIME,
  close_time   TIME,
  closed       BOOLEAN DEFAULT FALSE
);

-- ── 3. INSTRUCTORS ────────────────────────────────────────────────
CREATE TABLE instructors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id   UUID REFERENCES studios(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  bio         TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. SERVICES (classes & packages — this is the price list) ───
CREATE TABLE services (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id      UUID REFERENCES studios(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,       -- e.g. "Vinyasa Flow Yoga", "10-Class Pack"
  category       TEXT DEFAULT 'class', -- 'class' | 'package' | 'membership'
  duration_mins  INT,
  price          NUMERIC(10,2) NOT NULL,
  active         BOOLEAN DEFAULT TRUE,
  sort_order     INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. CLIENTS ────────────────────────────────────────────────────
CREATE TABLE clients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id   UUID REFERENCES studios(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  dob         DATE,
  notes       TEXT,          -- e.g. injuries, modifications, preferences
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. APPOINTMENTS — with double-booking protection ────────────
CREATE TABLE appointments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id         UUID REFERENCES studios(id) ON DELETE CASCADE,
  client_id         UUID REFERENCES clients(id) ON DELETE SET NULL,
  service_id        UUID REFERENCES services(id) ON DELETE SET NULL,
  instructor_id     UUID REFERENCES instructors(id) ON DELETE SET NULL,
  reference         TEXT UNIQUE NOT NULL,
  appointment_date  DATE NOT NULL,
  appointment_time  TIME NOT NULL,
  duration_mins     INT NOT NULL,
  price             NUMERIC(10,2) NOT NULL,
  service_name      TEXT NOT NULL,  -- denormalised snapshot at time of booking
  status            TEXT DEFAULT 'confirmed', -- 'confirmed' | 'cancelled' | 'completed'
  deposit_paid      BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (studio_id, instructor_id, appointment_date, appointment_time)
);

-- ── 7. TRANSACTIONS (income & expenses) ───────────────────────────
CREATE TABLE transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id   UUID REFERENCES studios(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('income','expense')),
  category    TEXT NOT NULL,   -- e.g. 'Class pack sold', 'Rent', 'Instructor pay'
  description TEXT,
  amount      NUMERIC(10,2) NOT NULL,
  receipt     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. STOCK ──────────────────────────────────────────────────────
CREATE TABLE stock_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id   UUID REFERENCES studios(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,   -- e.g. 'Yoga mats', 'Lavender candles'
  category    TEXT DEFAULT 'equipment', -- 'equipment' | 'retail'
  qty         INT DEFAULT 0,
  reorder_at  INT DEFAULT 0,
  unit        TEXT DEFAULT 'pcs',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. TO-DOS ─────────────────────────────────────────────────────
CREATE TABLE todos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id   UUID REFERENCES studios(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  done        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 10. BOOKING SETTINGS (deposit/bank details) ──────────────────
CREATE TABLE booking_settings (
  studio_id        UUID PRIMARY KEY REFERENCES studios(id) ON DELETE CASCADE,
  deposit_amount   NUMERIC(10,2) DEFAULT 0,
  bank_name        TEXT,
  bank_bsb         TEXT,
  bank_account     TEXT,
  confirmation_note TEXT,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;

-- Public can read active services/instructors/hours for the booking page
CREATE POLICY "public read services" ON services FOR SELECT USING (active = true);
CREATE POLICY "public read instructors" ON instructors FOR SELECT USING (active = true);
CREATE POLICY "public read studio_hours" ON studio_hours FOR SELECT USING (true);
CREATE POLICY "public read booking_settings" ON booking_settings FOR SELECT USING (true);

-- Public can insert an appointment (booking a class) and a matching client record
CREATE POLICY "public insert appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert clients" ON clients FOR INSERT WITH CHECK (true);

-- Everything else (owner dashboard: clients list, finances, stock, todos, full appointment management)
-- is served through the authenticated API routes (service role key), not directly from the browser.
