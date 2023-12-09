'use client';
import MessageView, { Message } from './MessageView';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const LoadingView = () => <div className='pt-6 pl-8'>Loading...</div>;
const EmptyView = () => <div className='pt-6 pl-8'>No thread to show.</div>;

interface ThreadViewProps {
  loading?: boolean;
  threadId?: string;
  getThreadMessages: (threadId: string) => Promise<Message[]>;
}

const ThreadView = ({
  loading,
  threadId,
  getThreadMessages,
}: ThreadViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (threadId)
      getThreadMessages(threadId).then((messages) => setMessages(messages));
  }, [threadId, getThreadMessages]);

  if (loading) {
    return <LoadingView />;
  }

  if (!threadId) {
    return <EmptyView />;
  }

  const message = messages.find((m) => m.id === threadId);
  if (!message) {
    return <EmptyView />;
  }

  const href = `https://www.postgresql.org/message-id/${threadId}`;

  return (
    <div className='pr-12 pl-4 pt-8 pb-8'>
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
