import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { Provider } from 'jotai';

const font = Source_Sans_3({ subsets: ['latin'] });

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
  return (
    <Provider>
      <html lang='en'>
        <body className={font.className}>{children}</body>
      </html>
    </Provider>
  );
}
