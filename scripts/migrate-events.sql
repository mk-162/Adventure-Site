-- Migration for Events System Upgrades
-- Run this manually or via your migration tool

-- 1. Add new columns to 'events' table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS hero_image text,
ADD COLUMN IF NOT EXISTS image_gallery jsonb,
ADD COLUMN IF NOT EXISTS category varchar(100),
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS recurring_schedule varchar(255),
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_promoted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promoted_until timestamp,
ADD COLUMN IF NOT EXISTS operator_id integer REFERENCES operators(id),
ADD COLUMN IF NOT EXISTS external_source varchar(100),
ADD COLUMN IF NOT EXISTS external_id varchar(255),
ADD COLUMN IF NOT EXISTS external_url text,
ADD COLUMN IF NOT EXISTS ticket_url text,
ADD COLUMN IF NOT EXISTS difficulty varchar(50),
ADD COLUMN IF NOT EXISTS age_range varchar(100);

-- 2. Create 'event_saves' table
CREATE TABLE IF NOT EXISTS event_saves (
  id serial PRIMARY KEY,
  event_id integer NOT NULL REFERENCES events(id),
  session_id varchar(255) NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  CONSTRAINT unique_event_save UNIQUE (event_id, session_id)
);
