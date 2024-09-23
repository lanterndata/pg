'use client';

import { useState } from 'react';

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
  fromName: string;
  fromAddress: string;
  subject: string | null;
  ts: Date;
  body: string | null;
  inReplyTo: string | null;
}

interface MessageViewProps {
  message: Message;
  messages: Message[];
  layer: number;
}

function startsWithQuote(line: string) {
  const l = line.trim();
  return l.startsWith('&gt;') || l.startsWith('>');
}

function isLineLight(line: string) {
  return (
    (line && line.includes('________________________________')) ||
    line.includes('Sent from my iPhone') ||
    line.includes('Sent from my Galaxy') ||
    line.startsWith('-- ') ||
    startsWithQuote(line)
  );
}

function countMessages(message: Message, messages: Message[]): number {
  const replies = messages.filter((m) => m.inReplyTo === message.id);
  let count = 1;
  replies.forEach((reply) => {
    count += countMessages(reply, messages);
  });
  return count;
}

const MessageView = ({ message, messages, layer }: MessageViewProps) => {
  const [collapsed, setCollapsed] = useState(layer > 3);
  const replies = messages.filter((m) => m.inReplyTo === message.id);
  return (
    <>
      <div className='rounded border border-slate-300 shadow drop-shadow w-full'>
        <div className='flex text-sm bg-slate-300 px-4 py-2'>
          <p className='mr-auto'>{message.fromName}</p>
          <p>{formatDate(message.ts)}</p>
          {layer === 0 || messages.length === 0 ? null : collapsed ? (
            <p
              className='ml-4 cursor-pointer'
              onClick={() => setCollapsed(false)}
            >
              {'[ ' + countMessages(message, messages) + ' more ]'}
            </p>
          ) : (
            <p
              className='ml-4 cursor-pointer'
              onClick={() => setCollapsed(true)}
            >
              {'[ hide ]'}
            </p>
          )}
        </div>
        {!collapsed && (
          <div className='bg-slate-50 p-4'>
            {message.body
              ?.trim()
              .split('\n')
              .map((line, index) => (
                <p
                  key={message.id + '-' + index}
                  className={isLineLight(line) ? 'text-stone-400' : ''}
                >
                  {line.trim() === '' ? '\u00A0' : line}
                </p>
              ))}
          </div>
        )}
      </div>

      {!collapsed && replies.length > 0 && (
        <div className='flex items-stretch pt-8'>
          <div className='w-0.5 mr-8 bg-slate-300' />
          <div className='w-full flex flex-col gap-y-8'>
            {replies.map((reply) => (
              <MessageView
                key={reply.id}
                message={reply}
                messages={messages}
                layer={layer + 1}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MessageView;
