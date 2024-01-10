import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Docs {
  body: string;
  bodyTsvector: Generated<string | null>;
  branch: string;
  id: Generated<number>;
  path: string;
  title: string;
}

export interface DocsChunks {
  chunkContent: string;
  docId: number;
  id: Generated<number>;
  ordinality: number;
}

export interface Messages {
  body: string;
  bodyEmbedding: number[] | null;
  bodyTsvector: Generated<string | null>;
  cc: string[];
  from: string;
  id: string;
  inReplyTo: string | null;
  lists: string[];
  subject: string;
  to: string[];
  ts: Timestamp;
}

export interface MessagesScrapeErrors {
  id: string;
  idEmbedding: number[] | null;
  idEmbeddingV2: number[] | null;
}

export interface MessagesScrapeLogs {
  completedAt: Generated<Timestamp>;
  date: string;
  dateEmbedding: number[] | null;
  dateEmbeddingV2: number[] | null;
  list: string;
}

export interface SchemaMigrations {
  version: string;
}

export interface Threads {
  messageId: string | null;
  threadId: string | null;
}

export interface DB {
  docs: Docs;
  docsChunks: DocsChunks;
  messages: Messages;
  messagesScrapeErrors: MessagesScrapeErrors;
  messagesScrapeLogs: MessagesScrapeLogs;
  schemaMigrations: SchemaMigrations;
  threads: Threads;
}
