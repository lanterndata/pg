import Navbar from './Navbar';
import Main from './Main';
import { getThreadMessages, getThreads } from '@/utils/data';

interface PageProps {
  list?: string;
}

const Page = async ({ list }: PageProps) => {
  const activeList = list || 'pgsql-admin';
  return (
    <div className='flex'>
      <Navbar activeList={activeList} />
      <Main
        list={activeList}
        getThreads={getThreads}
        getThreadMessages={getThreadMessages}
      />
    </div>
  );
};

export default Page;
