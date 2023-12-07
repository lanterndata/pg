-- migrate:up

create table lists (
    name text primary key,
    description text,
    category text
);

create table messages (
    id text primary key,
    list_name text references lists(name),
    in_reply_to text references messages(id),
    ts timestamptz,
    subject text,
    from_email text,
    from_name text
);

create table message_recipients (
    message_id text references messages(id),
    type text, -- to, cc, bcc
    email text,
    name text,
    primary key (message_id, type, email)
);
create index idx_message_recipients on message_recipients (message_id);

-- migrate:down

drop table lists;
drop table messages;
drop table message_recipients;