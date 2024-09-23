'use client';

import { useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import Modal from './Modal';
import { useAtom } from 'jotai';
import { fontAtom, sortByAtom } from '@/utils/atoms';

interface ListItemProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
}

const ListItem = ({ id, name, checked, onChange }: ListItemProps) => (
  <li>
    <input
      className='cursor-pointer'
      type='radio'
      id={id}
      name='sort'
      value={id}
      checked={checked}
      onChange={onChange}
    />
    <label htmlFor={id} className='cursor-pointer ml-2'>
      {name}
    </label>
  </li>
);

const SettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [font, setFont] = useAtom(fontAtom);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title='Settings'>
        <p className='font-medium mb-1'>Sort by algorithm</p>
        <ul className='flex gap-x-8'>
          <ListItem
            id='default'
            name='Default'
            checked={sortBy === 'default'}
            onChange={() => setSortBy('default')}
          />
          <ListItem
            id='vector'
            name='Vector'
            checked={sortBy === 'vector search'}
            onChange={() => setSortBy('vector search')}
          />
          <ListItem
            id='text'
            name='Text'
            checked={sortBy === 'Postgres FTS'}
            onChange={() => setSortBy('Postgres FTS')}
          />
        </ul>

        <p className='font-medium mt-4 mb-1'>Font</p>
        <ul className='flex gap-x-9'>
          <ListItem
            id='source-sans-3'
            name='Source Sans 3'
            checked={font === 'source-sans-3'}
            onChange={() => setFont('source-sans-3')}
          />
          <ListItem
            id='ibm-plex-mono'
            name='IBM Plex Mono'
            checked={font === 'ibm-plex-mono'}
            onChange={() => setFont('ibm-plex-mono')}
          />
        </ul>
      </Modal>
      <div
        className='py-1 px-5 hover:bg-slate-900 flex items-center gap-x-2 hover:cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <FiSettings className='w-4 h-4' />
        <p>Settings</p>
      </div>
    </>
  );
};

export default SettingsButton;
