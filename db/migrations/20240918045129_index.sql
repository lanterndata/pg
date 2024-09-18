-- migrate:up
CREATE INDEX idx_messages_in_reply_to_lists_ts ON messages (in_reply_to, ts DESC);

-- migrate:down
DROP INDEX idx_messages_in_reply_to_lists_ts;