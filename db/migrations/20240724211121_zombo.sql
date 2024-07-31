-- migrate:up

create type messages_idx_type as (
  id text,
  lists varchar[],
  subject zdb.fulltext,
  html zdb.fulltext,
  body zdb.fulltext,
  from_address varchar,
  from_name varchar,
  to_addresses varchar[],
  to_names varchar[],
  cc_addresses varchar[],
  cc_names varchar[]
);

create function messages_idx_func(messages) returns messages_idx_type immutable strict language sql as $$
  select row(
    $1.id,
    $1.lists,
    $1.subject,
    $1.html,
    $1.body,
    $1.from_address,
    $1.from_name,
    $1.to_addresses,
    $1.to_names,
    $1.cc_addresses,
    $1.cc_names
  )::messages_idx_type;
$$;

create index idxmessages on messages using zombodb ((messages_idx_func(messages.*))) with (url='http://elastic:9200/');

-- migrate:down

drop index idxmessages;
drop function messages_idx_func(messages);
drop type messages_idx_type;