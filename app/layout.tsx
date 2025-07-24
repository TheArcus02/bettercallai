import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Terms of Service Analyzer',
  description:
    'Analyze Terms of Service documents and identify potential red flags, warnings, and important clauses with AI-powered insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          geistSans.className
        )}
      >
        <div
          id='root'
          className='relative flex min-h-screen flex-col overflow-hidden bg-background'
        >
          {children}
        </div>
      </body>
    </html>
  );
}
