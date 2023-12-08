import db from '@/clients/db';

function parseNameFromString(nameAndEmail: string) {
  const regex = /([A-Za-z\s]+)\s*</;
  const match = nameAndEmail.match(regex);
  if (match) return match[1].trim();
  return nameAndEmail;
}

export async function getThreads(list: string) {
  const threadIds = await db
    .selectFrom('messages')
    .select('id')
    .where('inReplyTo', 'is', null)
    .where((eb) => eb(eb.val(list), '=', eb.fn.any('lists')))
    .orderBy('ts', 'desc')
    .execute()
    .then((rows) => rows.map((row) => row.id));
  if (threadIds.length === 0) {
    return [];
  }
  const threads = await db
    .selectFrom('messages')
    .select(['id', 'subject', 'ts', 'from'])
    .where('id', 'in', threadIds)
    .orderBy('ts', 'desc')
    .execute();
  return threads.map((thread) => ({
    ...thread,
    from: parseNameFromString(thread.from),
  }));
}
