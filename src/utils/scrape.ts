import axios from 'axios';
import * as cheerio from 'cheerio';
import { getListAndDateTuples } from './constants';
import db from '@/clients/db';
import _ from 'lodash';

// Sample URL: https://www.postgresql.org/list/pgsql-admin/2023-12/
async function fetchMessageUrls(list: string, date: string) {
  const url = `https://www.postgresql.org/list/${list}/${date}/`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const messageLinks = $('a[href^="/message-id/"]');
  const messageIds = messageLinks
    .map((index, element) => $(element).attr('href'))
    .get()
    .map((messageUrls) => messageUrls.split('/').pop()!);

  return messageIds;
}

// Sample URL: https://www.postgresql.org/message-id/34a83d6f68c2d513a88acb40cdc581c43586a746.camel%40cybertec.at
async function fetchMessage(id: string) {
  const url = `https://www.postgresql.org/message-id/${id}`;
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

  const body = $('.message-content').html()?.trim();

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
    .selectFrom('scrapeLogs')
    .select(['list', 'date'])
    .execute();
  const unseenListAndDateTuples = listAndDateTuples.filter(
    (t1) => !seenListAndDateTuples.some((t2) => _.isEqual(t1, t2))
  );

  for (const tuple of unseenListAndDateTuples) {
    const { list, date } = tuple;
    const slug = `${list}/${date}`;

    try {
      const messageIds = await fetchMessageUrls(list, date);
      const total = messageIds.length;
      let inserted = 0;
      let skipped = 0;
      let errors = 0;

      console.log(`Scraping ${total} messages from ${slug}`);
      for (const messageId of messageIds) {
        try {
          const existingMessage = await db
            .selectFrom('messages')
            .where('id', '=', messageId)
            .executeTakeFirst();
          if (!existingMessage) {
            const message = await fetchMessage(messageId);
            await db.insertInto('messages').values(message).execute();
            console.log(`Scraped message ${messageId}`);
            inserted += 1;
          } else {
            console.log(`Skipping message ${messageId}`);
            skipped += 1;
          }
        } catch (error) {
          await db
            .insertInto('errorMessages')
            .values({ id: messageId })
            .execute();
          errors += 1;
          console.log(`Error scraping message ${messageId}: ${error}`);
        }
      }

      await db.insertInto('scrapeLogs').values(tuple).execute();

      console.log(
        `Scraped ${inserted} messages from ${slug} (${skipped} skipped, ${errors} errors)`
      );
      console.log();
    } catch (error) {
      console.log(`Error scraping ${slug}: ${error}`);
    }
  }
}
