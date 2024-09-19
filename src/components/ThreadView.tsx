'use client';
import MessageView, { Message } from './MessageView';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Loading from './Loader';

const EmptyView = () => <div className='pt-8 pl-8'>No thread to show.</div>;

interface ThreadViewProps {
  loading?: boolean;
  threadId?: string;
  getThreadMessages: (threadId: string) => Promise<Message[]>;
  back?: () => void;
}

const ThreadView = ({
  loading: threadsLoading,
  threadId,
  getThreadMessages,
  back,
}: ThreadViewProps) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  useEffect(() => {
    if (threadId) {
      getThreadMessages(threadId).then((messages) => {
        setMessages(messages);
        setMessage(messages.find((m) => m.id === threadId) ?? null);
        setLoading(false);
      });
    }
  }, [threadId, getThreadMessages]);

  if (!threadId && !threadsLoading) {
    return <EmptyView />;
  }

  if (loading || threadsLoading) {
    return <Loading />;
  }

  if (!threadId) {
    return <EmptyView />;
  }

  if (!message) {
    return <EmptyView />;
  }

  const href = `https://www.postgresql.org/message-id/${threadId}`;

  return (
    <div className='px-12 pt-8 pb-8'>
      <div className='mb-8'>
        {back && (
          <p className='text-slate-600 mb-2' onClick={back}>
            {'< '}Back to all threads
          </p>
        )}
        <h1 className='text-2xl font-medium'>{message.subject}</h1>
        <div className='mt-2 w-full h-0.5 bg-slate-300' />
      </div>

      <MessageView message={message} messages={messages} layer={0} />
      <div className='mt-12 text-sm font-medium'>
        Source:{' '}
        <Link href={href} className='text-slate-500'>
          {href}
        </Link>
      </div>
    </div>
  );
};

export default ThreadView;
