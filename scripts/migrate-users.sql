-- User accounts system migration
-- Run this against the Neon database

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  region_preference VARCHAR(100),
  newsletter_opt_in BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_favourites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  favourite_type VARCHAR(50) NOT NULL,
  favourite_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, favourite_type, favourite_id)
);

-- Index for fast favourite lookups
CREATE INDEX IF NOT EXISTS idx_user_favourites_user ON user_favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favourites_lookup ON user_favourites(user_id, favourite_type);
