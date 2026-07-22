import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/shared/Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'SurakshaNet AI | Fraud Interception',
  description: 'Real-Time Digital Arrest Scam Interception & Fraud Network Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jbMono.variable} font-sans bg-[#050511] text-slate-200 antialiased h-screen flex overflow-hidden relative`}>
        {/* Cyber Aesthetics Layers */}
        <div className="cyber-grid" />
        <div className="scanlines" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-transparent to-transparent pointer-events-none z-[-1]" />
        
        <Navigation />
        <main className="flex-1 overflow-y-auto relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
