export type FontType = 'source-sans-3' | 'ibm-plex-mono';

export type SortByType = 'default' | 'vector search' | 'Postgres FTS';

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
