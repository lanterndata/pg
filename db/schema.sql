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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: lantern; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS lantern WITH SCHEMA public;


--
-- Name: EXTENSION lantern; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION lantern IS 'Lantern: Fast vector embedding processing in Postgres';


--
-- Name: lantern_extras; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS lantern_extras WITH SCHEMA public;


--
-- Name: EXTENSION lantern_extras; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION lantern_extras IS 'lantern_extras:  Convenience functions for working with vector embeddings';


--
-- Name: notify_insert_lantern_daemon_35(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_insert_lantern_daemon_35() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
              BEGIN
                PERFORM pg_notify('lantern_client_notifications_35', NEW.id::TEXT || ':' || '35');
                RETURN NULL;
              END;
            $$;


--
-- Name: notify_insert_lantern_daemon_36(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_insert_lantern_daemon_36() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
              BEGIN
                PERFORM pg_notify('lantern_client_notifications_36', NEW.id::TEXT || ':' || '36');
                RETURN NULL;
              END;
            $$;


--
-- Name: notify_insert_lantern_daemon_37(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_insert_lantern_daemon_37() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
              BEGIN
                PERFORM pg_notify('lantern_client_notifications_37', NEW.id::TEXT || ':' || '37');
                RETURN NULL;
              END;
            $$;


--
-- Name: notify_insert_lantern_daemon_38(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_insert_lantern_daemon_38() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
              BEGIN
                PERFORM pg_notify('lantern_client_notifications_38', NEW.id::TEXT || ':' || '38');
                RETURN NULL;
              END;
            $$;


--
-- Name: notify_insert_lantern_daemon_41(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_insert_lantern_daemon_41() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
              BEGIN
                PERFORM pg_notify('lantern_client_notifications_41', NEW.id::TEXT || ':' || '41');
                RETURN NULL;
              END;
            $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: docs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.docs (
    id integer NOT NULL,
    branch text NOT NULL,
    path text NOT NULL,
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
    lists text[] NOT NULL,
    in_reply_to text,
    ts timestamp with time zone NOT NULL,
    subject text NOT NULL,
    "from" text NOT NULL,
    "to" text[] NOT NULL,
    cc text[] NOT NULL,
    body text NOT NULL,
    body_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, COALESCE(body, ''::text))) STORED,
    body_embedding real[]
);


--
-- Name: messages_scrape_errors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages_scrape_errors (
    id text NOT NULL,
    id_embedding real[],
    id_embedding_v2 real[]
);


--
-- Name: messages_scrape_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages_scrape_logs (
    list text NOT NULL,
    date text NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL,
    date_embedding real[],
    date_embedding_v2 real[]
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
-- Name: messages_scrape_errors error_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_scrape_errors
    ADD CONSTRAINT error_messages_pkey PRIMARY KEY (id);


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
-- Name: messages_scrape_logs scrape_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages_scrape_logs
    ADD CONSTRAINT scrape_logs_pkey PRIMARY KEY (list, date);


--
-- Name: body_textsearch_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX body_textsearch_idx ON public.messages USING gin (body_tsvector);


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
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20231207224009'),
    ('20231210004626'),
    ('20231212004442');
