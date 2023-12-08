import { CATEGORY_LISTS } from '@/utils/constants';
import classNames from 'classnames';

export default async function Home() {
  const activeList = 'pgsql-admin';
  return (
    <div className='flex'>
      <nav className='h-screen w-80 bg-teal-100 text-stone-500 px-2'>
        {CATEGORY_LISTS.map((cl) => (
          <div key={cl.category} className='mt-4'>
            <p className='font-semibold mb-1 px-4'>
              {cl.category.toUpperCase()}
            </p>
            {cl.lists.map((l) => {
              const isActive = l.list === activeList;
              return (
                <p
                  key={l.list}
                  className={classNames(
                    'py-1 rounded px-4',
                    isActive
                      ? 'bg-teal-600 text-stone-100'
                      : 'hover:bg-teal-200'
                  )}
                >
                  # {l.list}
                </p>
              );
            })}
          </div>
        ))}
      </nav>
      <main className='h-screen w-full white grid grid-cols-2'>
        <div></div>
        <div></div>
      </main>
    </div>
  );
}
