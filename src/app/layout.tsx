import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'UNMOCHON | Stories They Pay to Bury',
  description: 'Independent journalism. Unapologetic truth-telling. We uncover the stories others are paid to suppress.',
};

import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
