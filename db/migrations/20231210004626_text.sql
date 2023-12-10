-- migrate:up
ALTER TABLE messages ADD COLUMN body_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(body, ''))) STORED;
CREATE INDEX body_textsearch_idx ON messages USING GIN (body_tsvector);

-- migrate:down
DROP INDEX IF EXISTS body_textsearch_idx;
ALTER TABLE messages DROP COLUMN IF EXISTS body_tsvector;