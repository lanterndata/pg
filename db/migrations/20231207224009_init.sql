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
  in_reply_to text references messages(id),
  ts timestamptz,
  subject text,
  "from" text,
  "to" text[],
  cc text[]
);

-- migrate:down

drop table scrape_logs;
drop table messages;