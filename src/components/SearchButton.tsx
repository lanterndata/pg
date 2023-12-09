'use client';
import { useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';

const SearchButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button className='bg-slate-800 w-full rounded text-left py-1.5 border border-slate-600 px-2 flex items-center'>
        <HiMagnifyingGlass className='mr-2' />
        Search mailing lists
      </button>
    </>
  );
};

export default SearchButton;
