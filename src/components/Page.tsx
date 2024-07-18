import PageClient from './PageClient';
import {
  getThreadMessages,
  getThreads,
  searchThreads,
} from '@/utils/fetch-mail';

interface PageProps {
  list?: string;
}

const Page = ({ list }: PageProps) => {
  const activeList = list || 'pgsql-general';
  return (
    <PageClient
      list={activeList}
      getThreads={getThreads}
      getThreadMessages={getThreadMessages}
      searchThreads={searchThreads}
    />
  );
};

export default Page;
