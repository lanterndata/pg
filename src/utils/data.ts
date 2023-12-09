'use server';
import db from '@/clients/db';

function parseNameFromString(nameAndEmail: string) {
  const regex = /([A-Za-z\s]+)\s*</;
  const match = nameAndEmail.match(regex);
  if (match) return match[1].trim();
  return nameAndEmail;
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

export async function searchThreads(query: string) {
  return [];
}
