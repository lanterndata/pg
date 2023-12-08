import Navbar from './Navbar';

interface PageProps {
  list?: string;
}

const Page = async ({ list }: PageProps) => {
  const activeList = list || 'pgsql-admin';
  return (
    <div className='flex'>
      <Navbar activeList={activeList} />
      <main className='h-screen w-full white grid grid-cols-2'>
        <div></div>
        <div></div>
      </main>
    </div>
  );
};

export default Page;
