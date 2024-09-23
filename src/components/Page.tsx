'use client';
import {
  Fira_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  JetBrains_Mono,
  Source_Sans_3,
} from 'next/font/google';
import PageClient from './PageClient';
import {
  getThreadMessages,
  getThreads,
  searchThreads,
} from '@/utils/fetch-mail';
import { useAtom } from 'jotai';
import { fontAtom } from '@/utils/atoms';

const sourceSans = Source_Sans_3({ subsets: ['latin'] });
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

interface PageProps {
  list?: string;
}

const Page = ({ list }: PageProps) => {
  const activeList = list || undefined;
  const [fontName] = useAtom(fontAtom);
  const font = fontName === 'ibm-plex-mono' ? ibmPlexMono : sourceSans;
  return (
    <html lang='en'>
      <body className={font.className}>
        <PageClient
          list={activeList}
          getThreads={getThreads}
          getThreadMessages={getThreadMessages}
          searchThreads={searchThreads}
        />
      </body>
    </html>
  );
};

export default Page;
