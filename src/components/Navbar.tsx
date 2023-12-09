import { CATEGORY_LISTS } from '@/utils/constants';
import classNames from 'classnames';
import Link from 'next/link';

interface NavbarProps {
  activeList: string;
}

const Navbar = ({ activeList }: NavbarProps) => (
  <nav className='h-screen w-80 bg-slate-950 text-stone-300 py-8 overflow-y-scroll'>
    <div className='px-5'>
      <Link href='/'>
        <p className='font-semibold text-sm'>POSTGRES.FYI</p>
      </Link>
      <p className='font-medium mt-2 mb-8 text-2xl'>Mailing Lists</p>
    </div>

    {CATEGORY_LISTS.map((cl) => (
      <div key={cl.category} className='mt-4'>
        <p className='font-semibold mb-1 text-stone-500 px-5'>
          {cl.category.toUpperCase()}
        </p>
        {cl.lists.map((l) => {
          const isActive = l.list === activeList;
          return (
            <Link key={l.list} href={'/' + l.list}>
              <div
                className={classNames(
                  'py-1 rounded px-5',
                  isActive
                    ? 'bg-slate-700 text-stone-100'
                    : 'hover:bg-slate-900'
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
