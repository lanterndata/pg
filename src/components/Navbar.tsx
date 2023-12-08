import { CATEGORY_LISTS } from '@/utils/constants';
import classNames from 'classnames';
import Link from 'next/link';

interface NavbarProps {
  activeList: string;
}

const Navbar = ({ activeList }: NavbarProps) => (
  <nav className='h-screen w-80 bg-teal-100 text-stone-500 px-2 py-8 overflow-y-scroll'>
    <Link href='/'>
      <p className='px-4 font-semibold text-sm'>POSTGRES.FYI</p>
    </Link>

    <p className='px-4 font-medium mt-2 mb-8 text-2xl'>Mailing Lists</p>

    {CATEGORY_LISTS.map((cl) => (
      <div key={cl.category} className='mt-4'>
        <p className='font-semibold mb-1 px-4'>{cl.category.toUpperCase()}</p>
        {cl.lists.map((l) => {
          const isActive = l.list === activeList;
          return (
            <Link key={l.list} href={'/' + l.list}>
              <div
                className={classNames(
                  'py-1 rounded px-4',
                  isActive
                    ? 'bg-teal-600 text-stone-100'
                    : 'hover:bg-teal-200 text-stone-600'
                )}
              >
                # {l.list}
              </div>
            </Link>
          );
        })}
      </div>
    ))}
  </nav>
);

export default Navbar;
