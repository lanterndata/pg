-- migrate:up

create table scrape_logs (
  list text,
  date text,
  completed_at timestamptz not null default now(),
  primary key (list, date)
);

create table messages (
  id text primary key,
  lists text[],
  in_reply_to text,
  ts timestamptz,
  subject text,
  body text,
  "from" text,
  "to" text[],
  cc text[]
);

create table error_messages (
  id text primary key
);

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

drop table scrape_logs;
drop table messages;
drop view threads;