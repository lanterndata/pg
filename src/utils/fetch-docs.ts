'use server';
import db from '@/clients/db';
import { sql } from 'kysely';

export async function searchDocsVector(query: string) {
  const score = sql`cos_dist(text_embedding('jinaai/jina-embeddings-v2-base-en', ${query}), body_embedding)`;
  const docs = await db
    .selectFrom('docs')
    .select(score.as('score'))
    .select('id')
    .select('title')
    .orderBy(
      sql`text_embedding('jinaai/jina-embeddings-v2-base-en', ${query}) <=> body_embedding`
    )
    .limit(20)
    .execute();
  return docs;
}

export async function searchDocsText(query: string) {
  const querySql = sql`ts_headline('english', body, plainto_tsquery('english', ${query}))`;
  const docs = await db
    .selectFrom('docs')
    .select('id')
    .select('title')
    .select(querySql.as('preview'))
    .where(querySql, 'is not', null)
    .limit(100)
    .execute();
  return docs;
}
