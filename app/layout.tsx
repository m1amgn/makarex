// layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { PropsWithChildren } from 'react';
import Web3Providers from '@/components/Web3Providers';

export const metadata: Metadata = {
  title: 'test-vel',
  description: 'test-vel',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru">
      <body>
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
