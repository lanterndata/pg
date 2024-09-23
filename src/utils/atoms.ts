import { FontType, SortByType } from './types';
import { atomWithStorage } from 'jotai/utils';

export const sortByAtom = atomWithStorage<SortByType>(
  'sort-by-atom',
  'default'
);

export const fontAtom = atomWithStorage<FontType>(
  'font-family',
  'source-sans-3'
);
