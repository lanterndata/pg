import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface ErrorMessages {
  id: string;
}

export interface Messages {
  body: string;
  cc: string[];
  from: string;
  id: string;
  inReplyTo: string | null;
  lists: string[];
  subject: string;
  to: string[];
  ts: Timestamp;
}

export interface SchemaMigrations {
  version: string;
}

export interface ScrapeLogs {
  completedAt: Generated<Timestamp>;
  date: string;
  list: string;
}

export interface Threads {
  messageId: string | null;
  threadId: string | null;
}

export interface DB {
  errorMessages: ErrorMessages;
  messages: Messages;
  schemaMigrations: SchemaMigrations;
  scrapeLogs: ScrapeLogs;
  threads: Threads;
}
