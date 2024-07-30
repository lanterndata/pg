import { CATEGORY_LISTS } from '@/utils/constants';
import classNames from 'classnames';
import Link from 'next/link';
import SearchInput from './SearchInput';
import SettingsButton from './SettingsButton';

interface NavbarProps {
  activeList: string;
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
          <Link key={l.list} href={'/' + l.list}>
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

    <SettingsButton hasQuery={hasQuery} />
  </nav>
);

export default Navbar;
