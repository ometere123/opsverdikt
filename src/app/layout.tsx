import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'OpsVerdikt Protocol — Decentralized Consensus for High-Pressure Operations',
  description: 'Resolve operational pressure before it becomes failure. GenLayer-powered consensus for defensible labor decisions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-floor-black text-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
