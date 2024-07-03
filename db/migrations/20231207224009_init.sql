-- migrate:up

create table messages_logs (
  list text not null,
  date text not null,
  primary key (list, date)
);

create table messages (
  id text primary key,
  lists text[],
  in_reply_to text,
  ts timestamptz not null,
  subject text not null,
  body text not null,
  body_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(body, ''))) STORED,
  from_address text not null,
  from_name text not null,
  to_addresses text[] not null,
  to_names text[] not null,
  cc_addresses text[] not null,
  cc_names text[] not null
);
create index idx_messages_ts on messages(ts);
create index idx_messages_in_reply_to on messages(in_reply_to);
create index idx_messages_lists on messages using gin(lists);
create index idx_messages_body_tsvector on messages using gin(body_tsvector);

create recursive view threads (
  thread_id,
  message_id
) as (
  -- Base case: messages without a parent (in_reply_to is NULL)
  select
    id,
    id
  from
    messages
  where
    in_reply_to is null

  union all

  -- Recursive case: messages that are replies to other messages
  select
    t.thread_id,
    m.id
  from messages m
  join threads t
  on m.in_reply_to = t.message_id
);

-- migrate:down

drop table messages;
drop view threads;