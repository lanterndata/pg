import { SortByType } from './types';
import { atomWithStorage } from 'jotai/utils';

export const sortByAtom = atomWithStorage<SortByType>(
  'sort-by-atom',
  'default'
);
