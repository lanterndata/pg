import PageClient from './PageClient';
import { getThreadMessages, getThreads, searchThreadsText } from '@/utils/data';

interface PageProps {
  list?: string;
}

const Page = ({ list }: PageProps) => {
  const activeList = list || 'pgsql-admin';
  return (
    <PageClient
      list={activeList}
      getThreads={getThreads}
      getThreadMessages={getThreadMessages}
      searchThreads={searchThreadsText}
    />
  );
};

export default Page;
