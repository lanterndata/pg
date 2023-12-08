import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface ErrorMessages {
  id: string;
}

export interface Messages {
  body: string | null;
  cc: string[] | null;
  from: string | null;
  id: string;
  inReplyTo: string | null;
  lists: string[] | null;
  subject: string | null;
  to: string[] | null;
  ts: Timestamp | null;
}

export interface SchemaMigrations {
  version: string;
}

export interface ScrapeLogs {
  completedAt: Generated<Timestamp>;
  date: string;
  list: string;
}

export interface DB {
  errorMessages: ErrorMessages;
  messages: Messages;
  schemaMigrations: SchemaMigrations;
  scrapeLogs: ScrapeLogs;
}
