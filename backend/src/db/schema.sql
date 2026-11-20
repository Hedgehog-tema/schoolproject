-- Taija Ruuhijärvi author site — database schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  newsletter_opt_in BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_image_url TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  published_date DATE,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders are *requests to buy*, not paid transactions (no online payment per spec).
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  book_id INTEGER NOT NULL REFERENCES books(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  shipping_address TEXT,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new | confirmed | shipped | cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  title TEXT UNIQUE NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  requires_login BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  source_url TEXT, -- optional link to an external article ("Lue koko juttu")
  source_label TEXT, -- optional display name for the external source, e.g. a newspaper's name
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT UNIQUE NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track which materials a logged-in user has unlocked/saved to "my library"
CREATE TABLE IF NOT EXISTS user_materials (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, material_id)
);

-- Safe to re-run: adds new columns to a database created before this file
-- introduced them (CREATE TABLE IF NOT EXISTS above won't add columns to an
-- already-existing table, so this does it separately).
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS source_label TEXT;

-- Self-healing for databases created before `materials.title` and
-- `gallery_images.image_url` had UNIQUE constraints (CREATE TABLE IF NOT
-- EXISTS above is a no-op on a table that already exists, so an old table
-- never got these constraints just by re-running this file). This removes
-- any duplicate rows that piled up and adds the missing constraints, so
-- seed.sql's ON CONFLICT clauses have something to match. Safe to re-run.
DELETE FROM materials m
USING materials m2
WHERE m.title = m2.title
  AND m.id > m2.id;

DELETE FROM gallery_images g
USING gallery_images g2
WHERE g.image_url = g2.image_url
  AND g.id > g2.id;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'materials_title_key'
  ) THEN
    ALTER TABLE materials ADD CONSTRAINT materials_title_key UNIQUE (title);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'gallery_images_image_url_key'
  ) THEN
    ALTER TABLE gallery_images ADD CONSTRAINT gallery_images_image_url_key UNIQUE (image_url);
  END IF;
END $$;
