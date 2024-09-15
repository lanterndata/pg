SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: lantern; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS lantern WITH SCHEMA public;


--
-- Name: EXTENSION lantern; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION lantern IS 'Lantern: Fast vector embedding processing in Postgres';


--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: lantern_extras; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS lantern_extras WITH SCHEMA public;


--
-- Name: EXTENSION lantern_extras; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION lantern_extras IS 'lantern_extras:  Convenience functions for working with vector embeddings';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


--
-- Name: log_create_index_end(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_create_index_end() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- update exactly one row.
    -- ensures that if identical index creation commands are run concurrently, each one will get a separate timing entry
    -- Note: there is a chance that their start and end times will be swapped.
    UPDATE _create_index_logs
    SET finished_at = clock_timestamp()
    WHERE txid = txid_current()
      AND command = current_query()
      AND finished_at IS NULL
      AND ctid = (
        SELECT ctid
        FROM _create_index_logs
        WHERE txid = txid_current()
          AND command = current_query()
          AND finished_at IS NULL
        ORDER BY ctid -- or another unique/primary key column if you prefer
        LIMIT 1
      );

END;
$$;


--
-- Name: log_create_index_start(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_create_index_start() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO _create_index_logs(txid, command, started_at) VALUES (txid_current(), current_query(), clock_timestamp());
END;
$$;


--
-- Name: setup_new_user_and_db(text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.setup_new_user_and_db(p_user_name text, p_password text, p_new_db_name text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    existing_schema_name TEXT;
BEGIN
    -- Step 1: Create new user
    EXECUTE format('CREATE USER %I WITH PASSWORD %L', p_user_name, p_password);
    EXECUTE format('ALTER USER %I WITH CONNECTION LIMIT 10', p_user_name);

    -- Step 2: Revoke all privileges from all schemas for the new user
    FOR existing_schema_name IN (SELECT schema_name FROM information_schema.schemata)
    LOOP
        EXECUTE format('REVOKE ALL PRIVILEGES ON SCHEMA %I FROM %I', existing_schema_name, p_user_name);
        EXECUTE format('REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA %I FROM %I', existing_schema_name, p_user_name);
        EXECUTE format('REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA %I FROM %I', existing_schema_name, p_user_name);
        EXECUTE format('REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA %I FROM %I', existing_schema_name, p_user_name);
    END LOOP;


    -- Step 3: Revoke select on pg_database from the new user
    EXECUTE format('REVOKE SELECT ON pg_database FROM %I', p_user_name);

    -- Step 4: Grant connect permission to new database to the new user
    EXECUTE format('REVOKE CONNECT ON DATABASE %I FROM PUBLIC', p_new_db_name);
    EXECUTE format('GRANT ALL PRIVILEGES ON DATABASE %I TO %I', p_new_db_name, p_user_name);

    -- Step 5: Grant privileges on lantern config parameters to the new user
    EXECUTE format('GRANT SET ON PARAMETER lantern_extras.cohere_token TO %I', p_user_name);
    EXECUTE format('GRANT SET ON PARAMETER lantern_extras.openai_token TO %I', p_user_name);
    EXECUTE format('GRANT SET ON PARAMETER lantern_extras.openai_deployment_url TO %I', p_user_name);
    EXECUTE format('GRANT SET ON PARAMETER lantern_extras.openai_azure_api_token TO %I', p_user_name);
    EXECUTE format('GRANT SET ON PARAMETER lantern_extras.openai_azure_entra_token TO %I', p_user_name);
    EXECUTE format('GRANT EXECUTE ON FUNCTION pg_reload_conf() TO %I', p_user_name);

    -- Step 6: Set owner of the database to the new user
    -- this is necessary because, per PostgreSQL 15 changelog announcement (https://www.postgresql.org/about/news/postgresql-15-released-2526://www.postgresql.org/about/news/postgresql-15-released-2526/)
    -- > PostgreSQL 15 also revokes the CREATE permission from all users except a database owner from the public (or default) schema.

    -- All the subsequent versions of PostgreSQL also have this behavior.
    EXECUTE format('ALTER DATABASE %I OWNER TO %I', p_new_db_name, p_user_name);

END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _create_index_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._create_index_logs (
    txid integer,
    command text,
    started_at timestamp without time zone,
    finished_at timestamp without time zone
);


--
-- Name: docs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.docs (
    id integer NOT NULL,
    branch text NOT NULL,
    path text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    body_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, COALESCE(body, ''::text))) STORED
);


--
-- Name: docs_chunks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.docs_chunks (
    id integer NOT NULL,
    doc_id integer NOT NULL,
    ordinality integer NOT NULL,
    chunk_content text NOT NULL
);


--
-- Name: docs_chunks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.docs_chunks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: docs_chunks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.docs_chunks_id_seq OWNED BY public.docs_chunks.id;


--
-- Name: docs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.docs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: docs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.docs_id_seq OWNED BY public.docs.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id text NOT NULL,
    lists text[],
    in_reply_to text,
    ts timestamp with time zone NOT NULL,
    subject text,
    html text,
    body text,
    body_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, COALESCE(body, ''::text))) STORED,
    from_address text NOT NULL,
    from_name text NOT NULL,
    to_addresses text[] NOT NULL,
    to_names text[] NOT NULL,
    cc_addresses text[] NOT NULL,
    cc_names text[] NOT NULL
);


--
-- Name: messages_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages_logs (
    list text NOT NULL,
    date text NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: threads; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.threads AS
 WITH RECURSIVE threads(thread_id, message_id) AS (
         SELECT messages.id,
            messages.id
           FROM public.messages
          WHERE (messages.in_reply_to IS NULL)
        UNION ALL
         SELECT t.thread_id,
            m.id
           FROM (public.messages m
             JOIN threads t ON ((m.in_reply_to = t.message_id)))
        )
 SELECT threads.thread_id,
    threads.message_id
   FROM threads;


--
-- Name: docs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docs ALTER COLUMN id SET DEFAULT nextval('public.docs_id_seq'::regclass);


--
-- Name: docs_chunks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docs_chunks ALTER COLUMN id SET DEFAULT nextval('public.docs_chunks_id_seq'::regclass);


--
-- Name: docs_chunks docs_chunks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docs_chunks
    ADD CONSTRAINT docs_chunks_pkey PRIMARY KEY (id);


--
-- Name: docs docs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docs
    ADD CONSTRAINT docs_pkey PRIMARY KEY (id);


--
-- Name: messages_logs messages_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_logs
    ADD CONSTRAINT messages_logs_pkey PRIMARY KEY (list, date);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: docs_body_textsearch_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX docs_body_textsearch_idx ON public.docs USING gin (body_tsvector);


--
-- Name: docs_chunks_doc_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX docs_chunks_doc_id_idx ON public.docs_chunks USING btree (doc_id);


--
-- Name: docs_path_branch_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX docs_path_branch_idx ON public.docs USING btree (path, branch);


--
-- Name: idx_messages_body_tsvector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_body_tsvector ON public.messages USING gin (body_tsvector);


--
-- Name: idx_messages_in_reply_to; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_in_reply_to ON public.messages USING btree (in_reply_to);


--
-- Name: idx_messages_lists; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_lists ON public.messages USING gin (lists);


--
-- Name: idx_messages_ts; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_ts ON public.messages USING btree (ts);


--
-- Name: docs_chunks docs_chunks_doc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.docs_chunks
    ADD CONSTRAINT docs_chunks_doc_id_fkey FOREIGN KEY (doc_id) REFERENCES public.docs(id);


--
-- Name: job cron_job_policy; Type: POLICY; Schema: cron; Owner: -
--

CREATE POLICY cron_job_policy ON cron.job USING ((username = CURRENT_USER));


--
-- Name: job_run_details cron_job_run_details_policy; Type: POLICY; Schema: cron; Owner: -
--

CREATE POLICY cron_job_run_details_policy ON cron.job_run_details USING ((username = CURRENT_USER));


--
-- Name: job; Type: ROW SECURITY; Schema: cron; Owner: -
--

ALTER TABLE cron.job ENABLE ROW LEVEL SECURITY;

--
-- Name: job_run_details; Type: ROW SECURITY; Schema: cron; Owner: -
--

ALTER TABLE cron.job_run_details ENABLE ROW LEVEL SECURITY;

--
-- Name: tasks lantern_tasks_policy; Type: POLICY; Schema: lantern; Owner: -
--

CREATE POLICY lantern_tasks_policy ON lantern.tasks USING ((username = CURRENT_USER));


--
-- Name: tasks; Type: ROW SECURITY; Schema: lantern; Owner: -
--

ALTER TABLE lantern.tasks ENABLE ROW LEVEL SECURITY;

--
-- Name: trigger_on_create_index_end; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER trigger_on_create_index_end ON ddl_command_end
         WHEN TAG IN ('CREATE INDEX')
   EXECUTE FUNCTION public.log_create_index_end();


--
-- Name: trigger_on_create_index_start; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER trigger_on_create_index_start ON ddl_command_start
         WHEN TAG IN ('CREATE INDEX')
   EXECUTE FUNCTION public.log_create_index_start();


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20231207224009'),
    ('20231212004442'),
    ('20240131210318'),
    ('20240305210319'),
    ('20240827144120'),
    ('20240903002257');
