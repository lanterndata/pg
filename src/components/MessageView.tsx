import { useEffect, useRef } from 'react';
import sanitizeHtml from 'sanitize-html';

function formatDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
  return formattedDate;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  ts: Date;
  body: string;
  inReplyTo: string | null;
}

interface MessageViewProps {
  message: Message;
  messages: Message[];
}

function startsWithQuote(line: string) {
  const l = line.trim();
  return l.startsWith('&gt;') || l.startsWith('> ');
}

function isAuthorLine(line: string) {
  return line.trim().endsWith(':');
}

function isAuthorParagraph(paragraph: HTMLParagraphElement) {
  const lines = paragraph.innerHTML.split('<br>');
  return (
    isAuthorLine(lines[0]) &&
    lines.length > 1 &&
    lines
      .slice(1)
      .map(startsWithQuote)
      .every((x) => x)
  );
}

function modifyParagraph(paragraph: HTMLParagraphElement) {
  const lines = paragraph.innerHTML.split('<br>');
  for (let i = 0; i < lines.length; i++) {
    if (startsWithQuote(lines[i]) || isAuthorLine(lines[i])) {
      lines[i] = `<span class='quoted-text'>${lines[i].trim()}</span>`;
    }
  }

  // Join the lines back into a single string and update the paragraph's innerHTML
  paragraph.innerHTML = lines.join('<br>');
}

const MessageView = ({ message, messages }: MessageViewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const replies = messages.filter((m) => m.inReplyTo === message.id);
  const html = sanitizeHtml(message.body);

  useEffect(() => {
    if (contentRef.current) {
      const paragraphs = contentRef.current.getElementsByTagName('p');
      let isQuote = false;
      for (const paragraph of paragraphs) {
        if (isQuote) {
          paragraph.classList.add('quoted-text');
        } else if (
          paragraph.textContent?.includes('________________________________') ||
          paragraph.textContent?.includes('Sent from my iPhone') ||
          paragraph.textContent?.includes('Sent from my Galaxy') ||
          paragraph.textContent?.startsWith('-- ')
        ) {
          paragraph.classList.add('quoted-text');
          isQuote = true;
        }

        // Handle p tag that starts with >
        else if (
          paragraph.textContent &&
          startsWithQuote(paragraph.textContent)
        ) {
          // paragraph.classList.add('text-stone-400');
          modifyParagraph(paragraph);
        }

        // Handle p tag that starts with On [date] [author] wrote: and then has &gt with <br>'s in between
        else if (isAuthorParagraph(paragraph)) {
          paragraph.classList.add('quoted-text');
        }
      }
    }
  }, [html]);

  return (
    <div className='ml-8'>
      <div className='bg-slate-50 p-4 rounded border border-slate-300 shadow drop-shadow w-full'>
        <div className='flex justify-between mb-4 text-stone-400 text-sm'>
          <p>{message.from}</p>
          <p>{formatDate(message.ts)}</p>
        </div>
        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {replies.length > 0 && (
        <div className='flex items-stretch pt-8'>
          <div className='w-0.5 bg-slate-300' />
          <div className='w-full flex flex-col gap-y-8'>
            {replies.map((reply) => (
              <MessageView key={reply.id} message={reply} messages={messages} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageView;
