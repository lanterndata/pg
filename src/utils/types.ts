export type SortByType = 'default' | 'vector' | 'text';

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
