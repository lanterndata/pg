'use client';
import { Message } from './MessageView';
import Navbar from './Navbar';
import ThreadPreview from './ThreadPreview';
import ThreadView from './ThreadView';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import OrderBy from './OrderBy';
import { SortByType, Thread } from '@/utils/types';
import { useAtom } from 'jotai';
import { sortByAtom } from '@/utils/atoms';
import classNames from 'classnames';
import Link from 'next/link';

interface PageProps {
  list: string | undefined;
  getThreads: (list: string | undefined, page: number) => Promise<Thread[]>;
  getThreadMessages: (threadId: string) => Promise<Message[]>;
  searchThreads: (
    list: string | undefined,
    query: string,
    orderBy: 'relevance' | 'latest',
    mode: SortByType
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

  const [searchMode] = useAtom(sortByAtom);
  const [searchValue, setSearchValue] = useState('');
  const [orderBy, setOrderBy] = useState<'relevance' | 'latest'>('relevance');
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const shouldPerformSearch = debouncedSearchValue.length > 1;

  // State to manage which view is active on mobile
  const [activeView, setActiveView] = useState<'navbar' | 'threads' | 'thread'>(
    list ? 'threads' : 'navbar'
  );

  // Fetch threads on load
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

  // Fetch threads on search
  useEffect(() => {
    if (shouldPerformSearch) {
      setLoading(true);
      searchThreads(list, debouncedSearchValue, orderBy, searchMode).then(
        (threads) => {
          setThreads(threads);
          if (threads.length > 0) setThreadId(threads[0].id);
          setLoading(false);
        }
      );
    }
  }, [
    list,
    debouncedSearchValue,
    orderBy,
    shouldPerformSearch,
    searchThreads,
    searchMode,
  ]);

  const Threads = ({
    className,
    BackButton,
  }: {
    className?: string;
    BackButton?: () => JSX.Element;
  }) => (
    <div
      className={classNames(
        'bg-slate-900 h-screen px-2 pt-2 pb-4 flex flex-col gap-y-2 overflow-y-scroll',
        className
      )}
    >
      <div className='text-slate-50 mt-5 mb-3'>
        {BackButton ? <BackButton /> : null}
        <p>{list ? '# ' + list : 'All mailing lists'}</p>
      </div>
      {shouldPerformSearch && (
        <p className='text-slate-500'>
          Searching for &quot;{searchValue}&quot;
        </p>
      )}
      {shouldPerformSearch && (
        <div className='grid grid-cols-2 gap-x-2 text-slate-400'>
          <OrderBy
            value='relevance'
            orderBy={orderBy}
            setOrderBy={setOrderBy}
          />
          <OrderBy value='latest' orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
      )}
      {!loading && threads.length === 0 ? (
        <p className='text-slate-500'>No threads found.</p>
      ) : loading ? (
        <p className='text-slate-500'>Loading threads...</p>
      ) : (
        threads.map((thread) => (
          <ThreadPreview
            key={thread.id}
            list={!list ? thread.lists?.[0] : undefined}
            thread={thread}
            isActive={threadId === thread.id}
            onClick={() => {
              setThreadId(thread.id);
              setActiveView('thread');
            }}
          />
        ))
      )}

      {!shouldPerformSearch && (threads.length === 20 || page > 0) && (
        <div className='flex justify-between items-center mt-4 mx-2 text-slate-500 font-medium'>
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className={
              'text-sm ' + (page === 0 ? 'text-slate-500' : 'text-slate-300')
            }
          >
            {'<'} Prev
          </button>
          <p className='text-slate-300'>Page {page + 1}</p>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={threads.length < 20}
            className={
              'text-sm ' +
              (threads.length < 20 ? 'text-slate-500' : 'text-slate-300')
            }
          >
            Next {'>'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className='hidden lg:flex'>
        <Navbar
          activeList={list}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          className='w-80'
        />
        <main className='h-screen w-full white grid grid-cols-4'>
          <Threads />

          <div className='col-span-3 overflow-y-scroll bg-slate-200 min-h-screen'>
            <ThreadView
              loading={loading}
              threadId={threadId}
              getThreadMessages={getThreadMessages}
            />
          </div>
        </main>
      </div>
      <div className='lg:hidden'>
        {activeView === 'navbar' ? (
          <Navbar
            activeList={list}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            className='w-screen'
          />
        ) : activeView === 'thread' ? (
          <div className='overflow-y-scroll bg-slate-200 min-h-screen'>
            <ThreadView
              loading={loading}
              threadId={threadId}
              getThreadMessages={getThreadMessages}
              back={() => setActiveView('threads')}
            />
          </div>
        ) : (
          <Threads
            className='w-screen'
            BackButton={() => (
              <Link href='/'>
                <div className='flex items-center mb-2 text-slate-400 mr-4'>
                  <p>{'< '}Back to all mailing lists</p>
                </div>
              </Link>
            )}
          />
        )}
      </div>
    </>
  );
};

export default PageClient;
