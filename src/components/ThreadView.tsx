'use client';
import MessageView, { Message } from './MessageView';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ThreadViewProps {
  threadId?: string;
  getThreadMessages: (threadId: string) => Promise<Message[]>;
}

const ThreadView = ({ threadId, getThreadMessages }: ThreadViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (threadId)
      getThreadMessages(threadId).then((messages) => setMessages(messages));
  }, [threadId, getThreadMessages]);

  if (!threadId) {
    return null;
  }

  const message = messages.find((m) => m.id === threadId);
  if (!message) {
    return null;
  }

  const href = `https://www.postgresql.org/message-id/${threadId}`;

  return (
    <div className='pr-12 pl-4 pt-8 pb-8 bg-slate-200 min-h-screen'>
      <div className='ml-8 mb-8'>
        <h1 className='text-2xl font-medium'>{message.subject}</h1>
        <div className='mt-2 w-full h-0.5 bg-slate-300' />
      </div>

      <MessageView message={message} messages={messages} />
      <div className='ml-8 mt-12 text-sm font-medium'>
        Source:{' '}
        <Link href={href} className='text-slate-500'>
          {href}
        </Link>
      </div>
    </div>
  );
};

export default ThreadView;
