'use client';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchInputProps {
  value: string;
  setValue: (value: string) => void;
}

const SearchInput = ({ value, setValue }: SearchInputProps) => (
  <div className='mt-8 bg-slate-800 w-full rounded py-1.5 border border-slate-600 px-2 lg:flex items-center hidden'>
    <input
      className='bg-slate-800 w-full focus:outline-none placeholder-stone-400 text-stone-100 mr-1'
      placeholder='Search mailing lists'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
    {value ? <FiX onClick={() => setValue('')} /> : <FiSearch />}
  </div>
);

export default SearchInput;
