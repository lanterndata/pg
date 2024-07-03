import db from '@/clients/db';
import axios from 'axios';
import { simpleParser } from 'mailparser';

const MIN_YEAR = 2024;
const MIN_MONTH = 7;

const MAX_YEAR = 2024;
const MAX_MONTH = 7;

const LISTS = [
  'pgsql-general',
  'pgsql-interfaces',
  'pgsql-novice',
  'pgsql-performance',
  'pgsql-sql',
  'pgsql-docs',
  'pgsql-hackers',
];

function splitText(text: string) {
  const emailStartPattern = /From\s[^@]+@lists\.postgresql\.org\s.+\s\d{4}/g;

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

async function parseMessage(text: string) {
  const parsed = await simpleParser(text);

  const id = parsed.messageId!;
  const subject = parsed.subject!;
  const body = parsed.text!;
  const fromAddress = parsed.from!.value[0].address!;
  const fromName = parsed.from!.value[0].name!;
  const ts = parsed.date!;
  const parsedTo = parsed.to!;
  const parsedToList = Array.isArray(parsedTo)
    ? parsedTo.map((ao) => ao.value).flat()
    : parsedTo.value;
  const toAddresses = parsedToList.map((a) => a.address!);
  const toNames = parsedToList.map((a) => a.name!);
  const parsedCc = parsed.cc!;
  const parsedCcList = Array.isArray(parsedCc)
    ? parsedCc.map((ao) => ao.value).flat()
    : parsedCc.value;
  const ccAddresses = parsedCcList.map((a) => a.address!);
  const ccNames = parsedCcList.map((a) => a.name!);
  const inReplyTo = parsed.inReplyTo;
  const lists = parsed.headerLines
    .filter((l) => l.key === 'list-Id')
    .map((l) => l.line.substring(9).split('.')[0].substring(1));

  return {
    id,
    lists,
    toAddresses,
    toNames,
    subject,
    body,
    ts,
    fromAddress,
    fromName,
    ccAddresses,
    ccNames,
    inReplyTo,
  };
}

async function parseMessages(text: string) {
  const texts = splitText(text);
  return await Promise.all(texts.map(parseMessage));
}

// Sample URL: https://www.postgresql.org/list/pgsql-general/mbox/pgsql-general.202407
async function fetchListDateMessages(list: string, date: string) {
  const url = `https://www.postgresql.org/list/${list}/mbox/${list}.${date}`;

  // Fetch data from URL
  const data: string = await axios.get(url).then((response) => response.data);

  // Parse messages from data
  const messages = await parseMessages(data);

  // Insert messages
  await db.insertInto('messages').values(messages).execute();

  // Insert list and date into cache so we don't fetch it again
  await db.insertInto('messagesLogs').values({ list, date }).execute();
}

async function fetchMissingListDates(list: string) {
  const attemptedDates = await db
    .selectFrom('messagesLogs')
    .where('list', '=', list)
    .select('date')
    .execute()
    .then((rows) => rows.map((row) => row.date));
  const missingDates: string[] = [];
  for (let year = MIN_YEAR; year >= MAX_YEAR; year--) {
    const startMonth = year === MAX_YEAR ? MAX_MONTH : 12;
    const endMonth = year === MIN_YEAR ? MIN_MONTH : 1;
    for (let month = startMonth; month >= endMonth; month--) {
      const date = `${year}${month.toString().padStart(2, '0')}`;
      if (!attemptedDates.includes(date)) {
        missingDates.push(date);
      }
    }
  }
  return missingDates;
}

export async function fetchListMessages(list: string) {
  const dates = await fetchMissingListDates(list);
  for (const date of dates) {
    console.log(`Fetching messages for ${list} on ${date}`);
    await fetchListDateMessages(list, date);
    console.log(`Fetched messages for ${list} on ${date}`);
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
