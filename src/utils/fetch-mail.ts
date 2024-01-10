'use server';
import db from '@/clients/db';
import { sql } from 'kysely';

function parseNameFromString(nameAndEmail: string) {
  const regex = /(.+?)\s*(?:<.+>)?$/;
  const match = nameAndEmail.match(regex);
  return match ? match[1].replace(/"/g, '') : '';
}

async function getThreadsFromThreadIds(threadIds: string[]) {
  if (threadIds.length === 0) {
    return [];
  }
  const counts = await db
    .selectFrom('threads')
    .select('threadId')
    .select((eb) => eb.fn.count('messageId').as('count'))
    .where('threadId', 'in', threadIds)
    .groupBy('threadId')
    .execute();
  const messageIds = counts.map((count) => count.threadId);
  const messages = await db
    .selectFrom('messages')
    .selectAll()
    .where('id', 'in', messageIds)
    .orderBy('ts', 'desc')
    .execute();
  return messages.map((message) => ({
    ...message,
    from: parseNameFromString(message.from),
    count:
      (counts.find((count) => count.threadId === message.id)
        ?.count as number) || 1,
  }));
}

export async function getThreads(list: string, page: number) {
  const threadIds = await db
    .selectFrom('messages')
    .select('id')
    .where('inReplyTo', 'is', null)
    .where((eb) => eb(eb.val(list), '=', eb.fn.any('lists')))
    .orderBy('ts', 'desc')
    .offset(page * 20)
    .limit(20)
    .execute()
    .then((rows) => rows.map((row) => row.id));
  return await getThreadsFromThreadIds(threadIds);
}

export async function getThreadMessages(threadId: string) {
  const messageIds = await db
    .selectFrom('threads')
    .select('messageId')
    .where('threadId', '=', threadId)
    .execute()
    .then((rows) => rows.map((row) => row.messageId));
  const messages = await db
    .selectFrom('messages')
    .selectAll()
    .where('id', 'in', messageIds)
    .execute();
  return messages;
}

async function getThreadsFromMessageIds(messageIds: string[]) {
  if (messageIds.length === 0) {
    return [];
  }
  const counts = await db
    .selectFrom('threads')
    .select('threadId')
    .select((eb) => eb.fn.count('messageId').as('count'))
    .where('messageId', 'in', messageIds)
    .groupBy('threadId')
    .execute();
  const threadIds = counts.map((count) => count.threadId);
  const threads = await db
    .selectFrom('messages')
    .select(['id', 'subject', 'ts', 'from'])
    .where('id', 'in', threadIds)
    .orderBy('ts', 'desc')
    .execute();
  return threads.map((thread) => ({
    ...thread,
    from: parseNameFromString(thread.from),
    count:
      (counts.find((count) => count.threadId === thread.id)?.count as number) ||
      1,
  }));
}

// Vector search
export async function searchThreadsVector(
  query: string,
  orderBy: 'relevance' | 'latest'
) {
  const score = sql`cos_dist(text_embedding('jinaai/jina-embeddings-v2-base-en', ${query}), body_embedding)`;
  const messageIdsAndScores = await db
    .selectFrom('messages')
    .select(['id', score.as('score')])
    .orderBy(
      sql`text_embedding('jinaai/jina-embeddings-v2-base-en', ${query}) <=> body_embedding`
    )
    .limit(20)
    .execute();
  const messageIds = messageIdsAndScores.map((row) => row.id);
  const messages = await getThreadsFromMessageIds(messageIds);
  const messagesWithScores = messages
    .map((message) => ({
      ...message,
      score: messageIdsAndScores.find((row) => row.id === message.id)?.score,
    }))
    .sort((a, b) => (a.score as number) - (b.score as number));
  return messagesWithScores;
}

async function getThreadsFromMessageIdAndPreviews(
  messageIdsAndPreviews: { id: string; preview: string }[]
) {
  if (messageIdsAndPreviews.length === 0) {
    return [];
  }

  const messageIds = messageIdsAndPreviews.map((row) => row.id);
  const threadData = await db
    .selectFrom('threads')
    .select('threadId')
    .select((eb) => eb.fn.agg('array_agg', ['messageId']).as('messageIds'))
    .select((eb) => eb.fn.count('messageId').as('count'))
    .where('messageId', 'in', messageIds)
    .groupBy('threadId')
    .execute();

  const messageIdToPreview = messageIdsAndPreviews.reduce((acc, row) => {
    acc[row.id] = row.preview;
    return acc;
  }, {} as Record<string, string>);

  const threadIds = threadData.map((data) => data.threadId);
  const threads = await db
    .selectFrom('messages')
    .select(['id', 'subject', 'ts', 'from'])
    .where('id', 'in', threadIds)
    .orderBy('ts', 'desc')
    .execute();
  return threads.map((thread) => {
    const otherThreadData = threadData.find(
      (data) => data.threadId === thread.id
    )!;

    const count = (otherThreadData.count as number) || 1;

    // preview is the first preview we can find
    const preview = (otherThreadData.messageIds as string[])
      .map((messageId) => messageIdToPreview[messageId])
      .find((preview) => preview);

    return {
      ...thread,
      from: parseNameFromString(thread.from),
      count,
      preview,
    };
  });
}

// Text search
export async function searchThreadsText(
  query: string,
  orderBy: 'relevance' | 'latest'
) {
  const querySql = sql`ts_headline('english', body, plainto_tsquery('english', ${query}))`;
  const messageIdAndPreviews = await db
    .selectFrom('messages')
    .select('id')
    .select(querySql.as('preview'))
    .where(sql`body_tsvector @@ plainto_tsquery('english', ${query})`)
    .orderBy('ts', 'desc')
    .limit(20)
    .execute();
  return await getThreadsFromMessageIdAndPreviews(messageIdAndPreviews as any);
}
