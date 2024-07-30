export type SortByType =
  | 'default'
  | 'vector search'
  | 'Postgres FTS'
  | 'ElasticSearch';

export interface Thread {
  id: string;
  fromName: string;
  fromAddress: string;
  subject: string | null;
  ts: Date;
  lists: string[] | null;
  count: number;
  score?: number;
  preview?: string;
}
