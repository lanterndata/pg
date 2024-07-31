'use client';

import { useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import Modal from './Modal';
import { useAtom } from 'jotai';
import { sortByAtom } from '@/utils/atoms';

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

interface SettingsButtonProps {
  hasQuery: boolean;
}

const SettingsButton = ({ hasQuery }: SettingsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title='Settings'>
        <p className='font-medium mb-1'>Sort by algorithm</p>
        <ul>
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
          <ListItem
            id='elastic'
            name='Elastic'
            checked={sortBy === 'ElasticSearch'}
            onChange={() => setSortBy('ElasticSearch')}
          />
        </ul>
      </Modal>
      <div
        className='py-1 px-5 hover:bg-slate-900 flex items-center gap-x-2 mt-auto hover:cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <FiSettings className='w-4 h-4' />
        <p>Settings</p>
      </div>
      <p className='text-xs px-5'>
        Sorted by {hasQuery ? sortBy : 'latest (no query)'}
      </p>
    </>
  );
};

export default SettingsButton;
