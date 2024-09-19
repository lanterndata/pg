require('dotenv').config({ path: '.env.local' });
import minimist from 'minimist';
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
  'pgsql-admin',
  'pgsql-announce',
  'pgsql-bugs',
  'pgsql-docs',
  'pgsql-general',
  'pgsql-hackers',
  'pgsql-novice',
  'pgsql-performance',
  'pgsql-sql',
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

function sanitize(text: string | undefined | null) {
  if (text) return text.replace(/\0/g, '');
  return text;
}

async function parseMessage(list: string, text: string) {
  const parsed = await simpleParser(text);
  try {
    const id = parsed.messageId!;
    const subject = parsed.subject!;
    const body = sanitize(parsed.text);
    const html = sanitize(parsed.html || null);
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
  } catch (e) {
    console.error(`Failed to parse message: ${JSON.stringify(text)}`);
    return null;
  }
}

async function parseMessages(list: string, text: string) {
  const texts = splitText(text);
  return await Promise.all(texts.map((t) => parseMessage(list, t))).then(
    (res) => res.filter((i) => i !== null)
  );
}

async function fetchListDateMessages(list: string, date: string) {
  const file = `./data/${list}/${list}.${date}`;

  const text = await fs.readFile(file, 'utf8');
  const sanitizedText = text.replace(/\0/g, ''); // Removes null bytes
  const messages = await parseMessages(list, sanitizedText);

  if (messages.length === 0) {
    return 0;
  }

  // Insert messages
  await db
    .insertInto('messages')
    .values(messages)
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        lists: sql`(
          SELECT array_agg(DISTINCT elem)
          FROM unnest(array_cat(messages.lists, EXCLUDED.lists)) AS elem
        )`,
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

async function fetchMonthMessages(month: string) {
  for (const list of LISTS) {
    console.log(`Fetching messages for ${list}`);
    const availableDates = await listFilesInDirectory('./data/' + list).then(
      (files) => files.map((file) => file.split('.')[1])
    );
    if (availableDates.includes(month)) {
      console.log(`Fetching messages for ${list} on ${month}`);
      const count = await fetchListDateMessages(list, month);
      console.log(`Fetched ${count} messages for ${list} on ${month}`);
    } else {
      console.log(`No messages found for ${list} on ${month}`);
    }
    console.log(`Fetched messages for ${list}`);
  }
}

async function fetchMessages() {
  for (const list of LISTS) {
    console.log(`Fetching messages for ${list}`);
    await fetchListMessages(list);
    console.log(`Fetched messages for ${list}`);
  }
}

async function updateMaterializedView() {
  await sql`REFRESH MATERIALIZED VIEW CONCURRENTLY threads;`.execute(db);
}

async function main() {
  const args = minimist(process.argv.slice(2));
  const month = args.m || args.month;
  if (month) {
    console.log(`Fetching messages for ${month}`);
    await fetchMonthMessages(month);
  } else {
    console.log('Fetching messages');
    await fetchMessages();
  }
  await updateMaterializedView();
}

main();
