'use client';
import { HiMagnifyingGlass } from 'react-icons/hi2';

interface SearchInputProps {
  value: string;
  setValue: (value: string) => void;
}

const SearchInput = ({ value, setValue }: SearchInputProps) => (
  <div className='bg-slate-800 w-full rounded py-1.5 border border-slate-600 px-2 flex items-center'>
    <input
      className='bg-slate-800 w-full focus:outline-none placeholder-stone-400 text-stone-100'
      placeholder='Search mailing lists'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
    <HiMagnifyingGlass className='ml-1' />
  </div>
);

export default SearchInput;
