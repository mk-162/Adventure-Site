-- Voice Tips Schema Enhancement
-- Adds new fields to comments table for the voice tips feature

-- Add new columns to comments table
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id INTEGER;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_name VARCHAR(255);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS waveform_data JSONB;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS moderation_reason TEXT;

-- Add index for parent_id (for future reply threads)
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);

-- Add index for votes (for top tips query)
CREATE INDEX IF NOT EXISTS comments_votes_idx ON comments(votes);

-- Self-referencing foreign key for parent_id (optional - only if you want strict referential integrity)
-- ALTER TABLE comments ADD CONSTRAINT comments_parent_id_fk FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;

COMMENT ON COLUMN comments.parent_id IS 'For reply threads - references parent comment id';
COMMENT ON COLUMN comments.title IS 'AI-generated or user-edited title for the tip';
COMMENT ON COLUMN comments.duration IS 'Audio duration in seconds';
COMMENT ON COLUMN comments.author_name IS 'Display name (null for anonymous)';
COMMENT ON COLUMN comments.author_avatar IS 'Avatar URL';
COMMENT ON COLUMN comments.waveform_data IS 'Array of waveform peaks for playback visualization';
COMMENT ON COLUMN comments.downvotes IS 'Number of downvotes';
COMMENT ON COLUMN comments.moderation_reason IS 'Reason if rejected or needs refinement';
