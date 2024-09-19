import { CATEGORY_LISTS } from '@/utils/constants';
import classNames from 'classnames';
import Link from 'next/link';
import SearchInput from './SearchInput';
import SettingsButton from './SettingsButton';
import { FiGithub, FiArrowUpRight } from 'react-icons/fi';

interface NavbarProps {
  activeList: undefined | string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  hasQuery: boolean;
}

const Navbar = ({
  activeList,
  searchValue,
  setSearchValue,
  hasQuery,
}: NavbarProps) => (
  <nav className='h-screen w-80 bg-slate-950 text-stone-300 py-8 overflow-y-scroll flex flex-col'>
    <div className='px-5'>
      <Link href='/'>
        <p className='font-semibold text-sm'>PG.LANTERN.DEV</p>
      </Link>
      <p className='font-medium mt-2 mb-8 text-2xl'>Mailing Lists</p>

      <SearchInput value={searchValue} setValue={setSearchValue} />
    </div>

    {CATEGORY_LISTS.map((cl) => (
      <div key={cl.category} className='mt-4'>
        <p className='font-semibold mb-1 text-stone-500 px-5'>
          {cl.category.toUpperCase()}
        </p>
        {cl.lists.map((l) => (
          <Link key={l.list} href={l.list === activeList ? '/' : '/' + l.list}>
            <div
              className={classNames(
                'py-1 px-5',
                l.list === activeList
                  ? 'bg-slate-700 text-stone-100'
                  : 'hover:bg-slate-900'
              )}
            >
              # {l.list}
            </div>
          </Link>
        ))}
      </div>
    ))}

    <div className='mt-auto'>
      <Link href='https://github.com/lanterndata/pg' target='_blank'>
        <div className='flex items-center py-1 px-5 hover:bg-slate-900 gap-x-2 hover:cursor-pointer'>
          <FiGithub className='w-4 h-4' />
          <p>Star us on Github</p>
          <FiArrowUpRight className='w-4 h-4' />
        </div>
      </Link>
      <SettingsButton />
    </div>
  </nav>
);

export default Navbar;
