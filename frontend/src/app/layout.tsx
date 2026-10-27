import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navigation from '@/components/shared/Navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Suraksha Setu | Understand, protect, report',
  description: 'A guided cyber-fraud awareness and incident preparation prototype for India. Understand warning signs, get official reporting guidance and prepare a local report.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} min-h-screen bg-[#090f19] font-sans text-slate-100 antialiased`}>
        <Navigation />
        <main id="main-content" className="min-h-[calc(100vh-80px)]">{children}</main>
        <footer className="border-t border-white/10 bg-[#0a1019] px-5 py-7 text-center text-xs leading-6 text-slate-400">
          Suraksha Setu is an educational prototype, not a police, banking or emergency service. No calls are intercepted, transactions blocked, or official complaints filed here.
          <span className="block mt-1">For cybercrime reporting in India, use the official portal at cybercrime.gov.in or call 1930.</span>
        </footer>
      </body>
    </html>
  );
}