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
  getThreads: (list: string, page: number) => Promise<Thread[]>;
  getThreadMessages: (threadId: string) => Promise<Message[]>;
}

const Main = ({ list, getThreads, getThreadMessages }: PageProps) => {
  const params = useSearchParams();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadId, setThreadId] = useState('');
  const [page, setPage] = useState(0);
  const defaultThreadId = params.get('thread');
  useEffect(() => {
    getThreads(list, page).then((threads) => {
      setThreads(threads);
      if (threads.length > 0) {
        if (defaultThreadId && threads.find((t) => t.id === defaultThreadId)) {
          setThreadId(defaultThreadId);
        } else {
          setThreadId(threads[0].id);
        }
      }
    });
  }, [list, page, getThreads, defaultThreadId]);

  return (
    <main className='h-screen w-full white grid grid-cols-4'>
      <div className='bg-slate-900 px-2 pt-2 pb-4 flex flex-col gap-y-2 overflow-y-scroll'>
        {threads.map((thread) => (
          <ThreadPreview
            key={thread.id}
            list={list}
            thread={thread}
            isActive={threadId === thread.id}
            onClick={() => setThreadId(thread.id)}
          />
        ))}

        {(threads.length === 20 || page > 0) && (
          <div className='flex justify-between mt-4 mx-2 text-stone-500 font-medium'>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
              {'<'} Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={threads.length < 20}
            >
              Next {'>'}
            </button>
          </div>
        )}
      </div>
      <div className='col-span-3 overflow-y-scroll'>
        <ThreadView threadId={threadId} getThreadMessages={getThreadMessages} />
      </div>
    </main>
  );
};

export default Main;
