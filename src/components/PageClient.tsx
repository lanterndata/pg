'use client';
import { Message } from './MessageView';
import Navbar from './Navbar';
import ThreadPreview from './ThreadPreview';
import ThreadView from './ThreadView';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import OrderBy from './OrderBy';

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
  searchThreads: (
    query: string,
    orderBy: 'relevance' | 'latest'
  ) => Promise<Thread[]>;
}

const PageClient = ({
  list,
  getThreads,
  getThreadMessages,
  searchThreads,
}: PageProps) => {
  const [loading, setLoading] = useState(true);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadId, setThreadId] = useState('');
  const [page, setPage] = useState(0);

  const [searchValue, setSearchValue] = useState('');
  const [orderBy, setOrderBy] = useState<'relevance' | 'latest'>('relevance');
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const shouldPerformSearch = debouncedSearchValue.length > 2;

  useEffect(() => {
    if (!shouldPerformSearch) {
      setLoading(true);
      getThreads(list, page).then((threads) => {
        setThreads(threads);
        if (threads.length > 0) setThreadId(threads[0].id);
        setLoading(false);
      });
    }
  }, [list, page, getThreads, shouldPerformSearch]);

  useEffect(() => {
    if (shouldPerformSearch) {
      setLoading(true);
      searchThreads(debouncedSearchValue, orderBy).then((threads) => {
        setThreads(threads);
        if (threads.length > 0) setThreadId(threads[0].id);
        setLoading(false);
      });
    }
  }, [debouncedSearchValue, orderBy, shouldPerformSearch, searchThreads]);

  return (
    <div className='flex'>
      <Navbar
        activeList={list}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />

      <main className='h-screen w-full white grid grid-cols-4'>
        <div className='bg-slate-900 px-2 pt-2 pb-4 flex flex-col gap-y-2 overflow-y-scroll'>
          <p className='text-stone-50 mt-5 mb-3'>
            {shouldPerformSearch ? 'Query: ' + searchValue : '# ' + list}
          </p>
          {searchValue && (
            <div className='grid grid-cols-2 gap-x-2 mb-2 text-stone-400'>
              <OrderBy
                value='relevance'
                orderBy={orderBy}
                setOrderBy={setOrderBy}
              />
              <OrderBy
                value='latest'
                orderBy={orderBy}
                setOrderBy={setOrderBy}
              />
            </div>
          )}
          {!loading && threads.length === 0 ? (
            <p className='text-stone-500'>No threads found.</p>
          ) : loading ? (
            <p className='text-stone-500'>Loading threads...</p>
          ) : (
            threads.map((thread) => (
              <ThreadPreview
                key={thread.id}
                list={list}
                thread={thread}
                isActive={threadId === thread.id}
                onClick={() => setThreadId(thread.id)}
              />
            ))
          )}

          {!shouldPerformSearch && (threads.length === 20 || page > 0) && (
            <div className='flex justify-between mt-4 mx-2 text-stone-500 font-medium'>
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
              >
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
        <div className='col-span-3 overflow-y-scroll bg-slate-200 min-h-screen'>
          <ThreadView
            loading={loading}
            threadId={threadId}
            getThreadMessages={getThreadMessages}
          />
        </div>
      </main>
    </div>
  );
};

export default PageClient;
