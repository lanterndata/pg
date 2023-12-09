import Page from '@/components/Page';

interface ListPageProps {
  params: { list: string; thread: string };
}

export default function ListPage({ params: { list, thread } }: ListPageProps) {
  return <Page list={list} thread={thread} />;
}
