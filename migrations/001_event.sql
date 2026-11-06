CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  fellowship TEXT,
  church_department TEXT,
  position TEXT,
  location TEXT,
  attendance_mode TEXT NOT NULL DEFAULT 'Physical',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)