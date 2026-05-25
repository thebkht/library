CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author JSONB NOT NULL,
  genre JSONB NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('Hardcover', 'Paperback', 'Trade Paperback', 'Mass Market', 'Other')),
  image TEXT NOT NULL,
  date_added DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS books_format_idx ON books (format);
CREATE INDEX IF NOT EXISTS books_date_added_idx ON books (date_added DESC);
