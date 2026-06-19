ALTER TABLE villas ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE villas ADD COLUMN featured_categories TEXT;
ALTER TABLE villas ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;
