-- migrate:up

create table docs (
  id serial primary key,
  branch text not null,
  path text not null,
  title text not null,
  body text not null,
  body_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(body, ''))) STORED
);

create unique index docs_path_branch_idx on docs (path, branch);
create index docs_body_textsearch_idx on docs using GIN (body_tsvector);

create table docs_chunks (
  id serial primary key,
  doc_id integer not null references docs(id),
  ordinality integer not null,
  chunk_content text not null
);
create index docs_chunks_doc_id_idx on docs_chunks (doc_id);

-- migrate:down

drop table docs_chunks;
drop table docs;