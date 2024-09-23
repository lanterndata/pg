import type { Metadata } from 'next';
import './globals.css';
import { Provider } from 'jotai';

export const metadata: Metadata = {
  title: 'Lantern | Search Postgres Mailing Lists',
  description: 'Postgres mailing list search engine, powered by Lantern',
  metadataBase: new URL('https://pg.lantern.dev'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider>{children}</Provider>;
}
