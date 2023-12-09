'use client';
import { Message } from './MessageView';
import ThreadPreview from './ThreadPreview';
import ThreadView from './ThreadView';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Thread {
  id: string;
  from: string;
  subject: string;
  ts: Date;
  count: number;
}

interface PageProps {
  list: string;
  getThreads: (list: string) => Promise<Thread[]>;
  getThreadMessages: (threadId: string) => Promise<Message[]>;
}

const Main = ({ list, getThreads, getThreadMessages }: PageProps) => {
  const params = useSearchParams();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadId, setThreadId] = useState('');
  const defaultThreadId = params.get('thread');
  useEffect(() => {
    getThreads(list).then((threads) => {
      setThreads(threads);
      if (threads.length > 0) {
        if (defaultThreadId && threads.find((t) => t.id === defaultThreadId)) {
          setThreadId(defaultThreadId);
        } else {
          setThreadId(threads[0].id);
        }
      }
    });
  }, [list, getThreads, defaultThreadId]);

  return (
    <main className='h-screen w-full white grid grid-cols-4'>
      <div className='bg-slate-100 p-2 flex flex-col gap-y-2 overflow-y-scroll'>
        {threads.map((thread) => (
          <ThreadPreview
            key={thread.id}
            list={list}
            thread={thread}
            isActive={threadId === thread.id}
          />
        ))}
      </div>
      <div className='col-span-3 overflow-y-scroll'>
        <ThreadView threadId={threadId} getThreadMessages={getThreadMessages} />
      </div>
    </main>
  );
};

export default Main;
