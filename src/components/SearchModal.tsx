import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className='fixed w-screen h-screen top-0 left-0 z-40 bg-black opacity-50' />

      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        <div
          ref={modalRef}
          className='z-10 inset-0 bg-slate-50 rounded-lg overflow-hidden w-full relative max-w-3xl'
        >
          <div className='py-2 border border-b border-slate-300 flex'>
            <input
              className='w-full h-10 block py-4 px-6 text-lg outline-none bg-slate-50 text-stone-700 placeholder-stone-400'
              placeholder='Search Postgres mailing lists'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
            <HiMagnifyingGlass className='text-stone-400 w-6 h-6 mx-6 mt-2' />
          </div>
          <p className='px-6 py-2 text-stone-400 bg-slate-100 text-sm'>
            Powered by{' '}
            <Link href='https://lantern.dev' className='font-medium'>
              Lantern.dev
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
