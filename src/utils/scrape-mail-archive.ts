import axios from 'axios';
import * as cheerio from 'cheerio';
import { getListAndDateTuples } from './constants';
import db from '@/clients/db';
import _ from 'lodash';

const BASE = 'https://www.postgresql.org';

// Sample main URL: https://www.postgresql.org/list/pgsql-admin/2023-12/
// Sample secondary URL: https://www.postgresql.org/list/pgsql-bugs/since/202305230900
async function fetchMessageUrls(list: string, date: string) {
  const urls: string[] = [];

  urls.push(`${BASE}/list/${list}/${date}/`);
  urls.push(`${BASE}/list/${list}/since/${date.replace('-', '')}060000`);
  urls.push(`${BASE}/list/${list}/since/${date.replace('-', '')}110000`);
  urls.push(`${BASE}/list/${list}/since/${date.replace('-', '')}160000`);
  urls.push(`${BASE}/list/${list}/since/${date.replace('-', '')}210000`);
  urls.push(`${BASE}/list/${list}/since/${date.replace('-', '')}260000`);

  const messageIds: string[] = [];

  for (const url of urls) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const messageLinks = $('a[href^="/message-id/"]');
    messageIds.push(
      ...messageLinks
        .map((index, element) => $(element).attr('href'))
        .get()
        .map((messageUrls) => messageUrls.split('/').pop()!)
    );
  }
  return _.uniq(messageIds);
}

// Sample URL: https://www.postgresql.org/message-id/34a83d6f68c2d513a88acb40cdc581c43586a746.camel%40cybertec.at
async function fetchMessage(id: string) {
  const url = `${BASE}/message-id/${id}`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const lists = $('.listname a')
    .map((index, element) => $(element).text())
    .get();

  const to = $('tr th:contains("To:") + td')
    .text()
    .split(',')
    .map((address) => address.trim());

  const subject = $('tr th:contains("Subject:") + td').text().trim();

  const body = $('.message-content').html()!.trim();

  const ts = $('tr th:contains("Date:") + td').text().trim();

  const from = $('tr th:contains("From:") + td').text().trim();

  const cc = $('tr th:contains("Cc:") + td')
    .text()
    .split(',')
    .map((email) => email.trim())
    .filter((email) => !!email);

  const inResponseToHeader = $('h3.messages:contains("In response to")');
  const messageResponses = inResponseToHeader.next('.message-responses');
  const messageIds = messageResponses
    .find('a')
    .map((index, element) => $(element).attr('href')!.split('/').pop())
    .get();
  const inReplyTo = messageIds[0];

  return {
    id,
    lists,
    to,
    subject,
    body,
    ts,
    from,
    cc,
    inReplyTo,
  };
}

export async function scrapeMessages() {
  const listAndDateTuples = getListAndDateTuples();
  const seenListAndDateTuples = await db
    .selectFrom('messagesScrapeLogs')
    .select(['list', 'date'])
    .execute();
  const unseenListAndDateTuples = listAndDateTuples.filter(
    (t1) => !seenListAndDateTuples.some((t2) => _.isEqual(t1, t2))
  );

  for (const tuple of unseenListAndDateTuples) {
    const { list, date } = tuple;
    const slug = `${list}/${date}`;

    try {
      const t1 = new Date().getTime();
      const messageIds = await fetchMessageUrls(list, date);
      const t2 = new Date().getTime();
      console.log(
        `Fetched ${messageIds.length} message IDs from ${slug} in time ${
          t2 - t1
        }ms`
      );

      const seenMessageIds = await db
        .selectFrom('messages')
        .select('id')
        .where('id', 'in', messageIds)
        .execute()
        .then((rows) => rows.map((row) => row.id));
      const unseenMessageIds = messageIds.filter(
        (messageId) => !seenMessageIds.includes(messageId)
      );

      const total = unseenMessageIds.length;
      let inserted = 0;
      let errors = 0;

      console.log(`Scraping ${total} messages from ${slug}`);
      for (const messageId of unseenMessageIds) {
        try {
          const message = await fetchMessage(messageId);
          await db.insertInto('messages').values(message).execute();
          console.log(`Scraped message ${messageId}`);
          inserted += 1;
        } catch (error) {
          await db
            .insertInto('messagesScrapeErrors')
            .values({ id: messageId })
            .execute();
          errors += 1;
          console.log(`Error scraping message ${messageId}: ${error}`);
        }
      }
      const t3 = new Date().getTime();
      console.log(
        `Scraped ${total} messages from ${slug} in time ${t3 - t2}ms`
      );

      await db.insertInto('messagesScrapeLogs').values(tuple).execute();

      console.log(
        `Scraped ${inserted} messages from ${slug} (${errors} errors)`
      );
      console.log();
    } catch (error) {
      console.log(`Error scraping ${slug}: ${error}`);
    }
  }
}
