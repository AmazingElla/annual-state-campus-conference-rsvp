ALTER TABLE contributions ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS donor_category TEXT;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS will_attend TEXT;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS verified_by TEXT;
CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS contributions_created_at_idx ON contributions(created_at DESC);