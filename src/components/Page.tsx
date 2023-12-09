import { getThreads } from '@/utils/data';
import Navbar from './Navbar';
import ThreadPreview from './ThreadPreview';
import ThreadView from './ThreadView';

interface PageProps {
  list?: string;
  thread?: string;
}

const Page = async ({ list, thread }: PageProps) => {
  const activeList = list || 'pgsql-admin';
  const threads = await getThreads(activeList);
  const activeThreadId = thread || threads[0]?.id;
  return (
    <div className='flex'>
      <Navbar activeList={activeList} />
      <main className='h-screen w-full white grid grid-cols-3'>
        <div className='bg-teal-50 p-2 flex flex-col gap-y-2 overflow-y-scroll'>
          {threads.map((thread) => (
            <ThreadPreview
              key={thread.id}
              list={activeList}
              thread={thread}
              isActive={activeThreadId === thread.id}
            />
          ))}
        </div>
        <div className='col-span-2 overflow-y-scroll'>
          <ThreadView threadId={activeThreadId} />
        </div>
      </main>
    </div>
  );
};

export default Page;
