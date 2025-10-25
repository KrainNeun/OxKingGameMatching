import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'チーム分けツール - OxKing Game Matching',
  description: 'ネット対戦ゲーム用の自動チーム分けツール',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#1570EF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
