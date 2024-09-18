-- migrate:up
drop view threads;

create materialized view threads as
with recursive thread_cte as (
  select
    id as thread_id,
    id as message_id
  from
    messages
  where
    in_reply_to is null

  union all

  select
    t.thread_id,
    m.id
  from
    messages m
  join
    thread_cte t ON m.in_reply_to = t.message_id
)
select
  thread_id,
  message_id
from
  thread_cte;
create index idx_threads_thread_id on threads (thread_id);
refresh materialized view threads;

-- migrate:down
drop view threads;
create recursive view threads (
  thread_id,
  message_id
) as (
  select
    id,
    id
  from
    messages
  where
    in_reply_to is null

  union all

  select
    t.thread_id,
    m.id
  from messages m
  join threads t
  on m.in_reply_to = t.message_id
);