import Page from '@/components/Page';

interface ListPageProps {
  params: { list: string };
}

export default function ListPage({ params: { list } }: ListPageProps) {
  return <Page list={list} />;
}
