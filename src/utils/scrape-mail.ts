require('dotenv').config({ path: '.env.local' });
import { promises as fs } from 'fs';
import { simpleParser } from 'mailparser';
import { CamelCasePlugin, Kysely, PostgresDialect, sql } from 'kysely';
import { DB } from '@/clients/db-types';
import { Pool } from 'pg';

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});

const LISTS = [
  'pgsql-general',
  // 'pgsql-interfaces',
  // 'pgsql-novice',
  // 'pgsql-performance',
  // 'pgsql-sql',
  // 'pgsql-docs',
  // 'pgsql-hackers',
];

function splitText(text: string) {
  const emailStartPattern = /^From\s+\S+@lists\.postgresql\.org.*20\d{2}$/gm;

  // Array to store the split emails
  let emails = [];

  // Find all email start positions
  const emailStartMatches = [
    ...text.matchAll(emailStartPattern),
    { index: text.length },
  ];

  // Loop through the matches and split the text
  for (let i = 0; i < emailStartMatches.length - 1; i++) {
    let startIndex = emailStartMatches[i].index!;
    let endIndex = emailStartMatches[i + 1].index!;
    emails.push(text.substring(startIndex, endIndex).trim());
  }

  return emails;
}

async function parseMessage(list: string, text: string) {
  const parsed = await simpleParser(text);

  const id = parsed.messageId!;
  const subject = parsed.subject!;
  const body = parsed.text;
  const html = parsed.html || null;
  const fromAddress = parsed.from!.value[0].address!;
  const fromName = parsed.from!.value[0].name!;
  const ts = parsed.date!;
  const parsedTo = parsed.to!;
  const parsedToList = Array.isArray(parsedTo)
    ? parsedTo.map((ao) => ao.value).flat()
    : parsedTo?.value || [];
  const toAddresses = parsedToList.map((a) => a.address!);
  const toNames = parsedToList.map((a) => a.name!);
  const parsedCc = parsed.cc!;
  const parsedCcList = Array.isArray(parsedCc)
    ? parsedCc.map((ao) => ao.value).flat()
    : parsedCc?.value || [];
  const ccAddresses = parsedCcList.map((a) => a.address!);
  const ccNames = parsedCcList.map((a) => a.name!);
  const inReplyTo = parsed.inReplyTo;

  return {
    id,
    lists: [list],
    toAddresses,
    toNames,
    subject,
    body,
    html,
    ts,
    fromAddress,
    fromName,
    ccAddresses,
    ccNames,
    inReplyTo,
  };
}

async function parseMessages(list: string, text: string) {
  const texts = splitText(text);
  return await Promise.all(texts.map((t) => parseMessage(list, t)));
}

async function fetchListDateMessages(list: string, date: string) {
  const file = `./data/${list}/${list}.${date}`;

  const text = await fs.readFile(file, 'utf8');
  const messages = await parseMessages(list, text);

  // Insert messages
  await db
    .insertInto('messages')
    .values(messages)
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        lists: sql`array_cat(messages.lists, EXCLUDED.lists)`,
      }))
    )
    .execute();

  // Insert list and date into cache so we don't fetch it again
  await db.insertInto('messagesLogs').values({ list, date }).execute();

  return messages.length;
}

async function listFilesInDirectory(directory: string) {
  try {
    const directoryExists = await fs
      .stat(directory)
      .then((stats) => stats.isDirectory())
      .catch(() => false);

    if (!directoryExists) {
      console.log(`Directory "${directory}" does not exist.`);
      return [];
    }

    const files = await fs.readdir(directory);
    return files;
  } catch (error) {
    console.error('Error reading the directory:', error);
    return [];
  }
}

export async function fetchListMessages(list: string) {
  const attemptedDates = await db
    .selectFrom('messagesLogs')
    .where('list', '=', list)
    .select('date')
    .execute()
    .then((rows) => rows.map((row) => row.date));

  const availableDates = await listFilesInDirectory('./data/' + list).then(
    (files) => files.map((file) => file.split('.')[1])
  );

  const dates = availableDates.filter((date) => !attemptedDates.includes(date));

  for (const date of dates) {
    console.log(`Fetching messages for ${list} on ${date}`);
    const count = await fetchListDateMessages(list, date);
    console.log(`Fetched ${count} messages for ${list} on ${date}`);
  }
}

async function fetchMessages() {
  for (const list of LISTS) {
    console.log(`Fetching messages for ${list}`);
    await fetchListMessages(list);
    console.log(`Fetched messages for ${list}`);
  }
}

fetchMessages();
