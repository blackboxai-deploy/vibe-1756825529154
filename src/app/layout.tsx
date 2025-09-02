import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tic Tac Toe - AI Challenge',
  description: 'Challenge an AI opponent in Tic Tac Toe with three difficulty levels: Easy, Medium, and Hard',
  keywords: ['tic tac toe', 'ai game', 'strategy game', 'puzzle', 'board game'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}