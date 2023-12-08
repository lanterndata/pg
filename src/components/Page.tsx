import { getThreads } from '@/utils/data';
import Navbar from './Navbar';
import ThreadPreview from './ThreadPreview';
import ThreadView from './ThreadView';

interface PageProps {
  list?: string;
}

const Page = async ({ list }: PageProps) => {
  const activeList = list || 'pgsql-admin';
  const threads = await getThreads(activeList);
  const activeThreadId = threads[0]?.id;
  return (
    <div className='flex'>
      <Navbar activeList={activeList} />
      <main className='h-screen w-full white grid grid-cols-3'>
        <div className='bg-teal-50 overflow-y-scroll p-2 flex flex-col gap-y-2'>
          {threads.map((thread) => (
            <ThreadPreview
              key={thread.id}
              thread={thread}
              isActive={activeThreadId === thread.id}
            />
          ))}
        </div>
        <div className='col-span-2'>
          <ThreadView />
        </div>
      </main>
    </div>
  );
};

export default Page;
