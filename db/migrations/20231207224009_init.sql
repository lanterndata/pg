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

-- migrate:down

drop table scrape_logs;
drop table messages;