import axios from 'axios';
import * as cheerio from 'cheerio';
import { getListAndDateTuples } from './constants';

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
    ts,
    from,
    cc,
    inReplyTo,
  };
}

export async function scrapeMessages() {
  const listAndDateTuples = getListAndDateTuples();
  // Check database to see if we have already scraped this list/date combination
  return;
}
