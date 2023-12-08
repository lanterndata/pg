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
  ts timestamptz not null,
  subject text not null,
  body text not null,
  "from" text not null,
  "to" text[] not null,
  cc text[] not null
);
create index idx_messages_ts on messages(ts);
create index idx_messages_in_reply_to on messages(in_reply_to);
create index idx_messages_lists on messages using gin(lists);

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