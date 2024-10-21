import type { Metadata } from 'next';
import './globals.css';
import { PropsWithChildren } from 'react';
import Nav from '../components/Nav';

export const metadata: Metadata = {
  title: 'test-vel',
  description: 'test-vel',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
